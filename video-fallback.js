/* Hero video fallback — iOS Low Power Mode / Low Data Mode blocks autoplay.
   This snippet (1) hides the giant default play-button overlay on iOS Safari,
   and (2) captures frame-0 of each hero video to a canvas and uses that as a
   poster image, so when autoplay is blocked users see the first frame of the
   video as a still image instead of a black box. */
(function () {
  if (window.__RCP_VIDEO_FALLBACK__) return;
  window.__RCP_VIDEO_FALLBACK__ = true;

  var style = document.createElement('style');
  style.textContent = [
    'video[autoplay]::-webkit-media-controls-start-playback-button{display:none!important;-webkit-appearance:none;}',
    'video[autoplay]::-webkit-media-controls-overlay-play-button{display:none!important;-webkit-appearance:none;}',
    'video[autoplay]::-webkit-media-controls{display:none!important;}',
    'video[autoplay]::-webkit-media-controls-panel{display:none!important;}',
    'video[autoplay]::-webkit-media-controls-play-button{display:none!important;}',
    'video[autoplay]{pointer-events:none;}'
  ].join('');
  document.head.appendChild(style);

  function capturePoster(video) {
    if (video.dataset.posterCaptured) return;
    try {
      var w = video.videoWidth, h = video.videoHeight;
      if (!w || !h) return;
      var canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, w, h);
      var url = canvas.toDataURL('image/jpeg', 0.78);
      video.setAttribute('poster', url);
      video.dataset.posterCaptured = '1';
    } catch (e) { /* CORS or decode issue, ignore */ }
  }

  function tryPlay(video) {
    var p = video.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked, poster stays */ });
  }

  function wire(video) {
    if (video.dataset.rcpWired) return;
    video.dataset.rcpWired = '1';
    video.removeAttribute('controls');
    video.setAttribute('webkit-playsinline', '');
    video.muted = true;
    if (video.readyState >= 2) {
      capturePoster(video);
      tryPlay(video);
    } else {
      video.addEventListener('loadeddata', function () {
        capturePoster(video);
        tryPlay(video);
      }, { once: true });
    }
    // Retry play on first user interaction if still paused (Low Data Mode recovery).
    var wakeHandler = function () {
      if (video.paused) tryPlay(video);
      window.removeEventListener('touchstart', wakeHandler, true);
      window.removeEventListener('click', wakeHandler, true);
      window.removeEventListener('scroll', wakeHandler, true);
    };
    window.addEventListener('touchstart', wakeHandler, { capture: true, passive: true });
    window.addEventListener('click', wakeHandler, { capture: true, passive: true });
    window.addEventListener('scroll', wakeHandler, { capture: true, passive: true });
  }

  function init() {
    var videos = document.querySelectorAll('video[autoplay]');
    for (var i = 0; i < videos.length; i++) wire(videos[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
