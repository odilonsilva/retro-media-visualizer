let visualizerIndex = 1;
let itemActive = 1;
let visualizerInterval = null;

const changeVisualizer = () => {
  console.log("visualizerIndex", visualizerIndex);
  const videoUrl = chrome.runtime.getURL(`images/${visualizerIndex}.mp4`);

  const video = document.querySelector("#overlay-video");
  const video1 = document.querySelector("#overlay-video-1");
  if (!video || !video1) return;

  if (itemActive == 1) {
    video1.src = videoUrl;
    video1.classList.remove("overlay-video-hide");
    video1.classList.add("overlay-video-show");
    video1.play();

    video.classList.remove("overlay-video-show");
    video.classList.add("overlay-video-hide");
    video.pause();
    itemActive = 0;
  } else {
    video.src = videoUrl;
    video.classList.remove("overlay-video-hide");
    video.classList.add("overlay-video-show");
    video.play();

    video1.classList.remove("overlay-video-show");
    video1.classList.add("overlay-video-hide");
    video1.pause();
    itemActive = 1;
  }
};

const setVisualizerInterval = () => {
  visualizerInterval = setInterval(() => {
    visualizerIndex = parseInt(Math.random() * 11) + 1;
    changeVisualizer();
  }, 20_000);
};

const resizeVisualizer = () => {
  const overlayVideo = document.querySelector("#overlay-video");
  const overlayVideo1 = document.querySelector("#overlay-video-1");
  if (!overlayVideo || !overlayVideo1) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  overlayVideo.style = `width: ${width}px; height: ${height}px;`;
  overlayVideo1.style = `width: ${width}px; height: ${height}px;`;
};
