type ConfettiOptions = {
  particleCount?: number;
  spread?: number;
  originX?: number;
  originY?: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rotation: number;
  spin: number;
  color: string;
  life: number;
  maxLife: number;
};

const COLORS = [
  "oklch(0.72 0.19 47)",
  "oklch(0.78 0.16 55)",
  "#34d399",
  "#fbbf24",
  "#f472b6",
  "#ffffff",
];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createParticles(
  width: number,
  height: number,
  options: ConfettiOptions,
): Particle[] {
  const count = options.particleCount ?? 100;
  const spread = options.spread ?? 70;
  const originX = (options.originX ?? 0.5) * width;
  const originY = (options.originY ?? 0.6) * height;

  return Array.from({ length: count }, () => {
    const angle = randomBetween(-spread, spread) * (Math.PI / 180);
    const speed = randomBetween(6, 14);

    return {
      x: originX + randomBetween(-24, 24),
      y: originY + randomBetween(-12, 12),
      vx: Math.sin(angle) * speed,
      vy: -Math.cos(angle) * speed - randomBetween(2, 8),
      w: randomBetween(6, 11),
      h: randomBetween(4, 9),
      rotation: randomBetween(0, Math.PI * 2),
      spin: randomBetween(-0.25, 0.25),
      color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
      life: 0,
      maxLife: randomBetween(70, 110),
    };
  });
}

function burst(options: ConfettiOptions = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  let particles = createParticles(canvas.width, canvas.height, options);
  let frame = 0;

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter((particle) => {
      particle.life += 1;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.22;
      particle.vx *= 0.99;
      particle.rotation += particle.spin;

      const alpha = 1 - particle.life / particle.maxLife;
      if (alpha <= 0) return false;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.fillRect(-particle.w / 2, -particle.h / 2, particle.w, particle.h);
      ctx.restore();

      return true;
    });

    frame += 1;
    if (particles.length > 0 && frame < 180) {
      window.requestAnimationFrame(tick);
      return;
    }

    canvas.remove();
  };

  window.requestAnimationFrame(tick);
}

export function celebrateQuoteSubmission() {
  burst({ particleCount: 130, spread: 80, originX: 0.5, originY: 0.62 });
  window.setTimeout(
    () => burst({ particleCount: 90, spread: 100, originX: 0.28, originY: 0.55 }),
    180,
  );
  window.setTimeout(
    () => burst({ particleCount: 90, spread: 100, originX: 0.72, originY: 0.55 }),
    360,
  );
}
