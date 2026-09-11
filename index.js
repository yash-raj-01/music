const fs = require("fs");
const Player = require("./player");

const songsPath = "./songs";

const songs = fs.readdirSync(songsPath);

let selectedSong = 0;

const player = new Player();


function playSong() {
    const song = songs[selectedSong];
    const songPath = `${songsPath}/${song}`;

    player.play(songPath, () => {
        nextSong();
    });
}


function nextSong() {
    selectedSong++;

    if (selectedSong >= songs.length) {
        selectedSong = 0;
    }

    playSong();
    render();
}


function previousSong() {
    selectedSong--;

    if (selectedSong < 0) {
        selectedSong = songs.length - 1;
    }

    playSong();
    render();
}


function render() {
    console.clear();

    console.log("🎵 MY MUSIC");
    console.log("--------------------");

    songs.forEach((song, index) => {
        if (index === selectedSong) {
            console.log(`> ${song}`);
        } else {
            console.log(`  ${song}`);
        }
    });

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
    }


    if (key === "n") {
        nextSong();
    }


    if (key === "p") {
        previousSong();
    }
});


render();