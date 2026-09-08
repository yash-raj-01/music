# 🎵 Music Player

A lightweight, terminal-based music player built with Node.js. Browse your local MP3 library and navigate through songs using only your keyboard — no GUI required.

## Features

- 📂 Auto-discovers all songs from the `songs/` directory
- ⌨️ Keyboard navigation (arrow keys to browse, Enter to play)
- 🔄 Circular navigation — wraps around from last song to first and vice versa
- 🖥️ Clean, minimal terminal UI with a highlighted selected track
- Zero external dependencies — uses only Node.js built-ins

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher

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
├── your-song.mp3
├── another-track.mp3
└── ...
```

**3. Run the player**

```bash
node index.js
```

## Controls

| Key     | Action             |
|---------|--------------------|
| `↑`     | Move selection up  |
| `↓`     | Move selection down|
| `Enter` | Play selected song |
| `Q`     | Quit               |

## Project Structure

```
music_player/
├── index.js        # Main application entry point
├── package.json    # Project metadata
├── songs/          # Place your MP3 files here
│   ├── sample.mp3
│   └── ...
└── README.md
```

## How It Works

The player reads the `songs/` directory on startup using Node's `fs` module and renders a list of tracks to the terminal. Raw mode input is enabled on `stdin` so keystrokes are captured instantly without requiring Enter — giving a smooth, interactive feel.
