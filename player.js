const { spawn } = require("child_process");

class Player {
    constructor() {
        this.process = null;
        this.isPaused = false;
    }

    play(songPath, onFinish) {
        this.stop();

        const newProcess = spawn("afplay", [songPath]);

        this.process = newProcess;
        this.isPaused = false;

        newProcess.on("close", () => {
            if (this.process !== newProcess) {
                return;
            }

            this.process = null;
            this.isPaused = false;

            onFinish();
        });
    }


    pause() {
        if (!this.process || this.isPaused) {
            return;
        }

        this.process.kill("SIGSTOP");

        this.isPaused = true;
    }


    resume() {
        if (!this.process || !this.isPaused) {
            return;
        }

        this.process.kill("SIGCONT");

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


    stop() {
        if (!this.process) {
            return;
        }

        const oldProcess = this.process;

        this.process = null;
        this.isPaused = false;

        oldProcess.kill("SIGTERM");
    }
}


module.exports = Player;