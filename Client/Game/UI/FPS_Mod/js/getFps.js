var before, now, fps, ping;
before = Date.now();
fps = 0;
requestAnimationFrame(function loop() {
  now = Date.now();

  fps = Math.round(1000 / (now - before));
    
  before = now;
  requestAnimationFrame(loop);
});
