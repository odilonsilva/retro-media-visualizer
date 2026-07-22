console.log("content loaded");
let playing = false;
let showingInfo = false;
let showingInfoInterval = null;

const interval = setInterval(() => init(), 1000);

const init = () => {
  const navBarSpotify = document.querySelector("#global-nav-bar");
  console.log("tentando encontrar a navbar do spotify");
  if (navBarSpotify) {
    console.log("navBarSpotify localizada");
    createActionButton(navBarSpotify);
    createVisualizer();
    clearInterval(interval);
  }
};

const createActionButton = (container) => {
  const button = document.createElement("img");
  button.id = "retro-player-action";
  button.alt = "Ative a visualização media player like";
  button.title = "Ative a visualização media player like";
  button.src = chrome.runtime.getURL("images/player.png");
  container.lastElementChild.appendChild(button);
  button.addEventListener("click", () => showVisualizer());
};

const createVisualizer = () => {
  const container = document.querySelector("body");
  const visualizer = document.createElement("div");
  visualizer.id = "retro-media-visualizer";

  const visualizerContent = document.createElement("img");
  visualizerContent.id = "visualizer-content";
  visualizerContent.src = chrome.runtime.getURL("images/media-preview.png");
  visualizer.appendChild(visualizerContent);
  container.appendChild(visualizer);
};

const visualizerInfo = () => {
  const container = document.querySelector("#retro-media-visualizer");
  const visualizerInfo = document.createElement("div");
  visualizerInfo.id = "retro-media-visualizer-info";
  const playingInfo = document.querySelector(
    "[data-testid=now-playing-widget]",
  );

  if (playingInfo) {
    visualizerInfo.innerHTML = playingInfo.innerHTML;
  }

  container.appendChild(visualizerInfo);
};

const updateVisualizerInfo = () => {
  const visualizerInfo = document.querySelector("#retro-media-visualizer-info");
  const playingInfo = document.querySelector(
    "[data-testid=now-playing-widget]",
  );
  if (!visualizerInfo || !playingInfo) return;

  visualizerInfo.innerHTML = playingInfo.innerHTML;
};

const showVisualizer = () => {
  const visualizer = document.querySelector("#retro-media-visualizer");

  if (visualizer) {
    if (visualizer.classList.contains("visualizer-enter")) {
      visualizer.classList.remove("visualizer-enter");
      visualizer.classList.add("visualizer-exit");
      showingInfo = false;
      clearInterval(showingInfoInterval);
    } else {
      visualizer.classList.remove("visualizer-exit");
      visualizer.classList.add("visualizer-enter");
      visualizerInfo();
      showingInfo = true;
      showingInfoInterval = setInterval(() => updateVisualizerInfo(), 1000);
    }
  }
};
