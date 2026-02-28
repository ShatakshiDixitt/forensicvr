import { useLibrary } from '../context/LibraryContext'
import ObjectPreview3D from './ObjectPreview3D'

export default function ObjectLibrary() {
  const { objects, loading, deleteObject, sendObjectToVR } = useLibrary()

  if (loading) return (
    <div style={{ fontFamily: 'DM Mono, monospace', color: '#2a2a3a', fontSize: '12px', letterSpacing: '2px' }}>
      LOADING EVIDENCE DATABASE...
    </div>
  )

  if (objects.length === 0) return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
      `}</style>
      <div style={{
        textAlign: 'center', marginTop: '80px', color: '#1e1e2e',
        fontFamily: 'Syne, sans-serif'
      }}>
        <div style={{
          width: '64px', height: '64px', border: '1px solid #1e1e2e',
          borderRadius: '50%', margin: '0 auto 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', color: '#2a2a3a'
        }}>◈</div>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#2a2a3a', marginBottom: '8px' }}>
          NO EVIDENCE CATALOGUED
        </p>
        <p style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', color: '#1a1a2a', letterSpacing: '1px' }}>
          Use the Scanner to add your first object
        </p>
      </div>
    </div>
  )

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        .lib-header {
          display: flex;
          align-items: baseline;
          gap: 16px;
          margin-bottom: 32px;
        }
        .lib-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
        }
        .lib-count {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #e63946;
          letter-spacing: 2px;
          text-transform: uppercase;
          background: #e6394611;
          border: 1px solid #e6394622;
          padding: 3px 10px;
          border-radius: 20px;
        }
        .obj-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .obj-card {
          background: #0c0c18;
          border: 1px solid #13131f;
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.2s ease, transform 0.2s ease;
          position: relative;
        }
        .obj-card:hover {
          border-color: #e6394633;
          transform: translateY(-2px);
        }
        .obj-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e6394622, transparent);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .obj-card:hover::before { opacity: 1; }
        .card-body { padding: 16px; }
        .card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .card-shape {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #e63946;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .card-name {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
          letter-spacing: -0.2px;
        }
        .card-desc {
          font-family: 'DM Mono', monospace;
          color: #2a2a3a;
          font-size: 11px;
          line-height: 1.6;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-dims {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #1e1e2e;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }
        .card-actions { display: flex; gap: 8px; }
        .btn-vr {
          flex: 1;
          padding: 9px;
          background: #e63946;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: background 0.15s ease;
        }
        .btn-vr:hover { background: #ff4d5a; }
        .btn-delete {
          padding: 9px 13px;
          background: transparent;
          color: #2a2a3a;
          border: 1px solid #1a1a2a;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          transition: all 0.15s ease;
        }
        .btn-delete:hover { border-color: #e63946; color: #e63946; }
        .color-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
      `}</style>

      <div className="lib-header">
        <h2 className="lib-title">Evidence Library</h2>
        <span className="lib-count">{objects.length} Objects</span>
      </div>

      <div className="obj-grid">
        {objects.map(obj => (
          <div key={obj.id} className="obj-card">
            <ObjectPreview3D object={obj} />
            <div className="card-body">
              <div className="card-meta">
                <span className="card-shape">{obj.shape || 'UNKNOWN'}</span>
                {obj.color && <div className="color-dot" style={{ background: obj.color }} />}
              </div>
              <div className="card-name">{obj.name}</div>
              <div className="card-desc">{obj.description}</div>
              {obj.dimensions && (
                <div className="card-dims">
                  {obj.dimensions.width}m × {obj.dimensions.height}m × {obj.dimensions.depth}m
                </div>
              )}
              <div className="card-actions">
                <button className="btn-vr" onClick={() => sendObjectToVR(obj)}>
                  Send to VR
                </button>
                <button className="btn-delete" onClick={() => deleteObject(obj.id)}>
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}