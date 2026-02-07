// Audio handling for cross-browser compatibility
let audioStarted = false;
let audio = null;

function startAudio() {
  if (audioStarted || !audio) return;
  
  audio.volume = 1.0;
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        audioStarted = true;
        console.log("Audio started successfully");
      })
      .catch(error => {
        console.log("Audio play failed:", error);
      });
  }
}

// Try muted autoplay first (some browsers allow this)
function tryMutedAutoplay() {
  if (!audio) return;
  
  audio.volume = 0;
  audio.muted = true;
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // Successfully started muted, now wait for user interaction to unmute
        console.log("Audio started muted, waiting for user interaction");
        audio.muted = false;
        audio.volume = 1.0;
        audioStarted = true;
      })
      .catch(() => {
        // Muted autoplay also blocked, will start on user interaction
        audio.muted = false;
        audio.volume = 1.0;
      });
  }
}

onload = () => {
  // Get audio element
  audio = document.getElementById("backgroundAudio");
  
  // Try muted autoplay (some browsers allow this)
  if (audio) {
    tryMutedAutoplay();
    
    // Set up user interaction handlers to start audio
    // Use multiple event types for maximum compatibility
    const interactionEvents = ['click', 'touchstart', 'touchend', 'keydown'];
    
    const handleUserInteraction = () => {
      startAudio();
      // Remove listeners after first interaction
      interactionEvents.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
    
    // Add listeners to document for any user interaction
    interactionEvents.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true, passive: true });
    });
    
    // Also try to start audio when messages become active (user might interact with them)
    const message1 = document.getElementById("message1");
    const message2 = document.getElementById("message2");
    
    if (message1) {
      message1.addEventListener('click', startAudio, { once: true });
      message1.addEventListener('touchstart', startAudio, { once: true });
    }
    
    if (message2) {
      message2.addEventListener('click', startAudio, { once: true });
      message2.addEventListener('touchstart', startAudio, { once: true });
    }
  }
  
  // Hide flowers initially
  const flowers = document.getElementById("flowers");
  flowers.style.opacity = "0";
  
  // Get message elements
  const message1 = document.getElementById("message1");
  const message2 = document.getElementById("message2");
  
  // Sequence: First message fades in after 3 seconds
  setTimeout(() => {
    message1.classList.add("active");
  }, 3000);
  
  // First message fades out after showing for 6 seconds (3 original + 3 extra for readability)
  // Fade in takes 1.5s, so we wait 6s after fade in starts = 3s + 6s = 9s total
  setTimeout(() => {
    message1.classList.remove("active");
  }, 9000);
  
  // Second message fades in after first message fully fades out
  // First message fade out takes 1.5s, so wait 1.5s after fade out starts
  // 9s (when fade out starts) + 1.5s (fade out duration) = 10.5s
  setTimeout(() => {
    message2.classList.add("active");
  }, 10500);
  
  // Second message fades out after showing for 6 seconds (3 original + 3 extra for readability)
  // Fade in takes 1.5s, so we wait 6s after fade in starts = 10.5s + 6s = 16.5s total
  setTimeout(() => {
    message2.classList.remove("active");
  }, 16500);
  
  // Show flowers after second message fully fades out
  // Second message fade out takes 1.5s, so wait 1.5s after fade out starts
  // 16.5s (when fade out starts) + 1.5s (fade out duration) = 18s
  setTimeout(() => {
    document.body.classList.remove("not-loaded");
    flowers.style.opacity = "1";
  }, 18000);
};