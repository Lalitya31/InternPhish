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

// Basic search handling for verify page (keeps theme and is unobtrusive)
document.addEventListener('DOMContentLoaded', ()=>{
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  if(!searchForm || !searchInput) return;
  searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const q = searchInput.value.trim();
    if(!q){
      // subtle feedback: focus input
      searchInput.focus();
      return;
    }
    // Placeholder behavior: if a real report list exists, implement filtering here.
    // For now, show a gentle non-blocking message in console and flash a tiny UI hint.
    console.log('Search query:', q);
    // small visual hint: temporarily change border color
    const orig = searchInput.style.boxShadow;
    searchInput.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.04)';
    setTimeout(()=>searchInput.style.boxShadow = orig, 600);
  });
});

// Wire up custom file picker UI
document.addEventListener('DOMContentLoaded', ()=>{
  const fileInput = document.getElementById('evidence');
  const fileName = document.getElementById('file-name');
  if(fileInput && fileName){
    fileInput.addEventListener('change', (e)=>{
      const f = e.target.files && e.target.files[0];
      fileName.textContent = f ? f.name : 'No file chosen';
    });
    // make the label click trigger the hidden input (label[for] already does this)
  }
});
