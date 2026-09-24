'use client';

import type { ReactNode } from 'react';

const H = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const APP_URL = 'https://chat-vert-nu-34.vercel.app/';
const DOWNLOAD_URL = 'https://chat-vert-nu-34.vercel.app/download';
const GITHUB_URL = 'https://github.com/m1tywaflow/chat';
const BARS = [35, 60, 45, 80, 55, 95, 65, 100, 70, 85, 50, 75, 40, 60, 30];
const BORDER = 'border-[rgba(168,150,255,0.14)]';

function Ico({ d, className = 'w-5 h-5' }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  );
}
const P = {
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  forward: 'M15 5l6 6-6 6M21 11H9a6 6 0 0 0-6 6',
  pin: 'M12 17v5M8 3h8l-1 7 3 3H6l3-3z',
  check: 'm5 12 5 5L20 7',
  palette: 'M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a3 3 0 0 0 3-3c0-6-4-11-8-11z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  download: 'M12 3v12m0 0-4-4m4 4 4-4M4 20h16',
  desktop: 'M3 4h18v12H3zM8 20h8M12 16v4',
  code: 'm8 7-5 5 5 5M16 7l5 5-5 5',
};

function Head({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="reveal max-w-[640px] mb-14">
      <span className="block text-[#a996ff] text-[0.86rem] font-semibold mb-3.5">{eyebrow}</span>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-bold" style={H}>{title}</h2>
      {text && <p className="mt-4 text-[#b8b0d6] text-[1.02rem] leading-relaxed max-w-[52ch]">{text}</p>}
    </div>
  );
}

function Bento({ span = '', icon, title, text, children }: { span?: string; icon: ReactNode; title: string; text: string; children: ReactNode }) {
  return (
    <div className={`tilt-card relative rounded-[20px] border ${BORDER} p-7 overflow-hidden min-h-[270px] flex flex-col ${span}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${BORDER} bg-[rgba(124,92,255,0.12)] text-[#a996ff] mb-5`}>{icon}</div>
      <h3 className="text-[1.12rem] font-semibold mb-2" style={H}>{title}</h3>
      <p className="text-[0.9rem] text-[#b8b0d6] leading-relaxed max-w-[46ch]">{text}</p>
      <div className="mt-auto pt-6">{children}</div>
    </div>
  );
}

/* ───────── 1. DETAILS (bento) ───────── */
export function DetailsSection() {
  return (
    <section id="details" className="px-[min(6vw,90px)] py-[120px]">
      <div className="max-w-[1200px] mx-auto">
        <Head
          eyebrow="Details that matter"
          title="Small things, done properly."
          text="The stuff you use fifty times a day should feel effortless. We sweated every one of them."
        />
        <div className="reveal grid grid-cols-1 md:grid-cols-6 gap-5" style={{ perspective: '1200px' }}>
          <Bento span="md:col-span-4" icon={<Ico d={P.mic} />} title="Voice notes with a real waveform" text="Hold to record, swipe to cancel, replay at your own speed.">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 w-full max-w-[340px] rounded-2xl rounded-br-md pl-2 pr-3.5 py-2 bg-[linear-gradient(135deg,#7c5cff,#5b3df0)]">
                <div className="w-8 h-8 rounded-full flex-none flex items-center justify-center bg-white/15">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="#fff"><path d="M6 4.5v15l13-7.5z" /></svg>
                </div>
                <div className="flex items-end gap-[3px] h-5 flex-1">
                  {BARS.map((h, i) => (
                    <span key={i} className="voice-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.06}s` }} />
                  ))}
                </div>
                <span className="text-[0.72rem] text-white/85 flex-none">0:12</span>
              </div>
              <div className="flex gap-1.5">
                {['1×', '1.5×', '2×'].map((s) => (
                  <span key={s} className={`rounded-full border px-3 py-1 text-[0.78rem] ${s === '1.5×' ? 'border-[#a996ff] text-white bg-[rgba(124,92,255,0.25)]' : `${BORDER} text-[#7d7599]`}`}>{s}</span>
                ))}
              </div>
            </div>
          </Bento>

          <Bento span="md:col-span-2" icon={<Ico d={P.pin} />} title="React, edit, pin" text="Reactions, edits, and pinned messages — all inline.">
            <div className="flex flex-wrap items-center gap-2">
              {['❤️ 4', '🔥 2', '👍 7'].map((r) => (
                <span key={r} className={`rounded-full border ${BORDER} bg-white/5 px-3 py-1 text-[0.8rem]`}>{r}</span>
              ))}
              <span className="inline-flex items-center gap-1.5 text-[0.76rem] text-[#a996ff]"><Ico d={P.pin} className="w-3.5 h-3.5" />Pinned</span>
            </div>
          </Bento>

          <Bento span="md:col-span-2" icon={<Ico d={P.forward} />} title="Forward anywhere" text="Send a message to any chat or channel in two taps.">
            <div className={`rounded-2xl rounded-bl-md border ${BORDER} bg-white/5 px-4 py-3`}>
              <div className="text-[0.72rem] text-[#a996ff] mb-1">Forwarded from mitywa</div>
              <div className="text-[0.84rem]">Meet at 7? 🎧</div>
            </div>
          </Bento>

          <Bento span="md:col-span-2" icon={<Ico d={P.eye} />} title="Presence & read receipts" text="See who's online and when your message was read.">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[0.82rem] text-[#b8b0d6]">
                <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]" />online
              </span>
              <span className="inline-flex items-center gap-1 text-[0.78rem] text-[#a996ff]">
                <Ico d={P.check} className="w-3.5 h-3.5" /><Ico d={P.check} className="w-3.5 h-3.5 -ml-2" />Read
              </span>
            </div>
          </Bento>

          <Bento span="md:col-span-2" icon={<Ico d={P.palette} />} title="Your look, your rules" text="Dark, light, or fully custom themes. Wallpapers per chat.">
            <div className="flex items-center gap-3">
              {[
                ['Dark', 'bg-[#0d0918]'],
                ['Light', 'bg-[#f2eeff]'],
                ['Custom', 'bg-[linear-gradient(135deg,#7c5cff,#f472b6)]'],
              ].map(([n, c]) => (
                <div key={n} className="flex flex-col items-center gap-1.5">
                  <span className={`w-9 h-9 rounded-full border border-[rgba(168,150,255,0.3)] ${c}`} />
                  <span className="text-[0.7rem] text-[#7d7599]">{n}</span>
                </div>
              ))}
            </div>
          </Bento>
        </div>
      </div>
    </section>
  );
}

/* ───────── 2. DESKTOP APP ───────── */
export function DesktopSection() {
  const perks = [
    ['Native notifications', 'Toasts pop up even when the app is in the tray — click to jump straight to the chat.'],
    ['Unread badge in the tray', 'Always know if something is waiting, without opening anything.'],
    ['Auto-updates', 'New versions arrive on their own. No installers to chase.'],
  ];
  return (
    <section id="desktop" className="px-[min(6vw,90px)] py-[120px]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center">
        <div className="reveal">
          <span className="block text-[#a996ff] text-[0.86rem] font-semibold mb-3.5">Desktop app</span>
          <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-bold" style={H}>Lives in your tray. Ready when you are.</h2>
          <p className="mt-4 text-[#b8b0d6] text-[1.02rem] leading-relaxed max-w-[46ch]">
            The Windows app keeps Nexo one click away and never lets you miss a message.
          </p>
          <div className="mt-8 flex flex-col gap-5">
            {perks.map(([t, d]) => (
              <div key={t} className="flex items-start gap-3.5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${BORDER} bg-[rgba(124,92,255,0.1)] flex-none mt-0.5 text-[#a996ff]`}>
                  <Ico d={P.check} className="w-[18px] h-[18px]" />
                </div>
                <div>
                  <div className="text-[0.94rem] font-semibold mb-0.5">{t}</div>
                  <div className="text-[0.86rem] text-[#7d7599] leading-relaxed">{d}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-3.5">
            <a href={DOWNLOAD_URL} className="btn-primary rounded-full px-6 py-3 text-[0.92rem] font-semibold">
              <Ico d={P.download} className="w-4 h-4" />Download for Windows
            </a>
            <a href={APP_URL} className="btn-ghost rounded-full px-6 py-3 text-[0.92rem] font-semibold">Use in browser</a>
          </div>
        </div>

        <div className="reveal relative">
          <div className={`showcase-frame rounded-[24px] border ${BORDER} overflow-hidden`}>
            <div className={`flex items-center gap-2 px-4 py-3 border-b ${BORDER} bg-white/[0.02]`}>
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" /><span className="w-2.5 h-2.5 rounded-full bg-white/15" /><span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="ml-3 text-[0.72rem] tracking-wide text-[#7d7599]">NEXO</span>
            </div>
            <div className="grid grid-cols-[110px_1fr] min-h-[300px]">
              <div className={`border-r ${BORDER} p-3 flex flex-col gap-2.5`}>
                {[true, false, false, false].map((active, i) => (
                  <div key={i} className={`flex items-center gap-2 rounded-lg p-2 ${active ? 'bg-[rgba(124,92,255,0.18)] border border-[rgba(169,150,255,0.35)]' : ''}`}>
                    <span className="w-6 h-6 rounded-full bg-white/10 flex-none" />
                    <span className="h-1.5 flex-1 rounded bg-white/10" />
                  </div>
                ))}
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="h-8 w-[62%] rounded-2xl rounded-bl-md bg-white/5" />
                <div className="h-8 w-[48%] rounded-2xl rounded-br-md self-end bg-[linear-gradient(135deg,#7c5cff,#5b3df0)]" />
                <div className="h-8 w-[70%] rounded-2xl rounded-bl-md bg-white/5" />
              </div>
            </div>
          </div>
          <div className={`toast-pop absolute -bottom-5 right-3 md:-right-4 flex items-center gap-3 rounded-2xl border ${BORDER} bg-[rgba(20,14,34,0.9)] backdrop-blur-xl px-4 py-3 shadow-[0_20px_40px_-18px_rgba(0,0,0,0.7)]`}>
            <span className="w-8 h-8 rounded-full bg-[linear-gradient(135deg,#7c5cff,#5b3df0)] flex-none" />
            <div>
              <div className="text-[0.8rem] font-semibold">mitywa</div>
              <div className="text-[0.72rem] text-[#7d7599]">Are you there? 👀</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── 3. STACK / ENGINEERING ───────── */
const STACK: [string, string][] = [
  ['Next.js + TypeScript', 'App & routing'],
  ['Firebase / Firestore', 'Realtime data & auth'],
  ['LiveKit', 'Voice & video calls'],
  ['Cloudinary', 'Media delivery'],
  ['Zustand', 'Client state'],
  ['Tailwind CSS', 'Design system'],
  ['Electron', 'Windows desktop app'],
  ['Vercel', 'Hosting'],
];
const PRINCIPLES: [string, string][] = [
  ['Optimistic UI', 'Your message shows up the instant you hit send.'],
  ['Live listeners', 'Data is pushed to you — no polling, no refresh.'],
  ['Rules on the server', 'Firestore security rules guard every read and write.'],
];

export function StackSection() {
  return (
    <section id="stack" className="relative px-[min(6vw,90px)] py-[120px]">
      <div className="max-w-[1200px] mx-auto">
        <Head
          eyebrow="Under the hood"
          title="Engineered for real-time."
          text="A modern stack, chosen so that speed is a feature and not an afterthought."
        />
        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-4">
          {STACK.map(([name, role]) => (
            <div key={name} className={`stack-chip rounded-[16px] border ${BORDER} p-5`}>
              <div className="text-[0.95rem] font-semibold mb-1" style={H}>{name}</div>
              <div className="text-[0.8rem] text-[#7d7599]">{role}</div>
            </div>
          ))}
        </div>

        <div className="reveal mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRINCIPLES.map(([t, d]) => (
            <div key={t} className="flex items-start gap-3.5">
              <div className="w-5 h-5 text-[#a996ff] flex-none mt-0.5"><Ico d={P.check} className="w-5 h-5" /></div>
              <div>
                <h4 className="text-[1rem] font-semibold mb-1.5" style={H}>{t}</h4>
                <p className="text-[0.88rem] text-[#b8b0d6] leading-relaxed max-w-[32ch]">{d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-12">
          <a href={GITHUB_URL} className="btn-ghost rounded-full px-6 py-3 text-[0.92rem] font-semibold">
            <Ico d={P.code} className="w-4 h-4" />View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────── 4. ROADMAP ───────── */
type Status = 'In progress' | 'Planned' | 'Exploring';
// Edit freely: this list drives the whole section.
const ROADMAP: { status: Status; title: string; text: string }[] = [
  { status: 'In progress', title: 'Faster everywhere', text: 'Virtualized lists and optimized images, so huge chats and channels stay buttery smooth.' },
  { status: 'In progress', title: 'Calls, upgraded', text: 'Sharper video, steadier connections, and polish on every call screen.' },
  { status: 'Planned', title: 'Signed desktop installer', text: 'One-click Windows install with no scary security warnings.' },
  { status: 'Planned', title: 'Screen sharing & group calls', text: 'Share your screen and talk with the whole group at once.' },
  { status: 'Planned', title: 'Smarter notifications', text: 'Per-chat mute rules and quiet hours, so you hear only what matters.' },
  { status: 'Exploring', title: 'Mobile apps', text: 'Nexo in your pocket, built natively for your phone.' },
];

function StatusPill({ status }: { status: Status }) {
  const cls =
    status === 'In progress'
      ? 'border-[#a996ff] bg-[rgba(124,92,255,0.22)] text-white'
      : status === 'Planned'
        ? `${BORDER} text-[#b8b0d6]`
        : 'border-dashed border-[rgba(168,150,255,0.3)] text-[#7d7599]';
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.74rem] font-semibold ${cls}`}>
      {status === 'In progress' && <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-[#a996ff]" />}
      {status}
    </span>
  );
}

export function RoadmapSection() {
  return (
    <section id="roadmap" className="px-[min(6vw,90px)] py-[120px]">
      <div className="max-w-[1200px] mx-auto">
        <Head
          eyebrow="What's next"
          title="We're just getting started."
          text="Nexo ships constantly. Here's a look at what we're building next."
        />
        <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ROADMAP.map((item) => (
            <div key={item.title} className={`stack-chip rounded-[20px] border ${BORDER} p-6 flex flex-col gap-4 min-h-[190px]`}>
              <StatusPill status={item.status} />
              <div>
                <h3 className="text-[1.08rem] font-semibold mb-2" style={H}>{item.title}</h3>
                <p className="text-[0.88rem] text-[#b8b0d6] leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="reveal mt-8 text-[0.82rem] text-[#7d7599]">A roadmap is a direction, not a promise — priorities shift with what you tell us you need.</p>
      </div>
    </section>
  );
}

/* ───────── extra CSS (render next to nexoStyles) ───────── */
export const nexoExtraStyles = `
.nexo-landing .toast-pop { animation: nexo-toast 6s cubic-bezier(.16,.84,.32,1) infinite; }
@keyframes nexo-toast {
  0%, 8% { opacity: 0; transform: translateX(24px); }
  16%, 78% { opacity: 1; transform: translateX(0); }
  90%, 100% { opacity: 0; transform: translateX(24px); }
}
.nexo-landing .pulse-dot { animation: nexo-pulse 1.8s ease-in-out infinite; }
@keyframes nexo-pulse { 0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(169,150,255,0.6); } 50% { opacity: .6; box-shadow: 0 0 0 6px rgba(169,150,255,0); } }
.nexo-landing .stack-chip { background: linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); transition: transform .3s cubic-bezier(.16,.84,.32,1), border-color .3s, box-shadow .3s; }
.nexo-landing .stack-chip:hover { transform: translateY(-3px); border-color: rgba(169,150,255,0.4); box-shadow: 0 24px 50px -26px rgba(91,61,240,0.55); }
`;
