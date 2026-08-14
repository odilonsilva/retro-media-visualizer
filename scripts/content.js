console.log("content loaded");
let isOpened = false;
let isFullscreen = false;
let showingInfoInterval = null;
let mouseTimer = null;
let visualizer = null;
let fullScreenButton = null;
let exitFullScreenButton = null;

const interval = setInterval(() => init(), 1000);

const init = () => {
  const navBarSpotify = document.querySelector("#global-nav-bar");
  console.log("tentando encontrar a navbar do spotify");
  if (navBarSpotify) {
    console.log("navBarSpotify localizada");
    clearInterval(interval);
    createActionButton(navBarSpotify);
    createVisualizer();
    window.addEventListener("keypress", (event) => handleKeyboard(event));
    window.addEventListener("resize", () => resizeVisualizer());
    window.addEventListener("mousemove", (event) => handleMouse(event));
    resizeVisualizer();
  }
};

const createActionButton = (container) => {
  const button = document.createElement("img");
  button.id = "retro-player-action";
  button.alt = "Ativar visualização media player";
  button.title = "Ativar visualização media player";
  button.src = chrome.runtime.getURL("images/player.png");
  container.lastElementChild.appendChild(button);
  button.addEventListener("click", () => openVisualizer());
};

const createVisualizer = () => {
  const container = document.querySelector("body");
  visualizer = document.createElement("div");
  visualizer.id = "retro-media-visualizer";

  const randomNum = parseInt(Math.random() * 11) + 1;
  const videoUrl = chrome.runtime.getURL(`images/${randomNum}.mp4`);

  const overlayVideo = document.createElement("video");
  overlayVideo.classList.add("overlay-video-show");
  overlayVideo.id = "overlay-video";
  overlayVideo.src = videoUrl;
  overlayVideo.loop = true;

  const overlayVideo1 = document.createElement("video");
  overlayVideo1.classList.add("overlay-video-hide");
  overlayVideo1.id = "overlay-video-1";
  overlayVideo1.src = videoUrl;
  overlayVideo1.loop = true;

  visualizer.appendChild(overlayVideo);
  visualizer.appendChild(overlayVideo1);
  container.appendChild(visualizer);
  visualizerInfo();
};

const visualizerInfo = () => {
  const visualizerInfoContainer = `
  <div class="controls show">
    <div class="info-container-top">
      <div id="close-button" title="[V] Fechar visualização">
        <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#b0b0b0"></path></g></svg> 
      </div>
    </div>
    <div class="flex info-container">
      <div id="retro-media-visualizer-info" class="flex"></div>
      <div class="flex">
        <div id="retro-media-visualizer-action" title="[F] Enter Fullscreen">
          <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.00002 3.99998H4.00004L4 9M20 8.99999V4L15 3.99997M15 20H20L20 15M4 15L4 20L9.00002 20" stroke="#b0b0b0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </div>
        <div id="retro-media-visualizer-action-exit" class="hide" title="[F] Exit Fullscreen">
          <svg width="32px" height="32px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="2"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><polyline points="48 36 36 36 36 48"></polyline><rect x="8" y="8" width="48" height="48"></rect><line x1="36" y1="36" x2="48" y2="48"></line><polyline points="16 28 28 28 28 16"></polyline><line x1="28" y1="28" x2="16" y2="16"></line></g></svg>
        </div>
      </div>
    </div>
  </div>
  `;
  visualizer.innerHTML += visualizerInfoContainer;

  const closeButton = document.querySelector("#close-button");
  closeButton.addEventListener("click", () => closeVisualizer());

  fullScreenButton = document.querySelector("#retro-media-visualizer-action");
  fullScreenButton.addEventListener("click", () => handleFullScreen());

  exitFullScreenButton = document.querySelector(
    "#retro-media-visualizer-action-exit",
  );
  exitFullScreenButton.addEventListener("click", () => handleFullScreen());
};

const updateVisualizerInfo = () => {
  const visualizerInfo = document.querySelector("#retro-media-visualizer-info");
  const playingInfo = document.querySelector(
    "[data-testid=now-playing-widget]",
  );
  if (!visualizerInfo || !playingInfo) return;

  visualizerInfo.innerHTML = playingInfo.innerHTML;
};

const openVisualizer = async () => {
  if (visualizer) {
    const overlayVideo = document.querySelector("#overlay-video");
    await overlayVideo.play();
    const overlayVideo1 = document.querySelector("#overlay-video-1");
    await overlayVideo1.play();

    visualizer.classList.remove("visualizer-exit");
    visualizer.classList.add("visualizer-enter");
    isOpened = true;
    showingInfoInterval = setInterval(() => updateVisualizerInfo(), 1000);
    setVisualizerInterval();
  }
};

const closeVisualizer = async () => {
  visualizer.classList.add("visualizer-exit");
  visualizer.classList.remove("visualizer-enter");
  isOpened = false;
  clearInterval(showingInfoInterval);
  clearInterval(visualizerInterval);
  const overlayVideo = document.querySelector("#overlay-video");
  await overlayVideo.pause();
  const overlayVideo1 = document.querySelector("#overlay-video-1");
  await overlayVideo1.pause();
  exitFullscreen();
};

const handleKeyboard = (event) => {
  if (event.key === "V" || event.key === "v") {
    if (isOpened) {
      closeVisualizer();
      return;
    }
    openVisualizer();
    return;
  }

  if (event.key === "F" || event.key === "f") {
    handleFullScreen();
    return;
  }
};

const handleFullScreen = () => {
  if (isOpened) {
    if (isFullscreen) {
      exitFullscreen();
      return;
    }

    fullScreenButton.classList.add("hide");
    fullScreenButton.classList.remove("show");

    exitFullScreenButton.classList.add("show");
    exitFullScreenButton.classList.remove("hide");

    document.documentElement.requestFullscreen();
    isFullscreen = true;
    return;
  }
};

const exitFullscreen = () => {
  if (isFullscreen) {
    fullScreenButton.classList.add("show");
    fullScreenButton.classList.remove("hide");

    exitFullScreenButton.classList.add("hide");
    exitFullScreenButton.classList.remove("show");

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    isFullscreen = false;
  }
};

const handleMouse = (event) => {
  if (!isOpened) return;

  const overlayControls = document.querySelector(
    "#retro-media-visualizer > div.controls",
  );

  clearTimeout(mouseTimer);

  overlayControls.classList.remove("hide");
  overlayControls.classList.add("show");

  mouseTimer = setTimeout(() => {
    overlayControls.classList.remove("show");
    overlayControls.classList.add("hide");
  }, 7000);
};
