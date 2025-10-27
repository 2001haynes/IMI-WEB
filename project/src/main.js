/**
 * Main entry point - Bootstraps the interactive instrument portfolio
 */

import { instruments } from './components/instruments.js';
import { initYouTubePlayer, getPlayer } from './components/videoController.js';

// YouTube video ID
const YOUTUBE_VIDEO_ID = '5cP7HtnagEk';

/**
 * Dynamically generates instrument navigation buttons
 */
function generateInstrumentButtons(instruments) {
    const nav = document.getElementById('instrumentNav');

    if (!nav) {
        console.error('Navigation element not found');
        return;
    }

    instruments.forEach((instrument, index) => {
        const button = document.createElement('button');
        button.className = 'instrument-button';
        button.setAttribute('data-instrument-id', instrument.id);

        button.innerHTML = `
            <div class="instrument-button-content">
                <img src="${instrument.image}" alt="${instrument.name}">
            </div>
            <span class="instrument-name">${instrument.name}</span>
        `;

        nav.appendChild(button);
    });
}

/**
 * Initialize the application when DOM is ready
 */
function init() {
    const logo = document.querySelector('.logo');
    const muteButton = document.getElementById('muteButton');
    const muteIcon = document.getElementById('muteIcon');
    const unmuteIcon = document.getElementById('unmuteIcon');
    const closeInfoButton = document.getElementById('closeInfoButton');
    let isMuted = true; // Video starts muted

    // Generate instrument navigation buttons
    generateInstrumentButtons(instruments);

    // Initialize YouTube player
    initYouTubePlayer(YOUTUBE_VIDEO_ID, instruments, (player) => {
        console.log('YouTube player initialized successfully');

        // Make logo clickable to restart video
        if (logo) {
            logo.style.cursor = 'pointer';
            logo.addEventListener('click', () => {
                const ytPlayer = getPlayer();
                if (ytPlayer && ytPlayer.seekTo) {
                    ytPlayer.seekTo(0, true);
                    ytPlayer.playVideo();

                    // Hide info panel
                    const infoPanel = document.getElementById('info');
                    if (infoPanel) {
                        infoPanel.classList.remove('visible');
                    }

                    // Remove active state from all buttons
                    document.querySelectorAll('.instrument-button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                }
            });
        }

        // Initialize mute button visual state (show muted icon - X)
        if (muteButton && muteIcon && unmuteIcon) {
            muteIcon.classList.add('hidden'); // Hide sound waves
            unmuteIcon.classList.remove('hidden'); // Show X
        }

        // Mute/Unmute button functionality
        if (muteButton) {
            muteButton.addEventListener('click', () => {
                const ytPlayer = getPlayer();
                if (ytPlayer && ytPlayer.unMute && ytPlayer.mute) {
                    if (isMuted) {
                        // Unmute - show sound waves icon
                        try {
                            ytPlayer.unMute();
                            ytPlayer.setVolume(100); // Set volume to max

                            // Verify it worked
                            setTimeout(() => {
                                const isMutedCheck = ytPlayer.isMuted();
                                const volume = ytPlayer.getVolume();
                                console.log('Unmute attempt - isMuted:', isMutedCheck, 'volume:', volume);

                                if (isMutedCheck) {
                                    console.error('Failed to unmute - YouTube player still reports muted');
                                }
                            }, 100);

                            muteIcon.classList.remove('hidden'); // Show sound waves
                            unmuteIcon.classList.add('hidden'); // Hide X
                            isMuted = false;
                            console.log('Audio unmuted, volume set to 100');
                        } catch (error) {
                            console.error('Error unmuting:', error);
                        }
                    } else {
                        // Mute - show X icon
                        ytPlayer.mute();
                        muteIcon.classList.add('hidden'); // Hide sound waves
                        unmuteIcon.classList.remove('hidden'); // Show X
                        isMuted = true;
                        console.log('Audio muted');
                    }
                } else {
                    console.error('YouTube player not ready or methods not available');
                }
            });
        }

        // Close info panel button functionality
        if (closeInfoButton) {
            closeInfoButton.addEventListener('click', () => {
                const infoPanel = document.getElementById('info');
                if (infoPanel) {
                    infoPanel.classList.remove('visible');
                }
            });
        }
    });

    console.log('IMI Interactive Portfolio initialized successfully');
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already loaded
    init();
}
