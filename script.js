
// Navbar shadow on scroll
window.addEventListener("scroll",()=>{
  document.getElementById("navbar")
    .classList.toggle("scrolled", window.scrollY > 50);
});

// Scroll reveal with STAGGER using data-stagger
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if(entry.isIntersecting){
      const delay = parseInt(entry.target.getAttribute("data-stagger") || "0", 10) * 140;
      entry.target.style.transitionDelay = delay + "ms";
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.14});

reveals.forEach(el=>observer.observe(el));

// Counter animation (starts when counters become visible)
const counterWrap = document.querySelector(".counter-grid");
if(counterWrap){
  const counterObs = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
      if(entry.isIntersecting){
        const counters = counterWrap.querySelectorAll("[data-target]");
        counters.forEach(counter=>{
          const target = +counter.getAttribute("data-target");
          const duration = 900; // ms
          const start = performance.now();
          const tick = (t)=>{
            const progress = Math.min((t - start) / duration, 1);
            counter.innerText = String(Math.round(progress * target));
            if(progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
        counterObs.unobserve(counterWrap);
      }
    });
  }, {threshold:0.2});
  counterObs.observe(counterWrap);
}

// ===== CARROSSEL INFINITO REAL =====

const track = document.getElementById("carouselTrack");

if(track){

  // CLONAR ITENS PARA LOOP INFINITO
  const items = Array.from(track.children);
  items.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  let position = 0;
  const speed = 0.5; // menor = mais lento

  function animateCarousel(){
    position -= speed;

    if(Math.abs(position) >= track.scrollWidth / 2){
      position = 0;
    }

    track.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animateCarousel);
  }

  animateCarousel();
}


// ---------- WhatsApp (por passeio) ----------
// Troque o número abaixo pelo seu WhatsApp oficial (com DDI +55)
const WHATSAPP_NUMBER = "5522999683645";

function enviarPasseioWhatsApp(btn){
  const card = btn.closest(".tour-card");
  const city = card.getAttribute("data-city") || "";
  const tour = card.getAttribute("data-tour") || "";
  const date = card.querySelector('input[name="data"]').value;
  const people = card.querySelector('input[name="pessoas"]').value;
  const age = card.querySelector('input[name="idade"]').value;
  const name = card.querySelector('input[name="nome"]').value;

  if(!name || !date || !people || !age){
    alert("Por favor, preencha nome, data, quantidade de pessoas e idade.");
    return;
  }

  const msg =
`Olá! Quero montar meu passeio com o Igor Guia 😊
• Cidade: ${city}
• Passeio: ${tour}
• Data: ${date}
• Pessoas: ${people}
• Idade: ${age}
• Nome: ${name}

Pode me passar valores, horários e ponto de encontro?`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

function limparFormulario(btn){
  const card = btn.closest(".tour-card");
  card.querySelectorAll("input").forEach(i => i.value = "");
}

// ===== NAVBAR MOBILE (ABRIR/FECHAR) =====
const navToggle = document.getElementById("navToggle");
const navBackdrop = document.getElementById("navBackdrop");
const navLinks = document.getElementById("navLinks");

function openMenu(){
  document.body.classList.add("menu-open");
  navToggle?.setAttribute("aria-expanded", "true");
}

function closeMenu(){
  document.body.classList.remove("menu-open");
  navToggle?.setAttribute("aria-expanded", "false");
}

navToggle?.addEventListener("click", () => {
  if(document.body.classList.contains("menu-open")) closeMenu();
  else openMenu();
});

navBackdrop?.addEventListener("click", closeMenu);

// Fecha ao clicar em qualquer link (mobile)
navLinks?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", closeMenu);
});

// Fecha com ESC
window.addEventListener("keydown", (e) => {
  if(e.key === "Escape") closeMenu();
});


// ===== WhatsApp - Excursões (B2B) =====
function enviarExcursaoWhatsApp(){
  // Usa o mesmo WHATSAPP_NUMBER do seu projeto (se existir).
  const number = (typeof WHATSAPP_NUMBER !== "undefined") ? WHATSAPP_NUMBER : "5599999999999";

  const nome = document.getElementById("exc_nome")?.value || "";
  const empresa = document.getElementById("exc_empresa")?.value || "";
  const contato = document.getElementById("exc_contato")?.value || "";
  const data = document.getElementById("exc_data")?.value || "";
  const pessoas = document.getElementById("exc_pessoas")?.value || "";
  const cidades = document.getElementById("exc_cidades")?.value || "";
  const obs = document.getElementById("exc_obs")?.value || "";

  if(!nome || !empresa || !contato || !data || !pessoas || !cidades){
    alert("Preencha nome, agência, contato, data, quantidade e cidades.");
    return;
  }

  const msg =
`Olá, Igor! 👋
Sou ${nome} (${empresa}).
Quero organizar uma EXCURSÃO para a Região dos Lagos.

• Data: ${data}
• Qtd. pessoas: ${pessoas}
• Cidades: ${cidades}
• Contato para retorno: ${contato}
• Observações: ${obs || "—"}

Pode me enviar uma proposta e disponibilidade?`;

  window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, "_blank");
}

// ===== Carrossel infinito (Excursões) + pausa no hover =====
(function(){
  const track = document.getElementById("excCarouselTrack");
  if(!track) return;

  // clona slides para loop suave
  const slides = Array.from(track.children);
  slides.forEach(s => track.appendChild(s.cloneNode(true)));

  let x = 0;
  let paused = false;
  const speed = 0.45; // ajuste fino (0.35 mais lento / 0.7 mais rápido)

  function step(){
    if(!paused){
      x -= speed;

      // reset suave na metade do track (porque duplicamos)
      const half = track.scrollWidth / 2;
      if(Math.abs(x) >= half) x = 0;

      track.style.transform = `translateX(${x}px)`;
    }
    requestAnimationFrame(step);
  }

  // pausa no hover (desktop)
  track.addEventListener("mouseenter", () => paused = true);
  track.addEventListener("mouseleave", () => paused = false);

  // pausa no toque (mobile) enquanto o dedo está pressionando
  track.addEventListener("touchstart", () => paused = true, {passive:true});
  track.addEventListener("touchend", () => paused = false, {passive:true});

  step();
})();

// ===== EFEITO 3D NOS CARDS DE CIDADE =====
(function(){
  const cards = document.querySelectorAll(".tilt-card");

  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      if(window.innerWidth <= 768) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });
})();


// ===== PARALLAX SUAVE NO HERO =====
(function(){
  const hero = document.querySelector(".hero-parallax");
  const video = document.getElementById("heroVideo");
  const content = document.querySelector(".hero-video .hero-content");
  const waves = document.querySelectorAll(".hero-video .wave");

  if(!hero || !video) return;

  function updateParallax(){
    const rect = hero.getBoundingClientRect();
    const windowH = window.innerHeight;

    // só aplica se o hero estiver visível
    if(rect.bottom > 0 && rect.top < windowH){
      const progress = rect.top / windowH;

      // vídeo move mais devagar
      const videoY = progress * -28;
      video.style.transform = `translate(-50%, calc(-50% + ${videoY}px)) scale(1.08)`;

      // conteúdo com leve profundidade
      if(content){
        const contentY = progress * -10;
        content.style.transform = `translateY(${contentY}px)`;
      }

      // ondas em velocidades diferentes
      waves.forEach((wave, index) => {
        const factor = (index + 1) * 4;
        wave.style.marginBottom = `${progress * -factor}px`;
      });
    }
  }

  window.addEventListener("scroll", updateParallax, { passive: true });
  window.addEventListener("resize", updateParallax);
  updateParallax();
})();