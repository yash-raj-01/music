const fs = require("fs");
const Player = require("./player");

const songsPath = "./songs";

const songs = fs.readdirSync(songsPath);

let selectedSong = 0;
let currentSongIndex = -1;

const player = new Player();


function playSong() {

    const song = songs[selectedSong];
    const songPath = `${songsPath}/${song}`;

    currentSongIndex = selectedSong;

    player.play(songPath, () => {
        nextSong();
    });

    render();
}


function nextSong() {

    selectedSong++;

    if (selectedSong >= songs.length) {
        selectedSong = 0;
    }

    playSong();
}


function previousSong() {

    selectedSong--;

    if (selectedSong < 0) {
        selectedSong = songs.length - 1;
    }

    playSong();
}


function render() {

    console.clear();

    console.log("🎵 MY MUSIC");
    console.log("--------------------");


    songs.forEach((song, index) => {

        let marker = " ";

        if (index === selectedSong) {
            marker = ">";
        }

        if (index === currentSongIndex) {
            marker = "▶";
        }

        console.log(`${marker} ${song}`);
    });


    console.log("--------------------");


    if (currentSongIndex !== -1) {

        console.log(`Playing: ${songs[currentSongIndex]}`);

        if (player.isPaused) {
            console.log("Status: ⏸ Paused");
        } else {
            console.log("Status: ▶ Playing");
        }

    }


    console.log("--------------------");

    console.log("\n↑ ↓ Navigate");
    console.log("ENTER Play");
    console.log("SPACE Pause / Resume");
    console.log("N Next");
    console.log("P Previous");
    console.log("Q Quit");
}


process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");


process.stdin.on("data", (key) => {


    if (key === "q") {

        player.stop();

        process.stdin.setRawMode(false);
        process.stdin.pause();

        process.exit(0);
    }


    if (key === "\u001B[B") {

        selectedSong++;

        if (selectedSong >= songs.length) {
            selectedSong = 0;
        }

        render();
    }


    if (key === "\u001B[A") {

        selectedSong--;

        if (selectedSong < 0) {
            selectedSong = songs.length - 1;
        }

        render();
    }


    if (key === "\r") {

        playSong();
    }


    if (key === " ") {

        player.togglePause();

        render();
    }

    if (key === "n") {

        nextSong();
    }

    if (key === "p") {

        previousSong();
    }
});


render();