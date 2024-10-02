const socket = io();
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// Show welcome message and hide command interface for mobile devices
if (isMobileDevice()) {
    document.querySelector('.container').style.display = 'none'; // Hide command interface
    document.querySelector('.welcome-message').style.display = 'block'; // Show welcome message
    document.querySelector('.mobile-background').style.display = 'block'; // Show mobile-specific background video
} else {
    const videoBackgrounds = document.querySelectorAll('.video-background');
    let currentIndex = 0;
    
    function switchBackground() {
        videoBackgrounds.forEach((video, index) => {
            video.style.display = index === currentIndex ? 'block' : 'none';
        });
        currentIndex = (currentIndex + 1) % videoBackgrounds.length;
        setTimeout(switchBackground, 15000); // Switch every 15 seconds
    }

    switchBackground();
}

function sendCommand() {
    const select = document.getElementById('commandSelect');
    const cmd = select.value;
    if (cmd) {
        socket.emit('command', cmd);
        select.selectedIndex = 0; // Reset to default option
    }
}

socket.on('command', (cmd) => {
    console.log('Received command:', cmd);
    handleCommand(cmd);
});

function handleCommand(cmd) {
    if (cmd === 'alert') {
        alert('Command received!');
    } else if (cmd.startsWith('notify:')) {
        const message = cmd.substring(7);
        if (Notification.permission === 'granted') {
            new Notification('New Message', { body: message });
        } else {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('New Message', { body: message });
                }
            });
        }
    } else if (cmd === 'vibrate') {
        if ('vibrate' in navigator) {
            navigator.vibrate(200); // Vibrate for 200 milliseconds
        } else {
            console.log('Vibration API not supported');
        }
    } else if (cmd === 'flicker') {
        document.body.classList.add('flicker');
        setTimeout(() => {
            document.body.classList.remove('flicker');
        }, 3000); // Flicker for 3 seconds
    } else if (cmd === 'ring') {
        document.body.classList.add('ring');
        setTimeout(() => {
            document.body.classList.remove('ring');
        }, 3000); // Ring effect for 3 seconds

        // Play ringing sound
        playRingingSound();
    } else if (cmd === 'freeze') {
        freezeDevice();
    } else if (cmd === 'unfreeze') {
        unfreezeDevice();
    } else {
        console.log('Unknown command:', cmd);
    }
}

function freezeDevice() {
    const overlay = document.getElementById('freezeOverlay');
    overlay.style.display = 'flex'; // Show the overlay
    document.body.classList.add('freeze'); // Apply freeze class
    setTimeout(() => {
        overlay.style.display = 'none'; // Hide the overlay after 5 seconds
        document.body.classList.remove('freeze'); // Remove freeze class
    }, 5000); // Freeze for 5 seconds
}

function unfreezeDevice() {
    const overlay = document.getElementById('freezeOverlay');
    overlay.style.display = 'none'; // Hide the overlay immediately
    document.body.classList.remove('freeze'); // Remove freeze class
}

function playRingingSound() {
    const audio = new Audio('ringing-sound.mp3'); // Replace with your ringing sound file
    audio.play();
}