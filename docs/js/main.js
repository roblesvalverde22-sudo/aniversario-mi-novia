// js/main.js

// 1. Lista de pistas con flag para boost de volumen
const tracks = [
  { file: "hero.mp3",                 title: "Hero",                 cover: "media/Portadas canciones/hero-cover.jpg",               boost: true  },
  { file: "iris.mp3",                 title: "Iris",                 cover: "media/Portadas canciones/iris-cover.jpg",               boost: false },
  { file: "say-you-won't-let-go.mp3", title: "Say You Won't Let Go", cover: "media/Portadas canciones/say-you-wont-let-go.jpg",         boost: true  },
  { file: "young-and-beautiful.mp3",  title: "Young and Beautiful", cover: "media/Portadas canciones/young-and-beautiful.jpg",         boost: false }
];

// 2. Muestra un modal para seleccionar la canción de fondo
function showAudioModal() {
  const modal = document.createElement("div");
  modal.id = "audio-modal";
  const content = document.createElement("div");
  content.className = "modal-content";

  const prompt = document.createElement("p");
  prompt.className = "modal-prompt";
  prompt.textContent = "¿Con qué canción quieres acompañar nuestra historia de amor?";
  content.appendChild(prompt);

  tracks.forEach(t => {
    const div = document.createElement("div");
    div.className = "track";
    div.innerHTML = `
      <img src="${encodeURI(t.cover)}" alt="${t.title}"/>
      <p>${t.title}</p>
    `;
    div.addEventListener("click", () => {
      bgAudio.src = encodeURI(`media/audio/${t.file}`);
      bgAudio.loop = true;
      bgAudio.volume = t.boost ? 1.0 : 0.5;
      bgAudio.play();
      document.body.removeChild(modal);
    });
    content.appendChild(div);
  });

  modal.appendChild(content);
  document.body.appendChild(modal);
}

// 3. Efecto máquina de escribir para la carta scrollable
function typeScroll() {
  const cont = document.getElementById("carta-scroll");
  fetch("content/carta-scroll.txt")
    .then(r => r.text())
    .then(text => {
      cont.textContent = "";
      const p = document.createElement("p");
      cont.appendChild(p);
      let i = 0, speed = 25;
      (function typer() {
        if (i < text.length) {
          p.textContent += text.charAt(i++);
          setTimeout(typer, speed);
        }
      })();
    });
}

// 4. Inicializa un carrusel Polaroid con controles prev/next
function initPolaroidCarousel(selector, filenames) {
  const slideContainer = document.getElementById("polaroid-slide");
  const prev = document.getElementById("polaroid-prev");
  const next = document.getElementById("polaroid-next");

  const frames = filenames.map(fn => {
    const frame = document.createElement("div");
    frame.className = "polaroid-frame";
    const img = document.createElement("img");
    img.src = encodeURI(`media/carrusel/${fn}`);
    frame.appendChild(img);
    const name = fn.replace(/\.[^/.]+$/, "");
    const caption = document.createElement("div");
    caption.className = "polaroid-caption";
    caption.textContent = name;
    frame.appendChild(caption);
    return frame;
  });

  let idx = 0;
  function show() {
    slideContainer.innerHTML = "";
    slideContainer.appendChild(frames[idx]);
  }
  prev.addEventListener("click", () => {
    idx = (idx - 1 + frames.length) % frames.length;
    show();
  });
  next.addEventListener("click", () => {
    idx = (idx + 1) % frames.length;
    show();
  });
  show();
}

// 5. Anima elementos al hacer scroll
function animarAlScroll(selector, cls = "mostrar") {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add(cls);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(selector).forEach(el => obs.observe(el));
}

// 6. Lógica principal al cargar la página
document.addEventListener("DOMContentLoaded", () => {

  // —————— 1) Detectar entorno (local vs. GitHub Pages) ——————
  const isGithub = window.location.hostname.includes("github.io");
  if (isGithub) {
    // Background sparkles
    const bg = document.getElementById("background-video");
    if (bg) {
      bg.src = "https://github.com/roblesvalverde22-sudo/aniversario-mi-novia/releases/download/v1.0/Particles.Fire.Sparks.mp4";
      bg.load();
    }
    // Overlay video
    const overlay = document.getElementById("overlay-video");
    if (overlay) {
      overlay.src = "https://github.com/roblesvalverde22-sudo/aniversario-mi-novia/releases/download/v1.0/sorpresa.mp4";
      overlay.load();
    }
    // Sección de video con controles
    const vidSpec = document.getElementById("video-sorpresa");
    if (vidSpec) {
      const srcTag = vidSpec.querySelector("source");
      srcTag.src = "https://github.com/roblesvalverde22-sudo/aniversario-mi-novia/releases/download/v1.0/sorpresa.mp4";
      vidSpec.load();
    }
  }

  // —————— 2) Música de fondo ——————
  window.bgAudio = new Audio();
  bgAudio.volume = 0.5;
  showAudioModal();

  // —————— 3) Lógica del sobre ——————
  const sobreImg = document.getElementById("sobre-img");
  sobreImg.addEventListener("click", () => {
    sobreImg.src = "media/Sobre/sobre-abierto.png";
    sobreImg.classList.add("opened");
    document.getElementById("carta-fija").classList.add("show");
  });

  // —————— 4) Carta fija ——————
  fetch("content/carta.txt")
    .then(r => r.text())
    .then(t => document.querySelector(".contenido-carta").innerText = t.trim());

  // —————— 5) Carta scrollable ——————
  typeScroll();

  // —————— 6) Carrusel Polaroid ——————
  const slideFiles = [
    "14 de febrero 2025.jpeg",
    "31 de diciembre. año nuevo.jpeg",
    "con nuestra perrhija.jpeg",
    "con poquito filtro jaja.jpeg",
    "De mis fotos favs.jpeg",
    "Haces todas las salidas especiales.jpeg",
    "Mi foto fav.jpeg",
    "Mi persona favorita en mi epoca favorita.jpeg",
    "Nuestra foto. con la que diran estos eran nuestros papás de jóvenes.jpeg",
    "Por más momentos felices.jpeg",
    "que bonitos nos vemos.jpeg",
    "Siempre con tus detalles. hiceste el 14 de febrero muy especial con el picnic.jpeg",
    "te amo.jpeg"
  ];
  initPolaroidCarousel(".carousel", slideFiles);

  // —————— 7) Verso final ——————
  fetch("content/verso.txt")
    .then(r => r.text())
    .then(t => document.getElementById("verso-final").innerText = t.trim());

  // —————— 8) Animaciones al scroll ——————
  animarAlScroll("#video-especial, #verso-final");

  // —————— 9) Interplay video / audio ——————
  const vid = document.getElementById("video-sorpresa");
  if (vid) {
    vid.addEventListener("play",  () => bgAudio.pause());
    vid.addEventListener("pause", () => bgAudio.play());
  }

  // —————— 10) Sección cambiar canción ——————
  document.getElementById("change-song-btn").addEventListener("click", showAudioModal);

  // —————— 11) Controles manuales ——————
  document.getElementById("play-btn").addEventListener("click", () => bgAudio.play());
  document.getElementById("pause-btn").addEventListener("click", () => bgAudio.pause());

});
