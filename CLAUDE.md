# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive single-page portfolio website showcasing five musical instruments through a YouTube video background. Users can click on instrument icons to scrub to specific sections of the video and view detailed information about each instrument.

## Development Setup

**Local Development:**
- Use VS Code Live Server extension
- Right-click on `index.html` and select "Open with Live Server"
- The site will be available at `http://localhost:5500/`

**No Build Process:**
- Pure vanilla JavaScript with ES6 modules
- No bundler, transpiler, or package manager
- Direct HTML/CSS/JS implementation

## Architecture

### Core Application Flow

1. **Initialization (`src/main.js`):**
   - Entry point loads on DOMContentLoaded
   - Dynamically generates instrument navigation buttons from `instruments.js` data
   - Initializes YouTube IFrame API player
   - Sets up logo click handler (restarts video) and mute button functionality

2. **YouTube Integration (`src/components/videoController.js`):**
   - Uses YouTube IFrame API with direct iframe embed (NOT programmatic player creation)
   - The iframe already exists in HTML with `/embed/` URL format
   - API is attached to existing iframe element via `new YT.Player(iframeElement, {...})`
   - Polls video time every 100ms (YouTube has no native timeupdate event)
   - Handles video scrubbing via `player.seekTo(timestamp, true)`

3. **Video Time Tracking:**
   - `getCurrentInstrumentIndex()` determines active instrument based on current playback time
   - Auto-highlights corresponding instrument button as video plays
   - Info panel only shows when user clicks an instrument button (hidden by default)

4. **Instrument Data (`src/components/instruments.js`):**
   - Array of 5 instruments with exact video timestamps (in seconds)
   - Each has: id, name, startTime, endTime, description, image path
   - Order: Windboard (1:17), MelodiKeys (1:52), DrumKit (2:31), Shaker (3:00), Syntar (3:40)

### Key Design Decisions

**YouTube Embed Approach:**
- Direct iframe with `/embed/` URL (not API-generated player)
- This approach eliminates black bars that appeared with programmatic player creation
- All hide-UI parameters in URL: `controls=0`, `modestbranding=1`, `showinfo=0`, etc.
- `enablejsapi=1` allows IFrame API to control the existing iframe

**Glassmorphism UI:**
- All floating elements use `backdrop-filter: blur(30px+) saturate(180%)` with transparent backgrounds
- Minimal overlay (10% black) on video to let content shine through
- No sidebar—purely floating elements: logo (top-left), mute button (top-right), instrument icons (left-center), info panel (right)

**Instrument Icons:**
- 70px circular buttons with white backgrounds
- Images use `object-fit: contain` with `transform: scale(1.2)` for optimal fit
- Tooltips appear on hover (slide from left on desktop, top on mobile)
- Active state has purple gradient background

**Info Panel Behavior:**
- Hidden by default (`opacity: 0`)
- Only shows when user clicks an instrument button
- Smooth slide-in animation from right (`translateX(30px) → 0`)
- Clicking logo hides panel and resets all active states

### CSS Architecture

**Responsive Breakpoints:**
- Desktop: Default layout with left sidebar icons and right info panel
- 1024px: Narrower info panel (400px)
- 768px: Mobile layout—icons move to bottom horizontal row, info panel stacks on top

**Video Scaling:**
- Uses 16:9 aspect ratio calculations: `height: 56.25vw` and `min-width: 177.77vh`
- Centered with `transform: translate(-50%, -50%)`
- `pointer-events: none` prevents clicking through to YouTube

**Color Palette:**
- Primary gradient: `#667eea → #764ba2` (purple)
- Glass backgrounds: `rgba(255, 255, 255, 0.08)` with strong blur
- Active/hover states: purple glow with increased opacity

## Important Implementation Details

### YouTube Player Control
- **Always** use `getPlayer()` from videoController to access player instance
- Player methods: `seekTo(seconds, allowSeekAhead)`, `mute()`, `unMute()`, `setVolume(0-100)`, `isMuted()`, `getVolume()`
- Video starts muted (required for autoplay), user must click mute button to hear audio

### Modifying Instrument Data
- Edit `src/components/instruments.js` to change timestamps, descriptions, or images
- Timestamps are in seconds (not mm:ss format)
- Image paths are relative to `index.html`: `./assets/filename.jpg`
- `id` must match `data-instrument-id` attribute for button selection

### Adding New Instruments
1. Add object to `instruments` array in `instruments.js`
2. Ensure image exists in `assets/` folder
3. Set `startTime` and `endTime` in seconds
4. Button is automatically generated—no HTML changes needed

### Styling Consistency
- All floating UI elements should use same glass effect pattern:
  ```css
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  ```
- Hover states add purple tint: `border-color: rgba(102, 126, 234, 0.5)`

## File Structure
```
/
├── index.html                          # Main HTML (includes YouTube iframe)
├── styles/
│   └── main.css                       # All styles (no preprocessor)
├── src/
│   ├── main.js                        # Entry point & initialization
│   └── components/
│       ├── instruments.js             # Instrument data with timestamps
│       └── videoController.js         # YouTube player control & video scrubbing
└── assets/                            # Images and logo
```

## Common Modifications

**Changing Video:**
- Update `YOUTUBE_VIDEO_ID` in `src/main.js` (line 9)
- Update iframe `src` URL in `index.html` (line 14)

**Adjusting Instrument Timestamps:**
- Edit `startTime` and `endTime` values in `src/components/instruments.js`

**Changing Glassmorphism Intensity:**
- Adjust `backdrop-filter: blur(Xpx)` values in CSS
- Higher blur = more frosted glass effect

**Mobile Layout Adjustments:**
- Modify `@media (max-width: 768px)` section in `main.css`
