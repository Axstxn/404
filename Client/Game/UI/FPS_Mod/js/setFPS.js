this.getFps = setInterval(() => {
  if (document.getElementById("fpsDisplayCb").checked === true) {
    if ((this.FPS_Display.style.display = "none")) {
      this.FPS_Display.style.display = "block";
    }
  } else {
    if ((this.FPS_Display.style.display = "block")) {
      this.FPS_Display.style.display = "none";
    }
  }
}, 500);
