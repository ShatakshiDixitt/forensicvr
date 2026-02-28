import { useAuth0 } from '@auth0/auth0-react'
import { useState, useEffect, useRef } from 'react'

export default function Login() {
  const { loginWithRedirect } = useAuth0()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    const handler = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setGlitching(true)
      setTimeout(() => setGlitching(false), 150)
    }, 4000)

    return () => {
      window.removeEventListener('mousemove', handler)
      clearInterval(glitchInterval)
    }
  }, [])

  const features = [
    { icon: '[ ]', name: 'Object Scanner', desc: 'Webcam + AI analysis' },
    { icon: '{ }', name: 'Evidence Library', desc: '3D spinning previews' },
    { icon: '< >', name: 'VR Deployment', desc: 'Send to Quest 2 live' },
    { icon: '/ /', name: 'Gemini AI', desc: 'Auto 3D reconstruction' },
  ]

  return (
    <div ref={containerRef} style={{
      height: '100vh', width: '100vw',
      background: '#06060f',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'none',
      display: 'flex',
      alignItems: 'stretch',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Syne:wght@400;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cursor-dot {
          position: fixed;
          width: 10px; height: 10px;
          background: #e63946;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s, background 0.2s;
          mix-blend-mode: screen;
        }
        .cursor-dot.big {
          width: 20px; height: 20px;
          background: #ff6b6b;
        }
        .cursor-ring {
          position: fixed;
          width: 36px; height: 36px;
          border: 1px solid #e6394666;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          transition: left 0.1s ease, top 0.1s ease, width 0.2s, height 0.2s;
        }
        .cursor-ring.big {
          width: 56px; height: 56px;
          border-color: #e6394699;
        }

        .noise {
          position: fixed; inset: 0;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 200;
        }

        .scan-lines {
          position: fixed; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 3px, #ffffff02 3px, #ffffff02 4px);
          pointer-events: none;
          z-index: 201;
          animation: scanMove 8s linear infinite;
        }
        @keyframes scanMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 100px; }
        }

        .glow-mouse {
          position: fixed;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, #e6394612 0%, transparent 65%);
          pointer-events: none;
          z-index: 1;
          transform: translate(-50%, -50%);
          transition: left 0.4s ease, top 0.4s ease;
        }

        /* LEFT PANEL */
        .left {
          width: 52%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 48px 36px;
          position: relative;
          overflow: hidden;
          border-right: 1px solid #0f0f20;
        }

        .corner-tl {
          position: absolute;
          top: 20px; left: 20px;
          width: 20px; height: 20px;
          border-top: 1px solid #e6394644;
          border-left: 1px solid #e6394644;
        }
        .corner-br {
          position: absolute;
          bottom: 20px; right: 20px;
          width: 20px; height: 20px;
          border-bottom: 1px solid #e6394644;
          border-right: 1px solid #e6394644;
        }

        .eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #e63946;
          letter-spacing: 4px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .eyebrow::before {
          content: '';
          width: 24px; height: 1px;
          background: #e63946;
        }

        .hero-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(72px, 10vw, 148px);
          line-height: 0.88;
          letter-spacing: 3px;
          color: #fff;
          position: relative;
        }
        .hero-text .red { color: #e63946; }

        .glitch {
          position: relative;
        }
        .glitch.active::before {
          content: attr(data-text);
          position: absolute;
          left: 3px; top: 0;
          color: #e63946;
          clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
          animation: glitch1 0.15s steps(1) forwards;
        }
        .glitch.active::after {
          content: attr(data-text);
          position: absolute;
          left: -3px; top: 0;
          color: #00ffff44;
          clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
          animation: glitch2 0.15s steps(1) forwards;
        }
        @keyframes glitch1 { 0%{transform:translateX(2px)} 50%{transform:translateX(-2px)} 100%{transform:translateX(0)} }
        @keyframes glitch2 { 0%{transform:translateX(-2px)} 50%{transform:translateX(2px)} 100%{transform:translateX(0)} }

        .stats {
          display: flex;
          gap: 28px;
        }
        .stat {
          border-left: 2px solid #e63946;
          padding-left: 14px;
          transition: border-color 0.2s;
        }
        .stat:hover { border-color: #ff6b6b; }
        .stat-n {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 40px;
          color: #fff;
          line-height: 1;
        }
        .stat-l {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          color: #2a2a3a;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 3px;
        }

        /* RIGHT PANEL */
        .right {
          width: 48%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 52px;
          position: relative;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #e6394610;
          border: 1px solid #e6394630;
          padding: 7px 16px;
          border-radius: 100px;
          margin-bottom: 28px;
          width: fit-content;
        }
        .pill-dot {
          width: 5px; height: 5px;
          background: #e63946;
          border-radius: 50%;
          animation: blink 1.5s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .pill-text {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #e63946;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .right-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -1px;
          margin-bottom: 16px;
        }
        .right-sub {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #2a2a3a;
          line-height: 1.8;
          margin-bottom: 40px;
          max-width: 380px;
          letter-spacing: 0.3px;
        }

        .btn-wrap {
          position: relative;
          margin-bottom: 28px;
        }
        .enter-btn {
          width: 100%;
          padding: 18px;
          background: #e63946;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: none;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 4px;
          text-transform: uppercase;
          overflow: hidden;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 0 0 0 #e6394600;
        }
        .enter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 40px #e6394640, 0 0 0 1px #e6394622;
        }
        .enter-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, #ffffff25, transparent);
          transition: left 0.5s ease;
        }
        .enter-btn:hover::before { left: 100%; }

        .animated-border {
          position: absolute;
          inset: -1px;
          border-radius: 9px;
          background: linear-gradient(90deg, #e63946, #ff6b6b, #e63946);
          background-size: 200%;
          animation: borderMove 2s linear infinite;
          z-index: -1;
          opacity: 0.6;
        }
        @keyframes borderMove { 0%{background-position:0%} 100%{background-position:200%} }

        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        .div-line { flex: 1; height: 1px; background: #0f0f20; }
        .div-text {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          color: #1a1a2a;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .feat {
          background: #0a0a16;
          border: 1px solid #0f0f20;
          border-radius: 8px;
          padding: 14px 16px;
          cursor: none;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .feat::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, #e6394608, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .feat:hover {
          border-color: #e6394640;
          transform: translateY(-3px);
        }
        .feat:hover::after { opacity: 1; }
        .feat-icon {
          font-family: 'DM Mono', monospace;
          font-size: 16px;
          color: #e63946;
          margin-bottom: 8px;
          opacity: 0.7;
        }
        .feat-name {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 3px;
        }
        .feat-desc {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #222;
          letter-spacing: 0.5px;
        }

        .bottom-strip {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 36px;
          border-top: 1px solid #0a0a18;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          z-index: 50;
          background: #06060f;
        }
        .strip-text {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          color: #111128;
          letter-spacing: 3px;
          text-transform: uppercase;
        }
        .strip-dot { width: 3px; height: 3px; background: #e63946; border-radius: 50%; animation: blink 2s ease-in-out infinite; }

        /* Animated grid bg */
        .grid-bg {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(#e6394604 1px, transparent 1px),
            linear-gradient(90deg, #e6394604 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
          animation: gridDrift 20s linear infinite;
        }
        @keyframes gridDrift {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 60px 60px, 60px 60px; }
        }

        .fade-in {
          opacity: 0;
          transform: translateY(24px);
          animation: fadeUp 0.7s ease forwards;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Cursor */}
      <div className={`cursor-dot ${hovering ? 'big' : ''}`} style={{ left: mousePos.x, top: mousePos.y }} />
      <div className={`cursor-ring ${hovering ? 'big' : ''}`} style={{ left: mousePos.x, top: mousePos.y }} />

      {/* Background effects */}
      <div className="grid-bg" />
      <div className="noise" />
      <div className="scan-lines" />
      <div className="glow-mouse" style={{ left: mousePos.x, top: mousePos.y }} />

      {/* Ambient glow blobs */}
      <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, #e6394618 0%, transparent 70%)', top: '-100px', left: '-100px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, #e6394610 0%, transparent 70%)', bottom: '-80px', right: '30%', pointerEvents: 'none', zIndex: 0 }} />

      {/* LEFT */}
      <div className="left" style={{ zIndex: 10 }}>
        <div className="corner-tl" />
        <div className="corner-br" />

        <div className="eyebrow fade-in" style={{ animationDelay: '0.1s' }}>
          ForensicVR / System v1.0
        </div>

        <div className="hero-text fade-in" style={{ animationDelay: '0.2s' }}>
          <div className={`glitch ${glitching ? 'active' : ''}`} data-text="CRIME">CRIME</div>
          <div>SCENE</div>
          <div className="red">RECON</div>
          <div>STRUCTION</div>
        </div>

        <div className="stats fade-in" style={{ animationDelay: '0.4s' }}>
          {[['3D', 'Object Scanning'], ['AI', 'Gemini Powered'], ['VR', 'Quest 2 Ready']].map(([n, l]) => (
            <div key={n} className="stat">
              <div className="stat-n">{n}</div>
              <div className="stat-l">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="right" style={{ zIndex: 10 }}>
        <div className="pill fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="pill-dot" />
          <span className="pill-text">Authorized Access Only</span>
        </div>

        <div className="right-title fade-in" style={{ animationDelay: '0.4s' }}>
          Access the<br />Evidence<br />Platform
        </div>

        <div className="right-sub fade-in" style={{ animationDelay: '0.5s' }}>
          Scan real-world objects, generate AI-powered 3D models,
          and deploy them directly into your VR crime scene reconstruction environment.
        </div>

        <div className="btn-wrap fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="animated-border" />
          <button
            className="enter-btn"
            onClick={() => loginWithRedirect()}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            Enter System
          </button>
        </div>

        <div className="divider fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="div-line" />
          <div className="div-text">Platform Features</div>
          <div className="div-line" />
        </div>

        <div className="features fade-in" style={{ animationDelay: '0.8s' }}>
          {features.map(f => (
            <div key={f.name} className="feat"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-name">{f.name}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bottom-strip">
        <div className="strip-text">ForensicVR Platform — CUHackIt 2026</div>
        <div className="strip-dot" />
        <div className="strip-text">Powered by Gemini AI + Auth0</div>
      </div>
    </div>
  )
}