'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const VOICE_BAR_HEIGHTS = [35, 55, 40, 75, 50, 90, 60, 100, 65, 85, 45, 70, 55, 95, 40, 60, 30, 50];

export default function NexoLanding() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const chatCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0,
      H = 0;
    let raf = 0;

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; depth: number };
    let particles: Particle[] = [];
    const COUNT = 70;

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.6,
          depth: Math.random() * 0.6 + 0.4,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x,
            dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx!.strokeStyle = `rgba(169,150,255,${0.1 * (1 - dist / 120)})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200,190,255,${0.55 * p.depth})`;
        ctx!.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    draw();

    const onResize = () => {
      resize();
      initParticles();
    };
    window.addEventListener('resize', onResize);

    const onMouseMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      canvas!.style.transform = `translate(${nx * -14}px, ${ny * -14}px)`;
    };
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // hero 3D tilt
  useEffect(() => {
    const heroVisual = heroVisualRef.current;
    const chatCard = chatCardRef.current;
    if (!heroVisual || !chatCard) return;

    const onMove = (e: MouseEvent) => {
      const rect = heroVisual.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      chatCard.style.setProperty('--ry', `${px * 22 - 10}deg`);
      chatCard.style.setProperty('--rx', `${-py * 16 + 6}deg`);
    };
    const onLeave = () => {
      chatCard.style.setProperty('--ry', '-10deg');
      chatCard.style.setProperty('--rx', '6deg');
    };

    heroVisual.addEventListener('mousemove', onMove);
    heroVisual.addEventListener('mouseleave', onLeave);
    return () => {
      heroVisual.removeEventListener('mousemove', onMove);
      heroVisual.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>('.tilt-card'));
    const cardHandlers: { el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }[] = [];

    cards.forEach((card) => {
      const move = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 10;
        const ry = (px - 0.5) * 10;
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
      };
      const leave = () => {
        card.style.transform = 'rotateX(0) rotateY(0)';
      };
      card.addEventListener('mousemove', move);
      card.addEventListener('mouseleave', leave);
      cardHandlers.push({ el: card, move, leave });
    });

    const revealEls = Array.from(root.querySelectorAll<HTMLElement>('.reveal, .steps-line'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      },
      { threshold: 0.18 }
    );
    revealEls.forEach((el) => io.observe(el));

    return () => {
      cardHandlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
      });
      io.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className="nexo-landing relative bg-[#050308] text-[#f6f4ff] overflow-x-clip">
      <style>{nexoStyles}</style>

      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 transition-transform duration-500" />
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      {/* NAV */}
      <nav className="fixed top-[18px] left-1/2 -translate-x-1/2 w-[min(1200px,92vw)] z-[100] flex items-center justify-between rounded-full border border-[rgba(168,150,255,0.14)] bg-[rgba(15,11,26,0.55)] backdrop-blur-2xl px-3 py-3 pl-5">
        <div className="flex items-center gap-2.5 font-bold text-[1.05rem] tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          <Mark className="w-[34px] h-[34px]" />
          NEXO
        </div>
        <div className="hidden md:flex gap-[30px] text-[0.92rem] text-[#b8b0d6]">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
          <a href="#rules" className="hover:text-white transition-colors">Rules</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <a href="https://chat-vert-nu-34.vercel.app/" className="btn-primary rounded-full px-[22px] py-3 text-[0.92rem] font-semibold">
          Open Nexo
        </a>
      </nav>

      <main className="relative z-[2]">
        {/* HERO */}
        <section className="hero min-h-screen flex items-center px-[min(6vw,90px)] pt-[150px] pb-20">
          <div className="hero-grid w-full max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            <div>
              <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-[rgba(168,150,255,0.14)] bg-[rgba(124,92,255,0.06)] pl-3 pr-4 py-2 text-[0.82rem] text-[#a996ff] mb-7">
                <BoltIcon className="w-3.5 h-3.5" />
                Next-generation messenger
              </span>
              <h1
                className="anim-h1 text-[clamp(2.6rem,5.6vw,4.6rem)] font-bold tracking-tight leading-[1.04]"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Message at the
                <br />
                speed of{' '}
                <span className="bg-[linear-gradient(100deg,#a996ff,#7c5cff_55%,#5b3df0)] bg-clip-text text-transparent">
                  thought.
                </span>
              </h1>
              <p className="anim-lead mt-6 max-w-[44ch] text-[1.08rem] leading-relaxed text-[#b8b0d6]">
                Nexo brings chat, calls, groups, and channels into one fast, private space — built for
                people who talk in real time, not in loading spinners.
              </p>
              <div className="anim-ctas flex gap-3.5 mt-9">
                <a href="https://chat-vert-nu-34.vercel.app/" className="btn-primary rounded-full px-6 py-3 text-[0.92rem] font-semibold">
                  Open Nexo →
                </a>
                <a href="#features" className="btn-ghost rounded-full px-6 py-3 text-[0.92rem] font-semibold">
                  See features
                </a>
              </div>
              <div className="anim-strip flex gap-7 flex-wrap mt-14">
                <StripItem icon={<BoltIcon className="w-[18px] h-[18px] text-[#a996ff]" />} label="Real-time messaging" />
                <StripItem icon={<ShieldIcon className="w-[18px] h-[18px] text-[#a996ff]" />} label="Secure & private" />
                <StripItem icon={<GroupIcon className="w-[18px] h-[18px] text-[#a996ff]" />} label="Groups & channels" />
              </div>
            </div>

            <div ref={heroVisualRef} className="hero-visual relative h-[440px] md:h-[560px] mt-5 md:mt-0" style={{ perspective: '1600px', transformStyle: 'preserve-3d' }}>
              <div className="orbit-wrap absolute top-[-10px] right-10 w-[150px] h-[150px]" style={{ transformStyle: 'preserve-3d' }}>
                <div className="ring ring-a" />
                <div className="ring ring-b" />
                <div className="planet" />
              </div>

              <div className="phone-stage absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                <div ref={chatCardRef} className="chat-card w-[min(380px,82vw)] rounded-[28px] border border-[rgba(168,150,255,0.14)] p-5 backdrop-blur-2xl">
                  <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-[rgba(168,150,255,0.14)]">
                    <div className="relative w-9 h-9 rounded-full flex-none overflow-hidden">
                      <Image src="/avatar.jpg" alt="mitywa" fill sizes="36px" className="object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold text-[0.92rem]">mitywa</div>
                      <div className="text-[0.76rem] text-[#a996ff]">online</div>
                    </div>
                  </div>
                  <div className="bubble-in max-w-[80%] rounded-2xl rounded-bl-md px-4 py-2.5 text-[0.86rem] leading-snug mb-2.5 border border-[rgba(168,150,255,0.14)] bg-white/5">
                    Hey! Are you there?
                  </div>
                  <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5 text-[0.86rem] leading-snug mb-2.5 text-white bg-[linear-gradient(135deg,#7c5cff,#5b3df0)]" style={{ transform: 'translateZ(20px)' }}>
                    Yeah! Nexo looks amazing ✨
                  </div>
                  <div className="voice-bubble ml-auto flex items-center gap-3 max-w-[75%] rounded-2xl rounded-br-md pl-2 pr-3.5 py-2 mb-3.5 bg-[linear-gradient(135deg,#7c5cff,#5b3df0)]" style={{ transform: 'translateZ(20px)' }}>
                    <div className="voice-play w-8 h-8 rounded-full flex-none flex items-center justify-center bg-white/15">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="#fff"><path d="M6 4.5v15l13-7.5z" /></svg>
                    </div>
                    <div className="voice-wave flex items-end gap-[3px] h-5 flex-1">
                      {VOICE_BAR_HEIGHTS.map((h, i) => (
                        <span key={i} className="voice-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.06}s` }} />
                      ))}
                    </div>
                    <span className="text-[0.72rem] text-white/85 flex-none">0:12</span>
                  </div>
                  <div className="flex items-center gap-2.5 mt-1.5 px-3.5 py-2.5 rounded-full border border-[rgba(168,150,255,0.14)] bg-white/[0.03] text-[#7d7599] text-[0.82rem]">
                    Write a message…
                  </div>
                </div>

                <div className="float-card fc-1">
                  <MailIcon className="w-5 h-5 text-[#a996ff]" />
                  <div>
                    <div className="text-[0.82rem] font-semibold">Voice & Video</div>
                    <div className="text-[0.72rem] text-[#7d7599]">Stay closer</div>
                  </div>
                </div>
                <div className="float-card fc-2">
                  <ImageIcon className="w-5 h-5 text-[#a996ff]" />
                  <div>
                    <div className="text-[0.82rem] font-semibold">Media & Files</div>
                    <div className="text-[0.72rem] text-[#7d7599]">Share what matters</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="px-[min(6vw,90px)] py-[120px]">
          <div className="max-w-[1200px] mx-auto">
            <div className="reveal max-w-[640px] mb-16">
              <span className="block text-[#a996ff] text-[0.86rem] font-semibold mb-3.5">Everything, one place</span>
              <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Built for how people actually talk.
              </h2>
              <p className="mt-4 text-[#b8b0d6] text-[1.02rem] leading-relaxed max-w-[52ch]">
                Six things a messenger needs to get right — Nexo does all of them, in one app that stays
                out of your way.
              </p>
            </div>

            <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: '1200px' }}>
              <TiltCard wide title="Real-time messaging" icon={<ChatIcon />}>
                Messages land instantly and stay synced across every device you sign into — no refresh,
                no delay.
              </TiltCard>
              <TiltCard title="Secure & private" icon={<ShieldIcon />}>
                Your conversations stay between you and the people you choose to have them with.
              </TiltCard>
              <TiltCard title="Groups & channels" icon={<GroupIcon />}>
                Build communities, broadcast to thousands, and moderate with control that scales with
                you.
              </TiltCard>
              <TiltCard title="Voice & video calls" icon={<MailIcon />}>
                Crystal-clear calls that pick up right where the chat left off — no app-switching
                required.
              </TiltCard>
              <TiltCard wide title="Custom stickers & media" icon={<SmileIcon />}>
                Say more with expressions made for how you actually talk, and share photos, video, and
                files without losing quality.
              </TiltCard>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="px-[min(6vw,90px)] py-[120px]">
          <div className="max-w-[1200px] mx-auto">
            <div className="reveal max-w-[640px] mb-16">
              <span className="block text-[#a996ff] text-[0.86rem] font-semibold mb-3.5">How it works</span>
              <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                From sign-up to first message in under a minute.
              </h2>
            </div>

            <div className="reveal steps relative grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="steps-line hidden md:block absolute top-[27px] left-0 right-0 h-px">
                <svg viewBox="0 0 100 2" preserveAspectRatio="none" className="w-full h-0.5 block">
                  <path d="M0 1 H100" />
                </svg>
              </div>
              <Step n="01" title="Create your space">
                Pick a username, set an avatar, and you&apos;re in — no phone number required.
              </Step>
              <Step n="02" title="Bring your people">
                Start a chat, spin up a group, or launch a channel for your community.
              </Step>
              <Step n="03" title="Talk however you want">
                Text, voice notes, stickers, or a full call — all in the same thread.
              </Step>
            </div>
          </div>
        </section>

        {/* RULES */}
        <section id="rules" className="px-[min(6vw,90px)] py-[120px]">
          <div className="max-w-[1200px] mx-auto">
            <div className="reveal max-w-[640px] mb-16">
              <span className="block text-[#a996ff] text-[0.86rem] font-semibold mb-3.5">Community rules</span>
              <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                A space worth being in.
              </h2>
            </div>

            <div className="reveal grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-center">
              <div className="flex flex-col">
                <RuleItem icon={<ShieldIcon />} title="Respect other people's space">
                  Treat every chat, group, and channel the way you&apos;d want to be treated in it.
                </RuleItem>
                <RuleItem icon={<ClockIcon />} title="No spam, no scams">
                  Unsolicited links, fake giveaways, and bulk messages get accounts suspended.
                </RuleItem>
                <RuleItem icon={<LockIcon />} title="Protect your account">
                  Keep your password to yourself and enable everything Nexo offers to secure it.
                </RuleItem>
                <RuleItem icon={<AlertIcon />} title="Report what's wrong" last>
                  Every message, group, and channel can be reported straight to moderation.
                </RuleItem>
              </div>

              <div className="rounded-[28px] border border-[rgba(168,150,255,0.14)] bg-[linear-gradient(160deg,rgba(124,92,255,0.08),rgba(20,14,34,0.6))] p-11 min-h-[380px] flex flex-col justify-center items-start">
                <Mark className="w-20 h-20 mb-6" />
                <h3 className="text-[1.5rem] font-bold mb-3.5 max-w-[16ch]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Moderation you can actually reach.
                </h3>
                <p className="text-[#b8b0d6] text-[0.94rem] max-w-[34ch] leading-relaxed">
                  Reports get a response from a person, not a queue you never hear back from.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-[min(6vw,90px)] py-[120px]">
          <div className="max-w-[1200px] mx-auto">
            <div className="reveal max-w-[640px] mb-16">
              <span className="block text-[#a996ff] text-[0.86rem] font-semibold mb-3.5">FAQ</span>
              <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Good to know.
              </h2>
            </div>

            <div className="reveal max-w-[760px]">
              <Faq q="Is Nexo free to use?" defaultOpen>
                Yes — messaging, calls, groups, and channels are free. There&apos;s no message limit and
                no ads.
              </Faq>
              <Faq q="Can I use it on desktop?">
                Nexo runs in your browser and as a desktop app, with your conversations synced across
                both.
              </Faq>
              <Faq q="What happens to my data?">
                Your messages and media are stored to keep your history available across devices, and
                you can delete any conversation permanently at any time.
              </Faq>
              <Faq q="How big can a group or channel get?">
                Groups and channels scale from a handful of friends to broadcast-size communities, with
                admin tools that scale alongside them.
              </Faq>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center text-center pt-16 pb-16 px-[min(6vw,90px)]">
          <div className="relative w-[120px] h-[120px] mb-9" style={{ transformStyle: 'preserve-3d' }}>
            <div className="ring ring-a" style={{ animationDuration: '10s' }} />
            <div className="ring ring-b" style={{ animationDuration: '7s' }} />
            <div className="planet" />
          </div>
          <h2 className="reveal text-[clamp(2rem,4vw,3rem)] font-bold max-w-[16ch] mb-5" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Your space for real connections.
          </h2>
          <p className="reveal text-[#b8b0d6] max-w-[48ch] mb-9 text-[1.02rem]">
            Open Nexo and bring your people somewhere faster, quieter, and entirely yours.
          </p>
          <a href="https://chat-vert-nu-34.vercel.app/" className="reveal btn-primary rounded-full px-6 py-3 text-[0.92rem] font-semibold">
            Open Nexo →
          </a>
        </section>
      </main>

      <footer className="px-[min(6vw,90px)] pt-[50px] pb-10 border-t border-[rgba(168,150,255,0.14)] flex items-center justify-between flex-wrap gap-5">
        <div className="flex items-center gap-2.5 font-semibold text-[0.95rem]">
          <Mark className="w-[26px] h-[26px]" />
          NEXO
        </div>
        <div className="text-[#7d7599] text-[0.82rem]">© 2026 Nexo. Built for real conversations.</div>
      </footer>
    </div>
  );
}

function StripItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[#b8b0d6] text-[0.86rem]">
      {icon}
      {label}
    </div>
  );
}

function TiltCard({
  title,
  icon,
  wide,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`tilt-card relative rounded-[20px] border border-[rgba(168,150,255,0.14)] p-7 overflow-hidden min-h-[200px] ${wide ? 'md:col-span-2' : ''}`}>
      <div className="tilt-icon w-11 h-11 rounded-xl flex items-center justify-center border border-[rgba(168,150,255,0.14)] bg-[rgba(124,92,255,0.12)] text-[#a996ff] mb-5" style={{ transform: 'translateZ(30px)' }}>
        {icon}
      </div>
      <h3 className="text-[1.12rem] font-semibold mb-2.5" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", transform: 'translateZ(24px)' }}>
        {title}
      </h3>
      <p className="text-[0.92rem] text-[#b8b0d6] leading-relaxed" style={{ transform: 'translateZ(18px)' }}>
        {children}
      </p>
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="w-[54px] h-[54px] rounded-full flex items-center justify-center border border-[#a996ff] text-[#a996ff] font-bold mb-6 relative z-[2] bg-[#050308]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        {n}
      </div>
      <h3 className="text-[1.1rem] font-semibold mb-2.5">{title}</h3>
      <p className="text-[#b8b0d6] text-[0.92rem] leading-relaxed max-w-[32ch]">{children}</p>
    </div>
  );
}

function RuleItem({ icon, title, children, last }: { icon: React.ReactNode; title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`flex gap-4.5 py-5 border-t border-[rgba(168,150,255,0.14)] ${last ? 'border-b' : ''}`}>
      <div className="w-5 h-5 text-[#a996ff] flex-none mt-0.5">{icon}</div>
      <div>
        <h4 className="text-[1rem] font-semibold mb-1.5" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{title}</h4>
        <p className="text-[0.88rem] text-[#b8b0d6] leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function Faq({ q, children, defaultOpen }: { q: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="border-t border-[rgba(168,150,255,0.14)] py-5 last:border-b group">
      <summary className="cursor-pointer list-none flex items-center justify-between font-semibold text-[1.02rem]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        {q}
        <span className="plus w-[26px] h-[26px] rounded-full border border-[rgba(168,150,255,0.14)] flex items-center justify-center flex-none">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="w-3 h-3">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </summary>
      <p className="text-[#b8b0d6] text-[0.94rem] leading-relaxed mt-3.5 max-w-[62ch]">{children}</p>
    </details>
  );
}


function Mark({ className }: { className?: string }) {
  return (
    <div className={`relative shrink-0 ${className ?? ''}`}>
      <Image src="/logo.png" alt="Nexo" fill sizes="80px" className="object-contain" priority />
    </div>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M12 2 3 7v6c0 5 4 8.5 9 9 5-.5 9-4 9-9V7z" />
    </svg>
  );
}
function GroupIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.6 2.9-6.2 6.5-6.2S15.5 16.4 15.5 20" />
      <circle cx="18" cy="9" r="2.6" />
      <path d="M15.8 13.5c2.7.2 4.7 2.4 4.7 5.3" />
    </svg>
  );
}
function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v9a2.5 2.5 0 0 1-2.5 2.5H7l-4 4z" />
    </svg>
  );
}
function ImageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}
function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M4 4h16v11H7l-3 3z" />
    </svg>
  );
}
function SmileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 10h.01M15 10h.01M8 15c1.2 1.2 2.6 1.8 4 1.8s2.8-.6 4-1.8" />
    </svg>
  );
}
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5l3 2" />
    </svg>
  );
}
function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
function AlertIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M12 9v4M12 17h.01" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

const nexoStyles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Inter:wght@400;500;600;700&display=swap');

.nexo-landing { font-family: 'Inter', sans-serif; }

.nexo-landing .glow { position: fixed; border-radius: 50%; filter: blur(110px); z-index: 0; pointer-events: none; }
.nexo-landing .glow-1 { width: 640px; height: 640px; top: -220px; left: -160px; background: radial-gradient(circle, rgba(124,92,255,0.35), transparent 70%); }
.nexo-landing .glow-2 { width: 560px; height: 560px; bottom: -260px; right: -140px; background: radial-gradient(circle, rgba(91,61,240,0.32), transparent 70%); }

.nexo-landing .btn-primary { display:inline-flex; align-items:center; gap:8px; color:#fff; background:linear-gradient(135deg,#7c5cff,#5b3df0); box-shadow:0 8px 24px -8px rgba(124,92,255,0.6); transition: transform .3s cubic-bezier(.16,.84,.32,1), box-shadow .3s; }
.nexo-landing .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 32px -10px rgba(124,92,255,0.75); }
.nexo-landing .btn-ghost { display:inline-flex; align-items:center; gap:8px; border:1px solid rgba(168,150,255,0.14); background: rgba(255,255,255,0.02); transition: border-color .2s, background .2s; }
.nexo-landing .btn-ghost:hover { border-color:#a996ff; background: rgba(124,92,255,0.08); }

.nexo-landing .anim-h1, .nexo-landing .anim-lead, .nexo-landing .anim-ctas, .nexo-landing .anim-strip, .nexo-landing .eyebrow {
  opacity: 0; animation: nexo-rise .9s cubic-bezier(.16,.84,.32,1) forwards;
}
.nexo-landing .eyebrow { animation-delay: .1s; }
.nexo-landing .anim-h1 { animation-delay: .22s; }
.nexo-landing .anim-lead { animation-delay: .34s; }
.nexo-landing .anim-ctas { animation-delay: .46s; }
.nexo-landing .anim-strip { animation-delay: .58s; }
@keyframes nexo-rise { from { opacity:0; transform: translateY(22px); } to { opacity:1; transform: translateY(0); } }

.nexo-landing .planet { position:absolute; top:50%; left:50%; width:46px; height:46px; margin:-23px 0 0 -23px; border-radius:50%; background: radial-gradient(circle at 32% 30%, #a996ff, #5b3df0 70%); box-shadow: 0 0 40px rgba(124,92,255,0.55); }
.nexo-landing .ring { position:absolute; top:50%; left:50%; border:1.5px solid rgba(169,150,255,0.45); border-radius:50%; transform-style: preserve-3d; }
.nexo-landing .ring-a { width:150px; height:150px; margin:-75px 0 0 -75px; transform: rotateX(72deg) rotateZ(0deg); animation: nexo-spin 14s linear infinite; }
.nexo-landing .ring-b { width:110px; height:110px; margin:-55px 0 0 -55px; transform: rotateX(72deg) rotateZ(60deg); border-color: rgba(124,92,255,0.3); animation: nexo-spinb 9s linear infinite; }
.nexo-landing .ring-a::after, .nexo-landing .ring-b::after { content:''; position:absolute; width:8px; height:8px; border-radius:50%; background:#a996ff; box-shadow: 0 0 12px 2px rgba(169,150,255,0.9); top:-4px; left:50%; margin-left:-4px; }
@keyframes nexo-spin { to { transform: rotateX(72deg) rotateZ(360deg); } }
@keyframes nexo-spinb { to { transform: rotateX(72deg) rotateZ(-300deg); } }

.nexo-landing .chat-card {
  background: linear-gradient(180deg, rgba(24,17,42,0.9), rgba(13,9,24,0.92));
  box-shadow: 0 40px 80px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.02) inset;
  transform: rotateY(var(--ry, -10deg)) rotateX(var(--rx, 6deg));
  transform-style: preserve-3d;
  transition: transform .15s ease-out;
  opacity: 0;
  animation: nexo-rise2 1s cubic-bezier(.16,.84,.32,1) .5s forwards, nexo-float 7s ease-in-out 1.5s infinite;
}
@keyframes nexo-rise2 { from { opacity:0; transform: rotateY(-24deg) rotateX(10deg) translateY(30px); } to { opacity:1; } }
@keyframes nexo-float { 0%,100% { transform: rotateY(var(--ry,-10deg)) rotateX(var(--rx,6deg)) translateY(0px); } 50% { transform: rotateY(var(--ry,-10deg)) rotateX(var(--rx,6deg)) translateY(-14px); } }

.nexo-landing .voice-bubble { box-shadow: 0 10px 24px -12px rgba(91,61,240,0.6); }
.nexo-landing .voice-play { transition: background .2s; }
.nexo-landing .voice-play:hover { background: rgba(255,255,255,0.25); }
.nexo-landing .voice-bar { width:2.5px; flex:none; background: rgba(255,255,255,0.85); border-radius:2px; align-self:center; transform-origin:center; animation: nexo-wave 1.3s ease-in-out infinite; }
@keyframes nexo-wave { 0%,100% { transform: scaleY(0.55); } 50% { transform: scaleY(1); } }

.nexo-landing .float-card {
  position:absolute; padding:14px 18px; border-radius:14px;
  background: rgba(20,14,34,0.75); border:1px solid rgba(168,150,255,0.14); backdrop-filter: blur(16px);
  display:flex; align-items:center; gap:12px; box-shadow: 0 20px 40px -18px rgba(0,0,0,0.6);
  transform: translateZ(60px); opacity:0;
}
.nexo-landing .fc-1 { top:8%; left:-8%; animation: nexo-rise .9s cubic-bezier(.16,.84,.32,1) .7s forwards, nexo-floaty 6s ease-in-out 1.6s infinite; }
.nexo-landing .fc-2 { bottom:10%; right:-10%; animation: nexo-rise .9s cubic-bezier(.16,.84,.32,1) .82s forwards, nexo-floaty 6.5s ease-in-out 1.8s infinite reverse; }
@keyframes nexo-floaty { 0%,100% { transform: translateZ(60px) translateY(0); } 50% { transform: translateZ(60px) translateY(-10px); } }
@media (max-width: 640px) { .nexo-landing .fc-1, .nexo-landing .fc-2 { display:none; } }

.nexo-landing .tilt-card { background: linear-gradient(160deg, rgba(255,255,255,0.035), rgba(255,255,255,0.008)); transition: transform .25s cubic-bezier(.16,.84,.32,1), border-color .3s, box-shadow .3s; }
.nexo-landing .tilt-card:hover { border-color: rgba(169,150,255,0.4); box-shadow: 0 30px 60px -30px rgba(91,61,240,0.55); }
.nexo-landing .tilt-card::before {
  content:''; position:absolute; inset:0;
  background: radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(169,150,255,0.16), transparent 60%);
  opacity:0; transition: opacity .3s; pointer-events:none;
}
.nexo-landing .tilt-card:hover::before { opacity:1; }

.nexo-landing .steps-line path { stroke:#a996ff; stroke-width:2; fill:none; stroke-dasharray:1000; stroke-dashoffset:1000; transition: stroke-dashoffset 1.4s cubic-bezier(.16,.84,.32,1); }
.nexo-landing .steps-line.in-view path { stroke-dashoffset:0; }

.nexo-landing .reveal { opacity:0; transform: translateY(30px); transition: opacity .8s cubic-bezier(.16,.84,.32,1), transform .8s cubic-bezier(.16,.84,.32,1); }
.nexo-landing .reveal.in-view { opacity:1; transform: translateY(0); }

.nexo-landing summary::-webkit-details-marker { display:none; }
.nexo-landing details[open] .plus { background:#7c5cff; border-color:#7c5cff; }
.nexo-landing details[open] .plus svg { transform: rotate(45deg); }
.nexo-landing .plus svg { transition: transform .3s cubic-bezier(.16,.84,.32,1); }

@media (prefers-reduced-motion: reduce) {
  .nexo-landing * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}
`;