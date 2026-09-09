const fs = require("fs");
const { spawn } = require("child_process");

const songsPath = "./songs";

const songs = fs.readdirSync(songsPath);

let selectedSong = 0;
let player = null;
let isPaused = false;


function playSong() {
    if (player) {
        player.kill();
    }

    const song = songs[selectedSong];
    const songPath = `${songsPath}/${song}`;

    isPaused = false;

    console.log(`\n▶ Playing: ${song}`);

    player = spawn("afplay", [songPath]);

    player.on("close", () => {
        console.log("\n⏹ Song finished");
        player = null;
        isPaused = false;
    });
}


function togglePause() {
    if (!player) {
        return;
    }

    if (isPaused) {

        player.kill("SIGCONT");
        isPaused = false;

        console.log("\n▶ Resumed");
    } else {

        player.kill("SIGSTOP");
        isPaused = true;

        console.log("\n⏸ Paused");
    }
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
    console.log("Q Quit");
}


process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");


process.stdin.on("data", (key) => {

    if (key === "q") {
        if (player) {
            player.kill();
        }

        process.exit();
    }


    if (key === "\u001B[B") {
        selectedSong++;

        if (selectedSong >= songs.length) {
            selectedSong = 0;
        }

        render();
    }


    // Arrow Up
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
        togglePause();
    }
});


render();