/**
 * Video Controller - Handles YouTube video scrubbing and instrument selection
 */

let currentInstrumentIndex = -1;
let player = null;
let updateInterval = null;

/**
 * Shows the info panel
 */
function showInfoPanel() {
    const panel = document.getElementById('info');
    if (panel) {
        panel.classList.add('visible');
    }
}

/**
 * Hides the info panel
 */
function hideInfoPanel() {
    const panel = document.getElementById('info');
    if (panel) {
        panel.classList.remove('visible');
    }
}

/**
 * Updates the info panel with instrument details
 */
function updateInfoPanel(instrument) {
    const nameEl = document.getElementById('instrumentName');
    const descEl = document.getElementById('instrumentDescription');
    const imgEl = document.getElementById('instrumentImg');

    if (nameEl) nameEl.textContent = instrument.name;
    if (descEl) descEl.textContent = instrument.description;
    if (imgEl) {
        imgEl.src = instrument.image;
        imgEl.alt = instrument.name;
    }
}

/**
 * Highlights the active instrument button
 */
function highlightActiveInstrument(instruments, activeIndex) {
    instruments.forEach((instrument, index) => {
        const button = document.querySelector(`[data-instrument-id="${instrument.id}"]`);
        if (button) {
            if (index === activeIndex) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    });
}

/**
 * Determines which instrument is currently playing based on video time
 */
function getCurrentInstrumentIndex(instruments, currentTime) {
    for (let i = 0; i < instruments.length; i++) {
        if (currentTime >= instruments[i].startTime && currentTime < instruments[i].endTime) {
            return i;
        }
    }
    // Default to last instrument if time exceeds all ranges
    return instruments.length - 1;
}

/**
 * Initializes YouTube IFrame Player with existing iframe element
 */
export function initYouTubePlayer(videoId, instruments, onReady) {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // YouTube API will call this function when ready
    window.onYouTubeIframeAPIReady = function() {
        // Target the existing iframe element
        const iframeElement = document.getElementById('mainVideo');

        player = new YT.Player(iframeElement, {
            events: {
                'onReady': function(event) {
                    setupVideoControls(player, instruments);
                    if (onReady) onReady(player);
                },
                'onStateChange': function(event) {
                    // Handle video end - loop back to beginning
                    if (event.data === YT.PlayerState.ENDED) {
                        player.seekTo(0);
                        player.playVideo();
                    }
                }
            }
        });
    };
}

/**
 * Sets up video controls and event listeners for YouTube player
 */
function setupVideoControls(ytPlayer, instruments) {
    if (!ytPlayer || !instruments || instruments.length === 0) {
        console.error('Invalid player or instruments data');
        return;
    }

    player = ytPlayer;

    // Poll for video time updates (YouTube doesn't have native timeupdate event)
    updateInterval = setInterval(() => {
        if (player && player.getCurrentTime) {
            const currentTime = player.getCurrentTime();
            const newIndex = getCurrentInstrumentIndex(instruments, currentTime);

            // Only update if the instrument has changed
            if (newIndex !== currentInstrumentIndex) {
                currentInstrumentIndex = newIndex;
                highlightActiveInstrument(instruments, currentInstrumentIndex);
            }
        }
    }, 100); // Check every 100ms

    // Set up click handlers for instrument buttons
    instruments.forEach((instrument, index) => {
        const button = document.querySelector(`[data-instrument-id="${instrument.id}"]`);

        if (button) {
            button.addEventListener('click', () => {
                if (player && player.seekTo) {
                    player.seekTo(instrument.startTime, true);
                    currentInstrumentIndex = index;
                    updateInfoPanel(instrument);
                    showInfoPanel();
                    highlightActiveInstrument(instruments, index);

                    // Ensure video is playing and unmuted for user interaction
                    if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
                        player.playVideo();
                    }
                }
            });
        }
    });
}

/**
 * Returns the YouTube player instance
 */
export function getPlayer() {
    return player;
}

/**
 * Cleans up the video controller
 */
export function cleanup() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}
