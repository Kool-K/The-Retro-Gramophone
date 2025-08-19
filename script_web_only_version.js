document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS ---
    const dropZone = document.getElementById('gramophone-dropzone');
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const nowPlayingDisplay = document.getElementById('now-playing');
    const subtitle = document.querySelector('.subtitle');
    const recordItems = document.querySelectorAll('.record-item');

    // --- STATE & HELPERS ---
    const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const clickSound = new Audio('music/click.mp3');

    // --- INITIALIZATION ---
    initialize();

    function initialize() {
        createFloatingNotes(15);
        setupControls();

        if (isMobile) {
            document.body.classList.add('is-mobile');
            setupTapToPlay();
        } else {
            document.body.classList.add('is-desktop');
            setupDragAndDrop();
        }
    }

    // --- MUSIC & UI LOGIC ---
    function playSong(songSrc, songLabel) {
        if (!songSrc) return;

        audioPlayer.src = songSrc;
        audioPlayer.play();
        clickSound.play();

        nowPlayingDisplay.textContent = `Now Playing: ${songLabel}`;
        subtitle.style.opacity = '0';
        dropZone.classList.add('playing');
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
                dropZone.classList.add('playing');
            }
        });

        pauseBtn.addEventListener('click', () => {
            audioPlayer.pause();
            clickSound.play();
            pauseBtn.style.display = 'none';
            playBtn.style.display = 'inline-block';
            dropZone.classList.remove('playing');
        });

        audioPlayer.onended = () => {
            dropZone.classList.remove('playing');
            playBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            nowPlayingDisplay.textContent = '';
            subtitle.style.opacity = '1';
        };
    }

    function setupTapToPlay() {
        dropZone.classList.add('show-tap-instruction');
        recordItems.forEach(item => {
            item.addEventListener('click', () => {
                const songSrc = item.dataset.song;
                const songLabel = item.dataset.label;
                playSong(songSrc, songLabel);
            });
        });
    }

    function setupDragAndDrop() {
        dropZone.classList.add('show-drop-instruction');
        const recordImages = document.querySelectorAll('.record-image');

        recordImages.forEach(record => {
            record.draggable = true;
            record.addEventListener('dragstart', (event) => {
                const parentItem = record.closest('.record-item');
                event.dataTransfer.setData('application/json', JSON.stringify({
                    song: parentItem.dataset.song,
                    label: parentItem.dataset.label
                }));
                clickSound.play();
            });
        });

        dropZone.addEventListener('dragover', (event) => {
            event.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (event) => {
            event.preventDefault();
            dropZone.classList.remove('dragover');
            const data = JSON.parse(event.dataTransfer.getData('application/json'));
            playSong(data.song, data.label);
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