// Cursor trailing text and small interactive helpers
document.addEventListener('DOMContentLoaded', function () {
  console.log('InternPhish scaffold loaded');

  // Create a container for trail items
  const trailRoot = document.createElement('div');
  trailRoot.id = 'trail-root';
  document.body.appendChild(trailRoot);

  function spawnTrail(x, y, text){
    const el = document.createElement('div');
    el.className = 'cursor-trail';
    el.textContent = text || '';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    // force reflow then fade in
    requestAnimationFrame(()=>{
      el.style.opacity = '0.18';
      el.style.transform = 'translate(-50%,-50%) scale(1)';
    });
    setTimeout(()=>{
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%,-80%) scale(0.95)';
      setTimeout(()=>el.remove(),700);
    },600);
  }

  // NOTE: 'scam detected' hover signal removed per request. Hover signal logic
  // will be reintroduced later if/when needed.
});
