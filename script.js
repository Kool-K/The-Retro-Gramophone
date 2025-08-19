document.addEventListener("DOMContentLoaded", () => {
  // element selector
  const gramophoneDropzone = document.getElementById("gramophone-dropzone");
  const recordsContainer = document.querySelector(".records-container");
  const audioPlayer = document.getElementById("audio-player");
  const playBtn = document.getElementById("play-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const nowPlayingDisplay = document.getElementById("now-playing");
  const subtitle = document.querySelector(".subtitle");

  //state and helper
  const clickSound = new Audio("music/click.mp3");

  // initialization
  initialize();

  function initialize() {
    createFloatingNotes(15);
    setupControls();
    setupSortableDragAndDrop();
    setupMobileRackToggle();
    // setupCustomScrollers();
  }

  // music and ui
  function playSong(songSrc, songLabel) {
    if (!songSrc) return;
    audioPlayer.src = songSrc;
    audioPlayer.play();
    clickSound.play();
    nowPlayingDisplay.textContent = `Now Playing: ${songLabel}`;
    subtitle.style.opacity = "0";
    gramophoneDropzone.classList.add("playing");
    playBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
  }

  // event listeners
  function setupControls() {
    playBtn.addEventListener("click", () => {
      if (audioPlayer.src && audioPlayer.paused) {
        audioPlayer.play();
        clickSound.play();
        playBtn.style.display = "none";
        pauseBtn.style.display = "inline-block";
        gramophoneDropzone.classList.add("playing");
      }
    });

    pauseBtn.addEventListener("click", () => {
      audioPlayer.pause();
      clickSound.play();
      pauseBtn.style.display = "none";
      playBtn.style.display = "inline-block";
      gramophoneDropzone.classList.remove("playing");
    });

    audioPlayer.onended = () => {
      gramophoneDropzone.classList.remove("playing");
      playBtn.style.display = "inline-block";
      pauseBtn.style.display = "none";
      nowPlayingDisplay.textContent = "";
      subtitle.style.opacity = "1";
    };
  }

  // drag drop logic + haptic feedback (vibrate)
  function setupSortableDragAndDrop() {
    const recordItems = document.querySelectorAll(".record-item");
    recordItems.forEach((item) => {
      item.addEventListener("contextmenu", (e) => e.preventDefault());
    });
    new Sortable(recordsContainer, {
      group: {
        name: "records",
        pull: "clone",
        put: false,
      },
      animation: 150,
      sort: false,
      handle: ".record-image",
    });

    new Sortable(gramophoneDropzone, {
      group: "records",
      animation: 150,
      scroll: true,
      scrollSensitivity: 100,
      scrollSpeed: 15,
      onAdd: function (evt) {
        const droppedRecord = evt.item;
        const songSrc = droppedRecord.dataset.song;
        const songLabel = droppedRecord.dataset.label;
        playSong(songSrc, songLabel);
        droppedRecord.remove();
      },
    });
  }

  // decoration functions
  function createFloatingNotes(count) {
    const notes = ["♪", "♫", "♩", "♬"];
    for (let i = 0; i < count; i++) {
      const note = document.createElement("div");
      note.className = "floating-note";
      note.textContent = notes[Math.floor(Math.random() * notes.length)];
      note.style.left = Math.random() * 100 + "vw";
      note.style.fontSize = Math.random() * 15 + 10 + "px";
      note.style.animationDuration = Math.random() * 15 + 10 + "s";
      note.style.animationDelay = Math.random() * 10 + "s";
      document.body.appendChild(note);
    }
  }

  function setupMobileRackToggle() {
    const toggleBtn = document.getElementById("toggle-rack-btn");
    const recordRack = document.querySelector(".record-rack");
    const toggleArrow = toggleBtn.querySelector(".toggle-arrow");

    if (toggleBtn && recordRack) {
      toggleBtn.addEventListener("click", () => {
        recordRack.classList.toggle("rack-is-open");

        // change arrow dep on state
        if (recordRack.classList.contains("rack-is-open")) {
          toggleArrow.textContent = "›"; // close (points right)
        } else {
          toggleArrow.textContent = "‹"; // open (points left)
        }
      });
    }
  }
});