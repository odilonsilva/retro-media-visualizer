console.log("content loaded");
setTimeout(() => init(), 5000);

const init = () => {
  const navBarSpotify = document.querySelector("#global-nav-bar");
  if (navBarSpotify) {
    console.log("navBarSpotify localizada");
    createActionButton(navBarSpotify);
  }
};

const createActionButton = (container) => {
  const button = document.createElement("img");
  button.id = "retro-player-action";
  button.alt = "Ative a visualização media player like";
  button.title = "Ative a visualização media player like";
  button.width = 35;
  button.height = 35;
  button.style = "margin: auto;";
  button.src =
    "https://raw.githubusercontent.com/odilonsilva/retro-media-visualizer/refs/heads/main/player.png";
  container.lastElementChild.appendChild(button);
  button.addEventListener("click", () => createVisualizer());
};

const createVisualizer = () => {
  const container = document.querySelector("body");
  const visualizer = document.createElement("div");
  visualizer.id = "retro-media-visualizer";
  visualizer.style =
    "position:absolute; top: 0; left: 0; bottom:0; width: 100vw; height: 100vh; background-color: #fff5";
  container.appendChild(visualizer);
};
