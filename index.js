const fs = require("fs");
const Player = require("./player");

const songsPath = "./songs";

const songs = fs.readdirSync(songsPath)
    .filter(song => song.toLowerCase().endsWith(".mp3"));

let selectedSong = 0;
let currentSongIndex = -1;
let progressTimer = null;

const player = new Player();


function formatTime(seconds) {
    if (!seconds || seconds < 0) {
        seconds = 0;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}


function progressBar(currentTime, duration) {
    const totalBars = 30;

    if (!duration || duration <= 0) {
        return "------------------------------";
    }

    const progress = Math.min(1, Math.max(0, currentTime / duration));
    const filledBars = Math.floor(progress * totalBars);
    const emptyBars = totalBars - filledBars;

    return "━".repeat(filledBars) + "●" + "━".repeat(emptyBars);
}


function startTimer() {
    if (progressTimer) {
        return;
    }

    progressTimer = setInterval(() => {
        if (player.process && !player.isPaused) {
            render();
        }
    }, 500);
}


function stopTimer() {
    if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
    }
}


function playSong() {
    if (songs.length === 0) {
        return;
    }

    const song = songs[selectedSong];
    const songPath = `${songsPath}/${song}`;

    currentSongIndex = selectedSong;

    player.play(songPath, () => {
        nextSong();
    }, () => {
        render();
    });

    startTimer();
    render();
}


function nextSong() {
    if (songs.length === 0) {
        return;
    }

    selectedSong++;

    if (selectedSong >= songs.length) {
        selectedSong = 0;
    }

    playSong();
}


function previousSong() {
    if (songs.length === 0) {
        return;
    }

    selectedSong--;

    if (selectedSong < 0) {
        selectedSong = songs.length - 1;
    }

    playSong();
}


function render() {
    let output = "";

    output += "🎵 MY MUSIC\n";
    output += "------------------------------\n";

    if (songs.length === 0) {
        output += "  No songs found\n";
    } else {
        songs.forEach((song, index) => {
            let marker = " ";

            if (index === selectedSong) {
                marker = ">";
            }

            if (index === currentSongIndex) {
                marker = "▶";
            }

            output += `${marker} ${song}\n`;
        });
    }

    output += "------------------------------\n";

    if (currentSongIndex !== -1 && songs[currentSongIndex]) {
        output += `Now Playing: ${songs[currentSongIndex]}\n`;

        if (player.hasError) {
            output += "Status: ⚠️ Error (unable to play)\n";
        } else if (player.isPaused) {
            output += "Status: ⏸ Paused\n";
        } else if (player.process) {
            output += "Status: ▶ Playing\n";
        } else {
            output += "Status: ⏹ Stopped\n";
        }

        const currentTime = player.getCurrentTime();
        const duration = player.duration;

        output += "\n";
        output += progressBar(currentTime, duration) + "\n";
        output += `${formatTime(currentTime)} / ${formatTime(duration)}\n`;
    }

    output += "------------------------------\n";
    output += "↑ ↓ Navigate\n";
    output += "ENTER Play\n";
    output += "SPACE Pause / Resume\n";
    output += "N Next\n";
    output += "P Previous\n";
    output += "Q Quit\n";

    const lines = output.split("\n");
    let cleanOutput = "";

    for (let i = 0; i < lines.length; i++) {
        cleanOutput += lines[i] + "\x1b[K\n";
    }

    process.stdout.write("\x1b[H" + cleanOutput + "\x1b[J");
}


function quit() {
    stopTimer();
    player.stop();

    process.stdout.write("\x1b[?25h\n");

    if (process.stdin.isTTY) {
        try {
            process.stdin.setRawMode(false);
        } catch (error) {}
    }

    process.stdin.pause();
    process.exit(0);
}


process.on("SIGINT", quit);
process.on("SIGTERM", quit);


if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

process.stdin.resume();
process.stdin.setEncoding("utf8");


process.stdin.on("data", (key) => {
    if (key.startsWith("\u001B[M") || key.startsWith("\u001B[<")) {
        return;
    }

    if (key === "q" || key === "Q" || key === "\u0003") {
        quit();
    }

    if (key === "\u001B[B") {
        if (songs.length > 0) {
            selectedSong++;

            if (selectedSong >= songs.length) {
                selectedSong = 0;
            }

            render();
        }
    }

    if (key === "\u001B[A") {
        if (songs.length > 0) {
            selectedSong--;

            if (selectedSong < 0) {
                selectedSong = songs.length - 1;
            }

            render();
        }
    }

    if (key === "\r") {
        playSong();
    }

    if (key === " ") {
        if (player.process) {
            player.togglePause();
            render();
        }
    }

    if (key === "n" || key === "N") {
        nextSong();
    }

    if (key === "p" || key === "P") {
        previousSong();
    }
});


process.stdout.write("\x1b[?1000l\x1b[?1002l\x1b[?1003l\x1b[?1006l\x1b[?1007l\x1b[2J\x1b[3J\x1b[H\x1b[?25l");

render();