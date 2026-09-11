const { spawn } = require("child_process");

class Player {
    constructor() {
        this.process = null;
        this.isPaused = false;
        this.isStopping = false;
    }

    play(songPath, onFinish) {
        this.stop();

        console.log(`▶ Playing: ${songPath}`);

        const newProcess = spawn("afplay", [songPath]);

        this.process = newProcess;
        this.isPaused = false;
        this.isStopping = false;

        newProcess.on("close", () => {
            if (this.process !== newProcess) {
                return;
            }

            this.process = null;
            this.isPaused = false;

            if (!this.isStopping) {
                onFinish();
            }
        });
    }

    pause() {
        if (!this.process || this.isPaused) {
            return;
        }

        this.process.kill("SIGSTOP");
        this.isPaused = true;

        console.log("⏸ Paused");
    }

    resume() {
        if (!this.process || !this.isPaused) {
            return;
        }

        this.process.kill("SIGCONT");
        this.isPaused = false;

        console.log("▶ Resumed");
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

    stop() {
        if (!this.process) {
            return;
        }

        this.isStopping = true;

        if (this.isPaused) {
            this.process.kill("SIGCONT");
        }

        this.process.kill("SIGTERM");

        this.process = null;
        this.isPaused = false;
    }
}

module.exports = Player;