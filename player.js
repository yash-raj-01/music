const fs = require("fs");
const { spawn, execFileSync } = require("child_process");

class Player {
    constructor() {
        this.process = null;
        this.isPaused = false;
        this.hasError = false;

        this.duration = 0;
        this.startTime = 0;
        this.pausedTime = 0;
        this.pauseStartTime = 0;
    }

    getDuration(songPath) {
        try {
            const result = execFileSync("ffprobe", [
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                songPath
            ], {
                stdio: ["ignore", "pipe", "ignore"]
            });

            const parsed = parseFloat(result.toString().trim());

            if (isNaN(parsed)) {
                return 0;
            }

            return parsed;
        } catch (error) {
            return 0;
        }
    }

    play(songPath, onFinish, onError) {
        this.stop();

        this.hasError = false;

        try {
            const stats = fs.statSync(songPath);

            if (stats.size === 0) {
                this.hasError = true;
                if (onError) onError();
                return;
            }
        } catch (error) {
            this.hasError = true;
            if (onError) onError();
            return;
        }

        this.duration = this.getDuration(songPath);

        this.startTime = Date.now();
        this.pausedTime = 0;
        this.pauseStartTime = 0;

        const newProcess = spawn("afplay", [songPath], {
            stdio: ["ignore", "ignore", "ignore"]
        });

        this.process = newProcess;
        this.isPaused = false;

        newProcess.on("error", () => {
            if (this.process !== newProcess) {
                return;
            }

            this.process = null;
            this.isPaused = false;
            this.hasError = true;

            if (onError) {
                onError();
            }
        });

        newProcess.on("close", (code) => {
            if (this.process !== newProcess) {
                return;
            }

            this.process = null;
            this.isPaused = false;

            if (code === 0) {
                if (onFinish) {
                    onFinish();
                }
            } else {
                this.hasError = true;

                if (onError) {
                    onError();
                }
            }
        });
    }

    pause() {
        if (!this.process || this.isPaused) {
            return;
        }

        this.process.kill("SIGSTOP");

        this.isPaused = true;
        this.pauseStartTime = Date.now();
    }

    resume() {
        if (!this.process || !this.isPaused) {
            return;
        }

        this.process.kill("SIGCONT");

        this.pausedTime += Date.now() - this.pauseStartTime;
        this.isPaused = false;
    }

    togglePause() {
        if (!this.process) {
            return;
        }

        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }

    getCurrentTime() {
        if (!this.process) {
            return 0;
        }

        let elapsed = 0;

        if (this.isPaused) {
            elapsed = (this.pauseStartTime - this.startTime - this.pausedTime) / 1000;
        } else {
            elapsed = (Date.now() - this.startTime - this.pausedTime) / 1000;
        }

        if (elapsed < 0) {
            elapsed = 0;
        }

        if (this.duration > 0 && elapsed > this.duration) {
            elapsed = this.duration;
        }

        return elapsed;
    }

    stop() {
        if (!this.process) {
            return;
        }

        const oldProcess = this.process;

        this.process = null;
        this.isPaused = false;
        this.hasError = false;

        oldProcess.kill("SIGTERM");
    }
}

module.exports = Player;