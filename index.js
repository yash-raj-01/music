const fs = require("fs");
const { spawn } = require("child_process");
const songsPath = "./songs";
const songs = fs.readdirSync(songsPath);

console.log("🎵 My Music");
console.log("--------------------");

songs.forEach((song, index) => {
    console.log(`${index + 1}. ${song}`);
});


const song = songs[3];

console.log(`\n▶ Playing: ${song}`);

const songPath = `${songsPath}/${song}`;

const player = spawn("afplay", [songPath]);

player.on("close", () => {
    console.log("\n⏹ Song finished");
});