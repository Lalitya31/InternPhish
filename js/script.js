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

  let throttle = 0;
  document.addEventListener('mousemove', (e)=>{
    // Only spawn trail when hovering over designated text elements
    const isOverText = !!e.target.closest('.trail-target');
    if (!isOverText) return;
    const now = Date.now();
    if (now - throttle < 80) return; // throttle
    throttle = now;
    spawnTrail(e.clientX + (Math.random()*12-6), e.clientY + (Math.random()*12-6), 'scam detected');
  });
});
