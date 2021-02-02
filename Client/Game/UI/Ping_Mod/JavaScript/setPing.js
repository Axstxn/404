this.setPing = setInterval(() => {
  if (document.getElementById("pingDisplayCb").checked === true) {
    if ((this.Ping_Display.style.display = "none")) {
      this.Ping_Display.style.display = "block";
    }
    this.Ping_Display.innerHTML = `<p class="rainbowText">${ping}</p>`;
  } else {
    if ((this.Ping_Display.style.display = "block")) {
      this.Ping_Display.style.display = "none";
    }
  }
}, 500)
