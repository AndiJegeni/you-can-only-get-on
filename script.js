/* ── Access Gate Logic ── */

// The secret phrase (case-insensitive, trimmed)
// Hint: "The only way in... is to say you're already on."
const SECRET = "i am already on";

const passInput   = document.getElementById("passInput");
const enterBtn    = document.getElementById("enterBtn");
const errorMsg    = document.getElementById("errorMsg");
const lockIcon    = document.getElementById("lockIcon");
const hintToggle  = document.getElementById("hintToggle");
const hintText    = document.getElementById("hintText");
const gateScreen  = document.getElementById("gate");
const insideScreen = document.getElementById("inside");
const leaveBtn    = document.getElementById("leaveBtn");
const particleField = document.getElementById("particleField");

let attempts = 0;
let hintVisible = false;
let accessGranted = false;

/* ── Hint toggle ── */
hintToggle.addEventListener("click", () => {
  hintVisible = !hintVisible;
  if (hintVisible) {
    hintText.classList.add("visible");
    hintToggle.textContent = "hide hint";
  } else {
    hintText.classList.remove("visible");
    hintToggle.textContent = "need a hint?";
  }
});

/* ── Enter key support ── */
passInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryAccess();
});

enterBtn.addEventListener("click", tryAccess);

/* ── Main gate check ── */
function tryAccess() {
  if (accessGranted) return;

  const value = passInput.value.trim().toLowerCase();

  if (value === SECRET) {
    grantAccess();
  } else {
    denyAccess();
  }
}

function grantAccess() {
  accessGranted = true;

  // Swap lock icon to unlocked
  lockIcon.textContent = "🔓";
  lockIcon.classList.add("unlocked");

  clearError();
  passInput.disabled = true;
  enterBtn.disabled = true;

  // Short pause, then transition
  setTimeout(() => {
    gateScreen.classList.remove("active");
    setTimeout(() => {
      insideScreen.classList.add("active");
      spawnParticles();
    }, 400);
  }, 700);
}

function denyAccess() {
  attempts++;
  passInput.value = "";
  passInput.focus();

  // Shake the box
  const box = document.querySelector(".gate-box");
  box.classList.remove("shake");
  void box.offsetWidth; // reflow
  box.classList.add("shake");
  box.addEventListener("animationend", () => box.classList.remove("shake"), { once: true });

  // Error message — gets more taunting with each attempt
  const msgs = [
    "ACCESS DENIED.",
    "WRONG. Try again.",
    "That is not the way.",
    "You are not ready.",
    "Still wrong. Think harder.",
    "The door does not know you.",
    "...",
    "Maybe you don't belong here.",
  ];
  const msg = msgs[Math.min(attempts - 1, msgs.length - 1)];
  showError(msg);

  // Auto-reveal hint after 3 bad attempts
  if (attempts === 3 && !hintVisible) {
    hintVisible = true;
    hintText.classList.add("visible");
    hintToggle.textContent = "hide hint";
    showError("ACCESS DENIED. — A hint has been revealed.");
  }
}

function showError(msg) {
  errorMsg.textContent = msg;
}

function clearError() {
  errorMsg.textContent = "";
}

/* ── Leave button ── */
leaveBtn.addEventListener("click", () => {
  insideScreen.classList.remove("active");
  accessGranted = false;
  passInput.disabled = false;
  enterBtn.disabled = false;
  passInput.value = "";
  lockIcon.textContent = "🔒";
  lockIcon.classList.remove("unlocked");
  clearError();
  attempts = 0;
  // Remove particles
  particleField.innerHTML = "";

  setTimeout(() => {
    gateScreen.classList.add("active");
  }, 400);
});

/* ── Particle system for "inside" screen ── */
function spawnParticles() {
  particleField.innerHTML = "";
  const count = 60;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.setProperty("--dur",   `${4 + Math.random() * 6}s`);
    p.style.setProperty("--delay", `${Math.random() * 6}s`);
    p.style.left = `${Math.random() * 100}%`;
    p.style.bottom = "0";
    p.style.width  = `${1 + Math.random() * 3}px`;
    p.style.height = p.style.width;
    particleField.appendChild(p);
  }
}

/* ── Subtle typing cursor effect in placeholder ── */
(function animatePlaceholder() {
  const phrases = [
    "enter the phrase...",
    "speak the words...",
    "prove you belong...",
    "the key is a sentence...",
  ];
  let pi = 0;
  setInterval(() => {
    if (document.activeElement !== passInput && !accessGranted) {
      pi = (pi + 1) % phrases.length;
      passInput.placeholder = phrases[pi];
    }
  }, 3500);
})();
