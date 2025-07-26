const targetScriptId = "anubis_challenge";
const replacementUrl = chrome.runtime.getURL("assets/robert.jpg");
const targetFilenames = ["happy.webp", "pensive.webp", "reject.webp"];

function replaceImage(img) {
  const src = img.getAttribute("src") || "";
  if (targetFilenames.some(name => src.includes(name))) {
    if (img.src !== replacementUrl) img.src = replacementUrl;
  }
}

function observeImages() {
  document.querySelectorAll("img").forEach(replaceImage);

  new MutationObserver(mutations => {
    for (const { addedNodes } of mutations) {
      for (const node of addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.tagName === "IMG") replaceImage(node);
        else node.querySelectorAll?.("img").forEach(replaceImage);
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
}

function start() {
  const intervalId = setInterval(() => {
    if (document.querySelector(`script#${targetScriptId}`)) {
      clearInterval(intervalId);
      observeImages();
    }
  }, 50);

  window.addEventListener("load", () => clearInterval(intervalId));
}

start();
