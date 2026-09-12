# 🎵 Music Player

A lightweight, terminal-based music player built with Node.js. Browse your local MP3 library, control playback, and navigate through tracks directly in your terminal using only your keyboard — no GUI required.

## Features

- 📂 **Library Auto-Discovery**: Automatically detects all `.mp3` files in the `songs/` directory.
- ⌨️ **Keyboard Navigation**: Browse with arrow keys and press Enter to play.
- ⏯️ **Playback Controls**: Full play, pause, resume, next, and previous track controls.
- 🔄 **Circular Playlist**: Wraps around seamlessly between the first and last tracks.
- 📊 **Live Progress Bar**: Displays real-time playback progress, elapsed time, and total track duration.
- ⏭️ **Auto-Play**: Automatically proceeds to the next track upon song completion.
- 🖥️ **In-Place Terminal UI**: Clean ANSI rendering with zero screen flickering and no terminal history clutter.
- 🛡️ **Graceful Error Handling**: Detects corrupt or empty audio files and reports status without crashing or cascading skips.

## Prerequisites

- **macOS** (utilizes built-in `afplay` for audio playback)
- [Node.js](https://nodejs.org/) v14 or higher
- [ffmpeg](https://ffmpeg.org/) (for `ffprobe` duration extraction):
  ```bash
  brew install ffmpeg
  ```

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/your-username/music_player.git
cd music_player
```

**2. Add your songs**

Drop your `.mp3` files into the `songs/` directory:

```
songs/
├── song1.mp3
├── song2.mp3
└── ...
```

**3. Run the player**

```bash
node index.js
```

## Controls

| Key | Action |
|---|---|
| `↑` | Move selection up |
| `↓` | Move selection down |
| `Enter` | Play selected song |
| `Space` | Pause / Resume playback |
| `N` | Play next song |
| `P` | Play previous song |
| `Q` or `Ctrl+C` | Quit player |

## Project Structure

```
music_player/
├── index.js        # Terminal UI, key listener, and application logic
├── player.js       # Audio playback and process controller (afplay / ffprobe)
├── package.json    # Project metadata
├── songs/          # MP3 audio files directory
└── README.md       # Project documentation
```

## How It Works

The player scans the `songs/` directory at startup and sets up raw mode on `stdin` to capture keypresses immediately without requiring Enter. Audio is streamed via macOS's native `afplay` utility, with durations parsed through `ffprobe`. The interface updates in-place using ANSI cursor positioning and line erasure codes (`\x1b[H`, `\x1b[K`, and `\x1b[J`) for a smooth, flicker-free terminal experience.

## License

ISC
