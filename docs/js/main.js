// js/main.js

// 1. Lista de pistas con boost flag y nombres exactos de archivos
const tracks = [
  { file:"hero.mp3",                 title:"Hero",                 cover:"media/Portadas canciones/hero-cover.jpg",                 boost: true  },
  { file:"iris.mp3",                 title:"Iris",                 cover:"media/Portadas canciones/iris-cover.jpg",                 boost: false },
  { file:"say-you-won't-let-go.mp3", title:"Say You Won't Let Go", cover:"media/Portadas canciones/say-you-wont-let-go.jpg",       boost: true  },
  { file:"young-and-beautiful.mp3",  title:"Young and Beautiful", cover:"media/Portadas canciones/young-and-beautiful.jpg",      boost: false }
];

// 2. Modal de selección de música
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
      // encodeURI para asegurar que el apóstrofe no rompa la ruta
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

// 3. Máquina de escribir
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

// 4. Carrusel Polaroid con controles
function initPolaroidCarousel(selector, filenames) {
  const carousel = document.querySelector(selector);
  const prev = document.getElementById("polaroid-prev");
  const next = document.getElementById("polaroid-next");
  const slideContainer = document.getElementById("polaroid-slide");

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

// 5. Scroll animations
function animarAlScroll(sel, cls = "mostrar") {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add(cls);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(sel).forEach(el => obs.observe(el));
}

// 6. Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Música de fondo
  window.bgAudio = new Audio();
  showAudioModal();

  // Sobre interactivo
  const sobreImg = document.getElementById("sobre-img");
  sobreImg.addEventListener("click", () => {
    sobreImg.src = "media/Sobre/sobre-abierto.png";
    sobreImg.classList.add("opened");
    document.getElementById("carta-fija").classList.add("show");
  });

  // Carta fija
  fetch("content/carta.txt")
    .then(r => r.text())
    .then(t => document.querySelector(".contenido-carta").innerText = t.trim());

  // Carta scroll
  typeScroll();

  // Carrusel Polaroid
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

  // Verso final
  fetch("content/verso.txt")
    .then(r => r.text())
    .then(t => document.getElementById("verso-final").innerText = t.trim());

  // Animaciones scroll
  animarAlScroll("#video-especial, #verso-final");

  // Video sorpresa pausa música
  const vid = document.getElementById("video-sorpresa");
  if (vid) {
    vid.addEventListener("play", () => bgAudio.pause());
    vid.addEventListener("pause", () => bgAudio.play());
  }

  // Cambiar canción al final
  document.getElementById("change-song-btn").addEventListener("click", showAudioModal);

  // Controles manuales
  document.getElementById("play-btn").addEventListener("click", () => bgAudio.play());
  document.getElementById("pause-btn").addEventListener("click", () => bgAudio.pause());
});
