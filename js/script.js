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
    el.textContent = text || 'scam detected';
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

  // Single bright red 'scam detected' on hover (once per enter)
  function spawnSignal(x, y, text){
    const el = document.createElement('div');
    el.className = 'cursor-signal';
    el.textContent = text || 'scam detected';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    // show quickly
    requestAnimationFrame(()=>{
      el.style.opacity = '1';
      el.style.transform = 'translate(-50%,-50%) scale(1)';
    });
    // fade out after a short duration
    setTimeout(()=>{
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%,-80%) scale(0.98)';
      setTimeout(()=>el.remove(),300);
    },900);
  }

  // Attach enter/leave handlers to elements with .trail-target
  const targets = document.querySelectorAll('.trail-target');
  targets.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      // avoid duplicate if already shown on this element
      if (el.dataset.scamShown) return;
      el.dataset.scamShown = '1';
      const x = e.clientX;
      const y = e.clientY - 8; // slightly above cursor
      spawnSignal(x, y, 'scam detected');
      // clear flag after signal lifecycle so it can show again later if needed
      setTimeout(()=>{ delete el.dataset.scamShown; }, 1200);
    });
  });
});
