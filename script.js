// script.js (New and Improved with SortableJS)

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS ---
    const gramophoneDropzone = document.getElementById('gramophone-dropzone');
    const recordsContainer = document.querySelector('.records-container');
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const nowPlayingDisplay = document.getElementById('now-playing');
    const subtitle = document.querySelector('.subtitle');

    // --- STATE & HELPERS ---
    const clickSound = new Audio('music/click.mp3');

    // --- INITIALIZATION ---
    initialize();

    function initialize() {
        createFloatingNotes(15);
        setupControls();
        setupSortableDragAndDrop(); // This is our new, unified function
    }

    // --- MUSIC & UI LOGIC ---
    function playSong(songSrc, songLabel) {
        if (!songSrc) return;

        audioPlayer.src = songSrc;
        audioPlayer.play();
        clickSound.play();

        nowPlayingDisplay.textContent = `Now Playing: ${songLabel}`;
        subtitle.style.opacity = '0';
        gramophoneDropzone.classList.add('playing');
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
    }

    // --- EVENT LISTENERS & SETUP ---
    function setupControls() {
        playBtn.addEventListener('click', () => {
            if (audioPlayer.src && audioPlayer.paused) {
                audioPlayer.play();
                clickSound.play();
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'inline-block';
                gramophoneDropzone.classList.add('playing');
            }
        });

        pauseBtn.addEventListener('click', () => {
            audioPlayer.pause();
            clickSound.play();
            pauseBtn.style.display = 'none';
            playBtn.style.display = 'inline-block';
            gramophoneDropzone.classList.remove('playing');
        });

        audioPlayer.onended = () => {
            gramophoneDropzone.classList.remove('playing');
            playBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            nowPlayingDisplay.textContent = '';
            subtitle.style.opacity = '1';
        };
    }

    // --- THE NEW DRAG-AND-DROP LOGIC using SortableJS ---
    function setupSortableDragAndDrop() {
        // 1. Make the records in the rack draggable
        new Sortable(recordsContainer, {
            group: {
                name: 'records',
                pull: 'clone', // Clone the item when dragging, so the original stays in the list
                put: false
            },
            animation: 150,
            sort: false, // Don't allow sorting within the rack itself
        });

        // 2. Make the gramophone a drop zone
        new Sortable(gramophoneDropzone, {
            group: 'records', // Belongs to the same group to accept drops
            animation: 150,
            scroll: true, // Enable auto-scrolling!
            scrollSensitivity: 100, // How close to the edge to start scrolling (in px)
            scrollSpeed: 15, // Speed of scrolling
            onAdd: function (evt) {
                // This function is triggered when a record is dropped onto the gramophone
                const droppedRecord = evt.item; // The HTML element of the record that was dropped
                const songSrc = droppedRecord.dataset.song;
                const songLabel = droppedRecord.dataset.label;

                playSong(songSrc, songLabel);

                // Remove the cloned record from the gramophone area immediately after dropping
                droppedRecord.remove();
            }
        });
    }

    // --- DECORATIVE FUNCTIONS ---
    function createFloatingNotes(count) {
        const notes = ['♪', '♫', '♩', '♬'];
        for (let i = 0; i < count; i++) {
            const note = document.createElement('div');
            note.className = 'floating-note';
            note.textContent = notes[Math.floor(Math.random() * notes.length)];
            note.style.left = Math.random() * 100 + 'vw';
            note.style.fontSize = (Math.random() * 15 + 10) + 'px';
            note.style.animationDuration = (Math.random() * 15 + 10) + 's';
            note.style.animationDelay = Math.random() * 10 + 's';
            document.body.appendChild(note);
        }
    }
});

