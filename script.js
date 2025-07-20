const songs = [
  { title: 'Sadhai Bhari', artist: 'Abhaya and the Steam Injuns', file: 'song1.mp3', disc: 'disc1.png' },
  { title: 'Shaky', artist: 'Sanju Rathod Ft. Isha Malviya', file: 'song2.mp3', disc: 'disc2.png' },
  { title: 'Tenu Sang Rakhna', artist: 'Alia Bhatt, Vedang Raina', file: 'song3.mp3', disc: 'disc3.png' },
  { title: 'Uff', artist: 'Sushant Kc', file: 'song4.mp3', disc: 'disc4.png' },
  { title: 'Uyi Amma', artist: 'Vishal Mishra', file: 'song5.mp3', disc: 'disc5.png' },
  { title: 'Jun Na Heri', artist: 'Wangden & Sushan Ghimire', file: 'song6.mp3', disc: 'disc6.png' },
  { title: 'Suna Kaanchi', artist: 'Sajjan Raj Vaidya', file: 'song7.mp3', disc: 'disc7.png' },
  { title: 'Jhim Jhim Aune Aankha', artist: 'Ekdev Limbu', file: 'song8.mp3', disc: 'disc8.png' },
  { title: 'Pahuna', artist: 'Sushant Kc', file: 'song9.mp3', disc: 'disc9.png' },
  { title: 'राधा', artist: 'Swoopna Suman', file: 'song10.mp3', disc: 'disc10.png' }
];

let songIndex = 0;
let favourites = [];

const audio = document.getElementById("audio");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const discEl = document.getElementById("disc");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

function loadSong(index) {
  const song = songs[index];
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  audio.src = `assets/music/${song.file}`;
  discEl.src = `assets/images/${song.disc}`;
}

function playSong() {
  audio.play();
  playBtn.textContent = "⏸";
  playBtn.setAttribute("aria-pressed", "true");
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶️";
  playBtn.setAttribute("aria-pressed", "false");
}

playBtn.addEventListener("click", () => {
  audio.paused ? playSong() : pauseSong();
});

nextBtn.addEventListener("click", () => {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songIndex);
  playSong();
});

prevBtn.addEventListener("click", () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songIndex);
  playSong();
});

audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.value = percent || 0;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

function formatTime(time) {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function buildPlaylist() {
  const playlist = document.getElementById("playlist-list");
  const favList = document.getElementById("favourites-list");
  playlist.innerHTML = "";
  favList.innerHTML = "";

  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.setAttribute("tabindex", "0");

    const info = document.createElement("div");
    info.className = "song-info";
    info.innerHTML = `<strong>${song.title}</strong><br><span>${song.artist}</span>`;

    const heart = document.createElement("button");
    heart.className = "heart";
    heart.innerHTML = favourites.includes(index) ? "❤️" : "🤍";
    if (favourites.includes(index)) heart.classList.add("active");

    heart.addEventListener("click", (e) => {
      e.stopPropagation();
      if (favourites.includes(index)) {
        favourites = favourites.filter(i => i !== index);
      } else {
        favourites.push(index);
      }
      buildPlaylist();
    });

    li.append(info, heart);
    li.addEventListener("click", () => {
      songIndex = index;
      loadSong(songIndex);
      playSong();
    });

    playlist.appendChild(li);
    if (favourites.includes(index)) favList.appendChild(li.cloneNode(true));
  });
}

// Keyboard control
document.body.addEventListener("keydown", (e) => {
  if (e.code === "Space" && document.activeElement.tagName !== 'BUTTON') {
    e.preventDefault();
    playBtn.click();
  }
});

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById(btn.dataset.view).classList.add("active");
  });
});

loadSong(songIndex);
buildPlaylist();
