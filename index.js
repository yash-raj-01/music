const fs = require("fs");
const { spawn } = require("child_process");

const songsPath = "./songs";

const songs = fs.readdirSync(songsPath);

let selectedSong = 0;
let player = null;

function playSong() {

    if (player) {
        player.kill();
    }

    const song = songs[selectedSong];
    const songPath = `${songsPath}/${song}`;

    console.log(`\n▶ Playing: ${song}`);

    player = spawn("afplay", [songPath]);

    player.on("exit", () => {
        console.log("\n⏹ Song finished")
        player = null;
    });
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
    console.log("Q Quit");
}

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");

process.stdin.on("data", (key) => {

    if (key === "q") {
        process.exit();
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
});

render();