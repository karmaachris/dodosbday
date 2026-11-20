/* =========================================================
   EDIT THIS PART ONLY
   ========================================================= */
const CONFIG = {
  // Site stays locked until this moment (Cairo time, UTC+2 in November)
  unlockAt: "2026-11-21T00:00:00+02:00",
  // Dinner reservation (for the countdown on the details card)
  dinnerAt: "2026-11-21T20:00:00+02:00",

  place: "Tagamoa",
  venue: "A secret 🤫",
  fromName: "Yours, Mikaaaa",

   // ----- Pickup page 
  pickupTime: "7:00 PM", // CHANGE THIS to your real pickup time
  pickupText:
    `So here's the deal dodoo.
    You're picking me up, and then we go together.
    Princess treatment, no matter what ;)`,
  perks: [
    "Pick me up on TIMEE!",
    "Open the car door for me",
    "Compliment the outfit. Out loud.",
    "Phone stays in your pocket during dinner",
    "I choose the music in the car",
    "Zero complaints about how long I took getting ready"
  ],

  // Put your photos in the project root and list them here.
  // The first 3 pop out of the envelope. Add/remove as you like.
  photos: [
    { src: "dahro.jpeg", caption: "halawet el bedayat" },
    { src: "hasana.jpeg", caption: "Love how random our pics are" },
    { src: "weird.jpeg", caption: "us + ibn elsham >>>" },
    { src: "image4schatz.jpeg", caption: "Mein süßer Schatz" },
    { src: "image5lastfirst.jpeg", caption: "all laughs around you, always!" },
    { src: "image6grad.jpeg", caption: "From milestone to another🤞🏼" },
    { src: "image2cropx.jpeg", caption: "One of my favorite memories of us (the day you told me about CropX)" },
    { src: "image1hand.jpeg", caption: "Us, as always" }
  ],


note:
`My Dodo,
Here's to another year of you, and I'm still finding new reasons to love you. You make normal days feel so special, even a regular chicken dinner from Ibn Elsham turns into my favorite plan of the week because we're together.
Football, padel, gym, good food; you're so talented in so many ways, and I'm so lucky and grateful to share all of this with you! (one day we'll share the our love to the beach together too)
You're always my go-to person on my bad days, even before the good ones! Thank you for always bearing with my cries and mood swings, you know me so well, and I'm so blessed that you do. 
I love you for that, and I love you for so many other things too.
I hope this year gives you every little thing you wish for, and I hope I'm right next to you for all of it.

Happy birthdayyy ya habebb albe❤️`,

  // Funny lines for the "Not interested" button
  dodgeLines: [
    "Nice try dodoo.. khalik fakerha :)",
    "Too slow",
    "Error 404: 'No' not found",
    "Have you considered saying yes?",
    "This option was removed by management (me)",
    "Even the button wants you to say yes",
    "Padel reflexes, and you still can't catch it?"
  ],
  clickLines: [
    "That one is purely decorative",
    "Button under maintenance 🔧",
    "Nope. Try the other one.",
    "Your 'No' has been politely declined.",
  ],

  guess: {
    question: "I got you something. Any guesses?",
    revealAfter: 2, // number of guesses before the secret message appears
    replies: [
      "Interesting guess...",
      "Hint: it's an old favorite of yours",],
    last: "enough guessing!!! gebtelak kol el hob bas ya dodo❤️"
  },

  // Hidden message (shows when he clicks the blue heart at the bottom)
  secret:
`There's a little something BLUE waiting for you.
Don't be late, I'll be waiting for youu, love!`
};

/* =========================================================
   CODE
   ========================================================= */
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const PREVIEW = params.has("preview");          // add ?preview to the URL to test before the date
const unlockTime = new Date(CONFIG.unlockAt).getTime();
const bgm = $("bgm");
let siteStarted = false;

function pad(n) { return String(n).padStart(2, "0"); }
function fillCount(prefix, ms) {
  const t = Math.max(0, Math.floor(ms / 1000));
  $(prefix + "Days").textContent = pad(Math.floor(t / 86400));
  $(prefix + "Hours").textContent = pad(Math.floor((t % 86400) / 3600));
  $(prefix + "Mins").textContent = pad(Math.floor((t % 3600) / 60));
  $(prefix + "Secs").textContent = pad(t % 60);
}

function boom(opts) {
  if (typeof confetti !== "function") return;
  confetti(Object.assign({ particleCount: 120, spread: 80, origin: { y: 0.65 },
    colors: ["#ff5a4e", "#d9a441", "#1d1b1a", "#ffffff", "#f6c1b5"] }, opts));
}
function bigConfetti() {
  boom({ particleCount: 160, angle: 60, spread: 70, origin: { x: 0, y: 0.8 } });
  boom({ particleCount: 160, angle: 120, spread: 70, origin: { x: 1, y: 0.8 } });
  setTimeout(() => boom({ particleCount: 140, spread: 120, origin: { y: 0.5 } }), 350);
}

/* ---------- flow: lock -> envelope -> site ---------- */
function init() {
  buildPhotos();
  if (!PREVIEW && Date.now() < unlockTime) {
    $("lock").hidden = false;
    const tick = () => {
      const left = unlockTime - Date.now();
      if (left <= 0) { location.reload(); return; }
      fillCount("l", left);
    };
    tick();
    setInterval(tick, 1000);
  } else {
    $("envelope").hidden = false;
  }
}

function buildPhotos() {
  // envelope polaroids (first 3)
  const holder = $("envPolaroids");
  CONFIG.photos.slice(0, 3).forEach((p) => {
    const d = document.createElement("div");
    d.className = "pol";
    d.innerHTML = `<img src="${p.src}" alt="" onerror="this.removeAttribute('src')">`;
    holder.appendChild(d);
  });
  // gallery
  const grid = $("grid");
  const tilts = [-3, 2, -1.5, 3, -2, 1.5];
  CONFIG.photos.forEach((p, i) => {
    const f = document.createElement("figure");
    f.className = "shot";
    f.style.setProperty("--r", tilts[i % tilts.length] + "deg");
    f.innerHTML = `<img src="${p.src}" alt="${p.caption}" onerror="this.removeAttribute('src')"><figcaption>${p.caption}</figcaption>`;
    grid.appendChild(f);
  });
}

$("openBtn").addEventListener("click", () => {
  $("openBtn").disabled = true;
  $("env").classList.add("open");
  bigConfetti();
  bgm.volume = 0.6;
  bgm.play().then(() => { $("muteBtn").hidden = false; }).catch(() => {});
  $("muteBtn").hidden = false;
  setTimeout(() => {
    $("envelope").classList.add("leaving");
    startSite();
    setTimeout(() => { $("envelope").hidden = true; }, 950);
  }, 3200);
});

$("muteBtn").addEventListener("click", () => {
  if (bgm.paused) { bgm.play(); $("muteBtn").classList.remove("off"); }
  else { bgm.pause(); $("muteBtn").classList.add("off"); }
});

/* ---------- site ---------- */
function startSite() {
  if (siteStarted) return;
  siteStarted = true;
  $("site").hidden = false;
  requestAnimationFrame(() => $("site").classList.add("show"));
  window.scrollTo(0, 0);
  splitTitle();
  startFloaters();
  setupReveal();
}

function splitTitle() {
  const el = $("heroTitle");
  const words = el.textContent.split(" ");
  el.innerHTML = "";
  let i = 0;
  words.forEach((w, wi) => {
    const ws = document.createElement("span");
    ws.className = "w";
    [...w].forEach((ch) => {
      const s = document.createElement("span");
      s.className = "l";
      s.textContent = ch;
      s.style.animationDelay = 0.25 + i * 0.045 + "s";
      ws.appendChild(s);
      i++;
    });
    el.appendChild(ws);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
  });
}

function startFloaters() {
  const icons = ["⚽", "🎾", "🍗", "🏖️", "❤️"];
  const box = $("floaters");
  setInterval(() => {
    const f = document.createElement("div");
    f.className = "floater";
    f.textContent = icons[Math.floor(Math.random() * icons.length)];
    f.style.left = Math.random() * 100 + "vw";
    f.style.fontSize = 1.2 + Math.random() * 1.4 + "rem";
    f.style.animationDuration = 12 + Math.random() * 10 + "s";
    box.appendChild(f);
    setTimeout(() => f.remove(), 23000);
  }, 1800);
}

let noteStarted = false;
function typeNote() {
  if (noteStarted) return;
  noteStarted = true;
  const el = $("noteText");
  el.classList.add("typing");
  let i = 0;
  const txt = CONFIG.note;
  const step = () => {
    el.textContent = txt.slice(0, ++i);
    if (i < txt.length) {
      const c = txt[i - 1];
      setTimeout(step, c === "." || c === "\n" ? 260 : 28);
    } else {
      el.classList.remove("typing");
      $("signature").textContent = CONFIG.fromName;
      $("signature").classList.add("in");
    }
  };
  step();
}

function setupReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      if (e.target.classList.contains("note")) setTimeout(typeNote, 500);
      io.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".reveal, .shot").forEach((el, i) => {
    if (el.classList.contains("shot")) el.style.transitionDelay = (i % 3) * 0.12 + "s";
    io.observe(el);
  });
}

/* ---------- the playful part ---------- */
const yesBtn = $("yesBtn");
const noBtn = $("noBtn");
const toast = $("toast");
const whereCard = $("whereCard");
const pickup = $("pickup");
const pickupBack = $("pickupBack");
const pickupConfirm = $("pickupConfirm");
const pickupText = $("pickupText");
const perksList = $("perks");
const pickupDone = $("pickupDone");
let dodges = 0, noClicks = 0, yesScale = 1;

function say(line) { toast.textContent = line; }

function setupPickupPage() {
  if (!whereCard || !pickup || !pickupBack || !pickupConfirm || !pickupText || !perksList) return;

  const updatePickupState = () => {
    const selected = [...perksList.querySelectorAll("li.on")].length;
    const allSelected = selected === CONFIG.perks.length;
    pickupConfirm.disabled = !allSelected;

    if (!allSelected) {
      const missing = CONFIG.perks.filter((perk, index) => !perksList.children[index]?.classList.contains("on"));
      pickupDone.innerHTML = missing.length
        ? `You skipped: ${missing.join(" • ")}<br>Choose ALL the terms first 😌`
        : "Choose ALL the terms first 😌";
      return;
    }

    pickupDone.textContent = "Perfect. You did it!!!!";
  };

  const openPickup = () => {
    pickupText.textContent = CONFIG.pickupText;
    perksList.innerHTML = "";
    CONFIG.perks.forEach((perk) => {
      const li = document.createElement("li");
      li.textContent = perk;
      li.addEventListener("click", () => {
        li.classList.toggle("on");
        updatePickupState();
      });
      perksList.appendChild(li);
    });
    pickupDone.textContent = "";
    pickupConfirm.disabled = true;
    pickup.hidden = false;
    requestAnimationFrame(() => pickup.classList.add("show"));
  };

  const closePickup = () => {
    pickup.classList.remove("show");
    setTimeout(() => { pickup.hidden = true; }, 300);
  };

  whereCard.addEventListener("click", openPickup);
  pickupBack.addEventListener("click", closePickup);
  pickupConfirm.addEventListener("click", () => {
    const selected = [...perksList.querySelectorAll("li.on")].length;
    if (selected !== CONFIG.perks.length) {
      const missing = CONFIG.perks.filter((perk, index) => !perksList.children[index]?.classList.contains("on"));
      pickupDone.innerHTML = missing.length
        ? `You skipped: ${missing.join(" • ")}<br>Choose ALL the terms before continuing 😌`
        : "Choose ALL the terms before continuing 😌";
      return;
    }
    pickupDone.textContent = "I'M SO EXCITED!!";
    setTimeout(closePickup, 900);
  });
}

function runAway() {
  // first time: pull the button out of the layout so it can roam the screen
  if (!noBtn.classList.contains("run")) {
    const r = noBtn.getBoundingClientRect();
    noBtn.style.left = r.left + "px";
    noBtn.style.top = r.top + "px";
    noBtn.classList.add("run");
    void noBtn.offsetWidth;
  }
  const pad = 20;
  const maxX = window.innerWidth - noBtn.offsetWidth - pad;
  const maxY = window.innerHeight - noBtn.offsetHeight - pad;
  let x, y, tries = 0;
  const cur = noBtn.getBoundingClientRect();
  do {
    x = pad + Math.random() * (maxX - pad);
    y = pad + Math.random() * (maxY - pad);
    tries++;
  } while (Math.hypot(x - cur.left, y - cur.top) < 220 && tries < 20);
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
  dodges++;
  if (dodges % 2 === 1) say(CONFIG.dodgeLines[(dodges - 1) % CONFIG.dodgeLines.length]);
  growYes();
}

function growYes() {
  yesScale = Math.min(1.5, yesScale + 0.06);
  yesBtn.style.transform = `scale(${yesScale})`;
}

noBtn.addEventListener("mouseenter", runAway);
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); runAway(); }, { passive: false });
noBtn.addEventListener("click", () => {
  // if he somehow catches it: it still doesn't work
  noBtn.classList.remove("shake");
  void noBtn.offsetWidth;
  noBtn.classList.add("shake");
  say(CONFIG.clickLines[noClicks % CONFIG.clickLines.length]);
  noClicks++;
  growYes();
  setTimeout(runAway, 450);
});

yesBtn.addEventListener("click", () => {
  bigConfetti();
  noBtn.style.display = "none";
  $("arena").style.display = "none";
  toast.textContent = "";
  document.querySelector(".ask h2").innerHTML = "Aywa keda ezbot :)";
  $("venue").textContent = CONFIG.venue || CONFIG.place;
  const d = $("details");
  d.hidden = false;
  setTimeout(() => d.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
  const tick = () => fillCount("d", new Date(CONFIG.dinnerAt) - Date.now());
  tick();
  setInterval(tick, 1000);
});

setupPickupPage();

/* ---------- hidden surprise + guessing game ---------- */
const ball = $("ball");
let guesses = 0;

ball.addEventListener("click", () => {
  ball.classList.remove("kicked");
  void ball.offsetWidth;
  ball.classList.add("kicked");
  boom({ particleCount: 90, spread: 100, origin: { y: 0.9 } });
  const box = $("guessBox");
  if (box.hidden) {
    $("guessQ").textContent = CONFIG.guess.question;
    box.hidden = false;
    setTimeout(() => $("guessInput").focus(), 300);
  }
});

$("guessForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("guessInput");
  if (!input.value.trim()) return;
  const g = CONFIG.guess;
  const reply = $("guessReply");
  guesses++;
  input.value = "";
  if (guesses >= g.revealAfter) {
    $("guessForm").hidden = true;
    reply.textContent = g.last;
    setTimeout(() => {
      const s = $("secret");
      s.textContent = CONFIG.secret;
      s.classList.add("in");
      boom({ particleCount: 120, spread: 100, origin: { y: 0.8 } });
    }, 1500);
  } else {
    reply.textContent = g.replies[(guesses - 1) % g.replies.length];
  }
});

init();