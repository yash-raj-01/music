const fs = require("fs");
const songsPath = "./songs";
const songs = fs.readdirSync(songsPath);

console.log("🎵 My Music");
console.log("--------------------");

songs.forEach((song, index) => {
    console.log(`${index + 1}. ${song}`);
});