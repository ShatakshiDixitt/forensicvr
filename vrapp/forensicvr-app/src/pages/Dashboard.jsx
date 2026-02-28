import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { LibraryProvider } from '../context/LibraryContext'
import ObjectLibrary from '../components/ObjectLibrary'
import Scanner from '../components/Scanner'

const NAV_ITEMS = [
  { id: 'library', label: 'Evidence Library', icon: '▣', desc: 'Browse 3D objects' },
  { id: 'scanner', label: 'Scanner', icon: '◈', desc: 'Scan new evidence' },
  { id: 'about', label: 'About', icon: '◉', desc: 'How it works' },
]

function AboutPage() {
  const [activeStep, setActiveStep] = useState(null)

  const steps = [
    {
      num: '01',
      title: 'Scan Evidence',
      desc: 'Use your webcam or upload an image of any real-world object. The scanner captures a high-quality frame ready for AI analysis.',
      detail: 'Supports JPEG, PNG, and live webcam capture. Works best with good lighting and a clear background.',
      color: '#e63946'
    },
    {
      num: '02',
      title: 'Gemini AI Analysis',
      desc: 'Google\'s Gemini 2.5 Flash analyzes the image and extracts forensic properties: shape, material, dimensions, color, texture, and relevance.',
      detail: 'Returns structured 3D data including real-world dimension estimates in meters, texture classification, and weight estimation.',
      color: '#e07b39'
    },
    {
      num: '03',
      title: '3D Preview',
      desc: 'Every object gets a real-time spinning 3D preview in your Evidence Library, rendered using Three.js with material properties applied.',
      detail: 'Materials like glass become transparent, metals get metallic shading, and colors are applied directly from Gemini\'s color analysis.',
      color: '#39a0e0'
    },
    {
      num: '04',
      title: 'Deploy to VR',
      desc: 'Hit "Send to VR" to transmit the object over WebSocket to your teammate\'s Unity scene, where it spawns with correct scale and color.',
      detail: 'Uses a local WebSocket server on port 9090. The Unity receiver script handles spawning, material assignment, and Rigidbody physics.',
      color: '#2ecc71'
    },
  ]

  const team = [
    { role: 'Object Library + Scanner + VR Bridge', name: 'Your Part', tag: 'React + Electron + Gemini' },
    { role: 'Gaussian Splat Environment', name: 'Teammate 1', tag: 'Unity + VR' },
    { role: 'VR Interaction System', name: 'Teammate 2', tag: 'Unity XR Toolkit' },
  ]

  const stack = [
    ['Electron', 'Desktop wrapper'],
    ['React + Vite', 'UI framework'],
    ['Gemini 2.5 Flash', 'AI analysis'],
    ['Three.js', '3D previews'],
    ['Auth0', 'Authentication'],
    ['WebSocket', 'VR comms'],
    ['Express', 'Local backend'],
    ['Unity', 'VR environment'],
  ]

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        .about-hero {
          margin-bottom: 64px;
        }
        .about-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #e63946;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .about-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 72px;
          color: #fff;
          line-height: 0.9;
          letter-spacing: 2px;
          margin-bottom: 16px;
        }
        .about-title span { color: #e63946; }
        .about-sub {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #333;
          line-height: 1.7;
          max-width: 500px;
          letter-spacing: 0.5px;
        }
        .section-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #e63946;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .section-label::after {
          content: '';
          flex: 1;
          max-width: 60px;
          height: 1px;
          background: #e6394633;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 64px;
        }
        .step-card {
          background: #0c0c18;
          border: 1px solid #13131f;
          border-radius: 10px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .step-card:hover, .step-card.active {
          border-color: var(--step-color, #e63946);
          transform: translateY(-2px);
        }
        .step-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--step-color, #e63946);
          transform: scaleX(0);
          transition: transform 0.3s ease;
          transform-origin: left;
        }
        .step-card:hover::before, .step-card.active::before { transform: scaleX(1); }
        .step-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px;
          color: var(--step-color, #e63946);
          opacity: 0.3;
          line-height: 1;
          margin-bottom: 8px;
        }
        .step-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
        }
        .step-desc {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #333;
          line-height: 1.7;
          margin-bottom: 12px;
        }
        .step-detail {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: var(--step-color, #e63946);
          line-height: 1.6;
          padding: 10px 12px;
          background: #ffffff05;
          border-radius: 4px;
          border-left: 2px solid var(--step-color, #e63946);
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.3s ease, opacity 0.3s ease, margin-top 0.3s ease;
        }
        .step-card.active .step-detail {
          max-height: 100px;
          opacity: 1;
          margin-top: 4px;
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 64px;
        }
        .team-card {
          background: #0c0c18;
          border: 1px solid #13131f;
          border-radius: 10px;
          padding: 20px;
          transition: border-color 0.2s ease;
        }
        .team-card:hover { border-color: #e6394633; }
        .team-role {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #333;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .team-name {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
        }
        .team-tag {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #e63946;
          background: #e6394611;
          border: 1px solid #e6394622;
          padding: 3px 10px;
          border-radius: 20px;
          display: inline-block;
        }
        .stack-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .stack-item {
          background: #0c0c18;
          border: 1px solid #13131f;
          border-radius: 8px;
          padding: 14px;
          transition: all 0.2s ease;
        }
        .stack-item:hover {
          border-color: #e6394633;
          transform: scale(1.03);
        }
        .stack-name {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        .stack-desc {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #2a2a3a;
        }
      `}</style>

      <div className="about-hero">
        <div className="about-eyebrow">ForensicVR / Documentation</div>
        <div className="about-title">HOW IT<br /><span>WORKS</span></div>
        <div className="about-sub">
          A full-stack forensic evidence platform. Scan real objects, AI-generate 3D properties,
          preview them live, and deploy them into a VR crime scene reconstruction environment.
        </div>
      </div>

      {/* Steps */}
      <div className="section-label">Workflow</div>
      <div className="steps-grid">
        {steps.map(s => (
          <div
            key={s.num}
            className={`step-card ${activeStep === s.num ? 'active' : ''}`}
            style={{ '--step-color': s.color }}
            onClick={() => setActiveStep(activeStep === s.num ? null : s.num)}
          >
            <div className="step-num">{s.num}</div>
            <div className="step-title">{s.title}</div>
            <div className="step-desc">{s.desc}</div>
            <div className="step-detail">{s.detail}</div>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="section-label">Team</div>
      <div className="team-grid">
        {team.map(t => (
          <div key={t.name} className="team-card">
            <div className="team-role">{t.role}</div>
            <div className="team-name">{t.name}</div>
            <div className="team-tag">{t.tag}</div>
          </div>
        ))}
      </div>

      {/* Stack */}
      <div className="section-label">Tech Stack</div>
      <div className="stack-grid">
        {stack.map(([n, d]) => (
          <div key={n} className="stack-item">
            <div className="stack-name">{n}</div>
            <div className="stack-desc">{d}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth0()
  const [activeTab, setActiveTab] = useState('library')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <LibraryProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-layout {
          display: flex;
          height: 100vh;
          background: #06060f;
          font-family: 'Syne', sans-serif;
        }

        .sidebar {
          width: 220px;
          background: #08080f;
          border-right: 1px solid #0f0f1e;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: relative;
        }
        .sidebar::after {
          content: '';
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 1px;
          background: linear-gradient(180deg, transparent 0%, #e6394622 30%, #e6394644 50%, #e6394622 70%, transparent 100%);
        }

        .logo-wrap {
          padding: 28px 20px 24px;
          border-bottom: 1px solid #0f0f1e;
        }
        .logo-badge {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          color: #e63946;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .logo-badge::before {
          content: '';
          width: 4px; height: 4px;
          background: #e63946;
          border-radius: 50%;
          animation: blink 1.5s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .logo-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          color: #fff;
          letter-spacing: 2px;
          line-height: 1;
        }

        .nav-wrap { padding: 20px 12px; flex: 1; }
        .nav-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          color: #1a1a2a;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 0 8px;
          margin-bottom: 8px;
        }
        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          margin-bottom: 2px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
          position: relative;
          overflow: hidden;
          background: transparent;
        }
        .nav-item.active {
          background: #e6394612;
          color: #fff;
        }
        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0; top: 25%; bottom: 25%;
          width: 2px;
          background: #e63946;
          border-radius: 0 2px 2px 0;
        }
        .nav-item.inactive { color: #222; }
        .nav-item.inactive:hover { background: #0f0f1e; color: #444; }
        .nav-icon {
          font-size: 13px;
          width: 16px;
          text-align: center;
          flex-shrink: 0;
        }
        .nav-item.active .nav-icon { color: #e63946; }
        .nav-text-wrap { flex: 1; }
        .nav-label {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          display: block;
        }
        .nav-desc {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #1a1a2a;
          display: block;
          margin-top: 1px;
          letter-spacing: 0.5px;
        }
        .nav-item.active .nav-desc { color: #333; }

        .sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid #0f0f1e;
        }
        .user-chip {
          background: #0f0f1e;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 8px;
        }
        .user-label {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          color: #1a1a2a;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .user-email {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .logout-btn {
          width: 100%;
          padding: 9px;
          background: transparent;
          border: 1px solid #13131f;
          border-radius: 6px;
          color: #1a1a2a;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.15s ease;
          text-transform: uppercase;
        }
        .logout-btn:hover { border-color: #e63946; color: #e63946; }

        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .topbar {
          height: 52px;
          border-bottom: 1px solid #0f0f1e;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          flex-shrink: 0;
          background: #06060f;
        }
        .topbar-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .topbar-dot { width: 5px; height: 5px; background: #e63946; border-radius: 50%; animation: blink 1.5s ease-in-out infinite; }
        .topbar-status {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #1a1a2a;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .topbar-clock {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #1a1a2a;
          letter-spacing: 2px;
        }

        .content-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 40px;
          scrollbar-width: thin;
          scrollbar-color: #1a1a2a transparent;
        }
        .content-scroll::-webkit-scrollbar { width: 4px; }
        .content-scroll::-webkit-scrollbar-track { background: transparent; }
        .content-scroll::-webkit-scrollbar-thumb { background: #1a1a2a; border-radius: 4px; }
      `}</style>

      <div className="dash-layout">
        <div className="sidebar">
          <div className="logo-wrap">
            <div className="logo-badge">System Online</div>
            <div className="logo-name">ForensicVR</div>
          </div>

          <div className="nav-wrap">
            <div className="nav-section-label">Navigation</div>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${activeTab === item.id ? 'active' : 'inactive'}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text-wrap">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-desc">{item.desc}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="user-label">Investigator</div>
              <div className="user-email">{user?.email}</div>
            </div>
            <button className="logout-btn" onClick={() => logout({ returnTo: 'http://localhost:5174' })}>
              Sign Out
            </button>
          </div>
        </div>

        <div className="main-area">
          <div className="topbar">
            <div className="topbar-left">
              <div className="topbar-dot" />
              <div className="topbar-status">
                {activeTab === 'library' ? 'Evidence Library' : activeTab === 'scanner' ? 'Evidence Scanner' : 'Documentation'}
              </div>
            </div>
            <div className="topbar-clock">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
          </div>

          <div className="content-scroll">
            {activeTab === 'library' && <ObjectLibrary />}
            {activeTab === 'scanner' && <Scanner />}
            {activeTab === 'about' && <AboutPage />}
          </div>
        </div>
      </div>
    </LibraryProvider>
  )
}