const questions = {
  professional: {
    text: "Do you want to be a professional musician?",
    yes: "rich",
    no: "girls"
  },
  rich: {
    text: "Are you rich?",
    yes: "enjoy",
    no: "money"
  },
  money: {
    text: "Do you love money?",
    yes: "stop",
    no: "enjoy"
  },
  enjoy: {
    text: "Do you like enjoying life?",
    yes: "beer",
    no: "practice"
  },
  beer: {
    text: "Do you like drinking beer?",
    yes: "classical",
    no: "hot"
  },
  hot: {
    text: "Are you a hot person?",
    yes: "cello",
    no: "mandoline"
  },
  practice: {
    text: "Do you want to practice 8 hours a day?",
    yes: "teach",
    no: "notes"
  },
  teach: {
    text: "Would you like to teach children?",
    yes: "flute",
    no: "violin"
  },
  notes: {
    text: "Can you read notes?",
    yes: "harp",
    no: "viola"
  },
  girls: {
    text: "Do you want to get some girls?",
    yes: "easyGirls",
    no: "guys"
  },
  easyGirls: {
    text: "Do you like easy girls?",
    yes: "drinker",
    no: "guys"
  },
  drinker: {
    text: "Are you a drinker?",
    yes: "guitar",
    no: "piano"
  },
  guys: {
    text: "Do you want to get some guys?",
    yes: "gay",
    no: "bassoon"
  },
  gay: {
    text: "Are you gay?",
    yes: "opera",
    no: "drums"
  },
  classical: {
    text: "Do you want to play classical music?",
    yes: "work",
    no: "jazz",
    dontknow: "trombone"
  },
  work: {
    text: "Do you want to work day and night?",
    yes: "oboe",
    no: "job"
  },
  job: {
    text: "Would you have problems getting a job even if you were playing great?",
    yes: "clarinet",
    no: "horn"
  },
  jazz: {
    text: "Do you want to play jazz?",
    yes: "sax",
    no: "german"
  },
  german: {
    text: "Are you German?",
    yes: "trumpet",
    no: "didgeridoo"
  }
};

const instruments = {
  guitar: "Guitar",
  piano: "Piano",
  opera: "Opera Singer",
  trumpet: "Trumpet",
  bassoon: "Bassoon",
  didgeridoo: "Didgeridoo",
  drums: "Drums",
  trombone: "Trombone",
  sax: "Saxophone",
  oboe: "Oboe",
  mandoline: "Mandoline",
  cello: "Cello",
  clarinet: "Clarinet",
  horn: "Horn",
  viola: "Viola",
  harp: "Harp",
  violin: "Violin",
  flute: "Flute"
};

const instrumentImages = {
  guitar: "GUITAR.svg",
  piano: "PIANO.svg",
  opera: "OPERA SINGER.svg",
  trumpet: "TRUMPET.svg",
  bassoon: "BASSON.svg",
  didgeridoo: "DIDGERIDOO.svg",
  drums: "DRUMS.svg",
  trombone: "TROMBONE.svg",
  sax: "SAX.svg",
  oboe: "OBOE.svg",
  mandoline: "MANDOLINE.svg",
  cello: "CELLO.svg",
  clarinet: "CLARINET.svg",
  horn: "HORN.svg",
  viola: "VIOLA.svg",
  harp: "HARP.svg",
  violin: "VIOLINE.svg",
  flute: "FLUTE.svg"
};

const state = { current: "professional", history: [] };
const startWrap = document.querySelector("#start-wrap");
const gameWrap = document.querySelector("#game-wrap");
const playButton = document.querySelector("#play");
const questionText = document.querySelector("#question");
const optionButtons = document.querySelectorAll("[data-answer]");
const dontKnowButton = document.querySelector('[data-answer="dontknow"]');
const progress = document.querySelector("#progress");
const backButton = document.querySelector("#back");
const restartButton = document.querySelector("#restart");
const resultDialog = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultLabel = document.querySelector("#result-label");
const resultImage = document.querySelector("#result-image");
const soundSettingsToggles = document.querySelectorAll(
  ".sound-settings-toggle, .result-sound-settings"
);
const soundSettingsDialog = document.querySelector("#sound-settings");
const backgroundMusic = document.querySelector("#background-music");
const musicTrack = document.querySelector("#music-track");
const musicVolume = document.querySelector("#music-volume");
const musicVolumeValue = document.querySelector("#music-volume-value");
const effectsVolume = document.querySelector("#effects-volume");
const effectsVolumeValue = document.querySelector("#effects-volume-value");
const muteAll = document.querySelector("#mute-all");
let musicStarted = false;
let settingsPreviewSound = null;
let musicWasPlayingBeforeSettingsPreview = false;
const backgroundTracks = ["background_music_v1.mp3", "background_music_v2.mp3"];

const instrumentSounds = Object.keys(instruments).reduce((sounds, key) => {
  sounds[key] = document.querySelector(`#sound-${key}`);
  return sounds;
}, {});

function updateAudioSettings() {
  backgroundMusic.volume = Number(musicVolume.value);
  musicVolumeValue.textContent = `${Math.round(backgroundMusic.volume * 100)}%`;
  effectsVolumeValue.textContent = `${Math.round(Number(effectsVolume.value) * 100)}%`;
  Object.values(instrumentSounds).forEach((sound) => {
    sound.volume = Number(effectsVolume.value);
  });
  backgroundMusic.muted = muteAll.checked;
  Object.values(instrumentSounds).forEach((sound) => {
    sound.muted = muteAll.checked;
  });
}

function playBackgroundMusic() {
  if (!musicStarted || muteAll.checked) {
    return;
  }
  backgroundMusic.play().catch(() => {
    console.warn("Background music could not be played.");
  });
}

function playInstrumentSound(key) {
  if (muteAll.checked || !instrumentSounds[key]) {
    return;
  }
  const sound = instrumentSounds[key];
  backgroundMusic.pause();
  sound.addEventListener("ended", playBackgroundMusic, { once: true });
  sound.currentTime = 0;
  sound.play().catch(() => {
    console.warn(`The ${key} sound effect could not be played.`);
    playBackgroundMusic();
  });
}

function stopSettingsPreview() {
  if (!settingsPreviewSound) {
    return;
  }
  settingsPreviewSound.pause();
  settingsPreviewSound.currentTime = 0;
  settingsPreviewSound = null;
}

function previewRandomInstrument() {
  if (muteAll.checked) {
    stopSettingsPreview();
    return;
  }
  if (!settingsPreviewSound) {
    musicWasPlayingBeforeSettingsPreview = !backgroundMusic.paused;
  }
  backgroundMusic.pause();
  stopSettingsPreview();
  const instrumentKeys = Object.keys(instrumentSounds);
  const randomKey = instrumentKeys[Math.floor(Math.random() * instrumentKeys.length)];
  settingsPreviewSound = instrumentSounds[randomKey];
  settingsPreviewSound.volume = Number(effectsVolume.value);
  settingsPreviewSound.currentTime = 0;
  settingsPreviewSound.play().catch(() => {
    console.warn(`The ${randomKey} preview sound could not be played.`);
  });
}

soundSettingsToggles.forEach((toggle) => toggle.addEventListener("click", () => {
  musicStarted = true;
  playBackgroundMusic();
  soundSettingsDialog.showModal();
}));

musicTrack.addEventListener("change", () => {
  musicStarted = true;
  backgroundMusic.src = `Audio/Background Music/${musicTrack.value}`;
  backgroundMusic.load();
  playBackgroundMusic();
});
musicVolume.addEventListener("input", () => {
  updateAudioSettings();
  musicStarted = true;
  playBackgroundMusic();
});
effectsVolume.addEventListener("input", () => {
  updateAudioSettings();
  previewRandomInstrument();
});
muteAll.addEventListener("change", () => {
  updateAudioSettings();
  if (muteAll.checked) {
    stopSettingsPreview();
  }
  if (!muteAll.checked && !settingsPreviewSound) {
    playBackgroundMusic();
  }
});
soundSettingsDialog.addEventListener("close", () => {
  stopSettingsPreview();
  if (musicWasPlayingBeforeSettingsPreview) {
    musicWasPlayingBeforeSettingsPreview = false;
    playBackgroundMusic();
  }
});
updateAudioSettings();

function startRandomBackgroundMusic() {
  const randomTrack = backgroundTracks[Math.floor(Math.random() * backgroundTracks.length)];
  musicTrack.value = randomTrack;
  backgroundMusic.src = `Audio/Background Music/${randomTrack}`;
  backgroundMusic.load();
  musicStarted = true;
  playBackgroundMusic();
}

function retryBackgroundMusic() {
  if (!backgroundMusic.paused || muteAll.checked) {
    return;
  }
  playBackgroundMusic();
}

document.addEventListener("pointerdown", retryBackgroundMusic, { once: true });
document.addEventListener("keydown", retryBackgroundMusic, { once: true });
startRandomBackgroundMusic();

function render() {
  const question = questions[state.current];
  questionText.textContent = question.text;
  progress.textContent = `${state.history.length + 1} question${state.history.length ? "s" : ""} answered`;
  backButton.disabled = state.history.length === 0;
  dontKnowButton.style.display = state.current === "classical" ? "flex" : "none";
  optionButtons.forEach((button) => {
    button.focus({ preventScroll: true });
  });
}

function showResult(key) {
  const name = instruments[key];
  playInstrumentSound(key);
  resultTitle.textContent = `You got the ${name}!`;
  resultLabel.textContent = name.toUpperCase();
  resultImage.alt = `Illustration of a ${name}`;
  resultImage.src = `Instruments images/${instrumentImages[key]}`;
  resultDialog.showModal();
}

function choose(answer) {
  const next = questions[state.current][answer];
  state.history.push(state.current);
  if (instruments[next]) {
    showResult(next);
    return;
  }
  if (next === "stop") {
    resultTitle.textContent = "Stop thinking about making music";
    resultLabel.textContent = "MAYBE MUSIC ISN'T YOUR THING";
    resultImage.src = "Instruments images/STOP-HAND.svg";
    resultImage.alt = "Stop sign — maybe music isn't for you";
    resultDialog.showModal();
    return;
  }
  state.current = next;
  render();
}

optionButtons.forEach((button) => {
  button.addEventListener("click", () => choose(button.dataset.answer));
});

backButton.addEventListener("click", () => {
  if (state.history.length) {
    state.current = state.history.pop();
    render();
  }
});

function restart() {
  state.current = "professional";
  state.history.length = 0;
  resultDialog.close();
  // Slide back to start screen
  gameWrap.classList.remove("slide-in");
  startWrap.classList.remove("slide-out");
  render();
}

function startGame() {
  render();
  musicStarted = true;
  playBackgroundMusic();
  // Slide start screen out, game screen in
  startWrap.classList.add("slide-out");
  gameWrap.classList.add("slide-in");
  // Scroll game view to top
  gameWrap.scrollTop = 0;
}

playButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restart);
document.querySelector("#play-again").addEventListener("click", restart);
