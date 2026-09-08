const fs = require("fs");

const songsPath = "./songs";

const songs = fs.readdirSync(songsPath);

let selectedSong = 0;

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
});

render();