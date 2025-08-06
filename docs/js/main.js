// 1. Lista de pistas
const tracks = [
  { file:"hero.mp3",                 title:"Hero",                 cover:"media/Portadas canciones/hero-cover.jpg",               boost:true  },
  { file:"iris.mp3",                 title:"Iris",                 cover:"media/Portadas canciones/iris-cover.jpg",               boost:false },
  { file:"say-you-won't-let-go.mp3", title:"Say You Won't Let Go", cover:"media/Portadas canciones/say-you-wont-let-go.jpg",         boost:true  },
  { file:"young-and-beautiful.mp3",  title:"Young and Beautiful", cover:"media/Portadas canciones/young-and-beautiful.jpg",         boost:false }
];

// 2. Modal de selección de canción (oscuro)
function showAudioModal() {
  const modal = document.createElement("div");
  modal.id = "audio-modal";
  Object.assign(modal.style, {
    position:"fixed", top:0, left:0, width:"100%", height:"100%",
    background:"rgba(0,0,0,0.9)", display:"flex",
    alignItems:"center", justifyContent:"center", zIndex:10
  });

  const content = document.createElement("div");
  Object.assign(content.style, {
    color:"#fff", background:"transparent",
    padding:"2rem", textAlign:"center"
  });

  const prompt = document.createElement("p");
  prompt.textContent = "¿Con qué canción quieres acompañar nuestra historia de amor?";
  prompt.style.marginBottom = "1rem";
  content.appendChild(prompt);

  tracks.forEach(t => {
    const div = document.createElement("div");
    Object.assign(div.style, {
      display:"inline-block", margin:"0 1rem", cursor:"pointer", color:"#fff"
    });
    div.innerHTML = `
      <img src="${encodeURI(t.cover)}" alt="${t.title}" style="width:100px;border-radius:8px;border:2px solid #fff;"/>
      <p style="margin-top:.5rem;">${t.title}</p>
    `;
    div.addEventListener("click", () => {
      bgAudio.src = `media/audio/${t.file}`;
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

// 3. Typewriter para carta-scroll
function typeScroll() {
  const cont = document.getElementById("carta-scroll");
  fetch("content/carta-scroll.txt")
    .then(r => r.text())
    .then(text => {
      cont.innerHTML = `<div class="card-bg"></div><p></p>`;
      const p = cont.querySelector("p");
      let i = 0, speed = 25;
      (function typer(){
        if(i<text.length) {
          p.textContent += text.charAt(i++);
          setTimeout(typer, speed);
        }
      })();
    });
}

// 4. Carrusel Polaroid
function initPolaroidCarousel(selector, filenames) {
  const slideContainer = document.getElementById("polaroid-slide");
  const prev = document.getElementById("polaroid-prev");
  const next = document.getElementById("polaroid-next");

  const frames = filenames.map(fn => {
    const frame = document.createElement("div");
    frame.className = "polaroid-frame";
    const img = document.createElement("img");
    img.src = `media/carrusel/${fn}`;
    frame.appendChild(img);
    const cap = document.createElement("div");
    cap.className = "polaroid-caption";
    cap.textContent = fn.replace(/\.[^/.]+$/,"");
    frame.appendChild(cap);
    return frame;
  });

  let idx = 0;
  function show(){ slideContainer.innerHTML=""; slideContainer.appendChild(frames[idx]); }
  prev.onclick = ()=>{ idx=(idx-1+frames.length)%frames.length; show(); };
  next.onclick = ()=>{ idx=(idx+1)%frames.length; show(); };
  show();
}

// 5. Animar al scroll
function animarAlScroll(sel,cls="mostrar"){
  const obs=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){
      e.target.classList.add(cls);
      obs.unobserve(e.target);
    }});},{threshold:0.1});
  document.querySelectorAll(sel).forEach(el=>obs.observe(el));
}

// 6. Intentar play + fallback touch
function tryPlay(video){
  if(!video) return;
  video.play().catch(()=>{
    const onTouch=()=>{
      video.play();
      window.removeEventListener("touchstart",onTouch);
    };
    window.addEventListener("touchstart",onTouch,{once:true});
  });
}

// 7. Lógica principal
document.addEventListener("DOMContentLoaded",()=>{
  // 7.1 Entorno Pages vs local
  const isGH = window.location.hostname.includes("github.io");
  if(isGH){
    const bgV=document.getElementById("background-video");
    bgV&& (bgV.src="https://github.com/roblesvalverde22-sudo/aniversario-mi-novia/releases/download/v1.0/Particles.Fire.Sparks.mp4",bgV.load());
    const ov=document.getElementById("overlay-video");
    ov&& (ov.src="https://github.com/roblesvalverde22-sudo/aniversario-mi-novia/releases/download/v1.0/sorpresa.mp4",ov.load());
    const vs=document.getElementById("video-sorpresa");
    if(vs){
      vs.querySelector("source").src="https://github.com/roblesvalverde22-sudo/aniversario-mi-novia/releases/download/v1.0/sorpresa.mp4";
      vs.load();
    }
  }

  // 7.2 Vídeos de fondo
  tryPlay(document.getElementById("background-video"));
  tryPlay(document.getElementById("overlay-video"));

  // 7.3 Música de fondo
  window.bgAudio=new Audio();
  bgAudio.volume=0.5;
  showAudioModal();

  // 7.4 Lógica del sobre
  const sobre=document.getElementById("sobre-img");
  sobre.addEventListener("click",()=>{
    sobre.src="media/Sobre/sobre-abierto.png";
    sobre.classList.add("opened");
    document.querySelector(".contenido-carta").classList.add("show");
  });

  // 7.5 Carta fija
  fetch("content/carta.txt").then(r=>r.text()).then(t=>{
    document.querySelector(".contenido-carta").innerText=t.trim();
  });

  // 7.6 Carta scroll
  typeScroll();

  // 7.7 Carrusel Polaroid
  const archivos=[
    "14 de febrero 2025.jpeg","31 de diciembre. año nuevo.jpeg","con nuestra perrhija.jpeg",
    "con poquito filtro jaja.jpeg","De mis fotos favs.jpeg","Haces todas las salidas especiales.jpeg",
    "Mi foto fav.jpeg","Mi persona favorita en mi epoca favorita.jpeg",
    "Nuestra foto. con la que diran estos eran nuestros papás de jóvenes.jpeg",
    "Por más momentos felices.jpeg","que bonitos nos vemos.jpeg",
    "Siempre con tus detalles. hiceste el 14 de febrero muy especial con el picnic.jpeg","te amo.jpeg"
  ];
  initPolaroidCarousel(".carousel",archivos);

  // 7.8 Verso final
  fetch("content/verso.txt").then(r=>r.text()).then(t=>{
    document.getElementById("verso-final").innerText=t.trim();
  });

  // 7.9 Animar al scroll
  animarAlScroll("#video-especial, #verso-final");

  // 7.10 Vídeo vs audio
  const vs=document.getElementById("video-sorpresa");
  if(vs){
    vs.addEventListener("play",()=>bgAudio.pause());
    vs.addEventListener("pause",()=>bgAudio.play());
  }

  // 7.11 Cambiar canción y controles
  document.getElementById("change-song-btn").onclick=showAudioModal;
  document.getElementById("play-btn").onclick=()=>bgAudio.play();
  document.getElementById("pause-btn").onclick=()=>bgAudio.pause();
});
