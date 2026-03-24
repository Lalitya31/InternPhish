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

// Simple demo counter for reports (dummy data). Replaces number smoothly.
function animateReportsCount(target){
  const el = document.getElementById('reports-count');
  if(!el) return;
  let current = 0;
  const stepTime = Math.max(20, Math.floor(1200 / Math.max(1, target)));
  const timer = setInterval(()=>{
    current += Math.max(1, Math.floor(target/60));
    if(current >= target){
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toLocaleString();
  }, stepTime);
}

// Example: pick a dummy live value (will be replaced by real data later)
document.addEventListener('DOMContentLoaded', ()=>{
  // random-ish demo value
  const demo = 1245;
  animateReportsCount(demo);

  // prevent default report form submission (placeholder)
  const form = document.getElementById('report-form');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      alert('Report submitted (demo).');
      form.reset();
    });
  }
});
