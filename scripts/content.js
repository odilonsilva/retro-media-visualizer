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
  const button = document.createElement("button");
  button.style =
    "width: 100px;height: 50px; background-color: #555; border-radius: 7px; border: 1px solid silver;";
  button.id = "retro-player-action";
  button.innerText = "Botão maroto";
  button.innerHTML = '<img src="player.png"/>';
  container.lastElementChild.appendChild(button);
};
