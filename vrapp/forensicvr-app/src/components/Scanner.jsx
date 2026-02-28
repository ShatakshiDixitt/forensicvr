import { useState, useRef } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useLibrary } from '../context/LibraryContext'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

export default function Scanner() {
  const { addObject } = useLibrary()
  const [image, setImage] = useState(null)
  const [imageURL, setImageURL] = useState(null)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [cameraOn, setCameraOn] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  async function startCamera() {
    try {
      setCameraOn(true)
      await new Promise(r => setTimeout(r, 100))
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      await videoRef.current.play()
    } catch (err) {
      console.error('Camera error:', err)
      alert('Camera error: ' + err.message)
      setCameraOn(false)
    }
  }

  function capturePhoto() {
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const dataURL = canvas.toDataURL('image/jpeg', 0.8)
    setImageURL(dataURL)
    setImage(dataURL.split(',')[1])
    video.srcObject?.getTracks().forEach(t => t.stop())
    setCameraOn(false)
  }

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataURL = ev.target.result
      setImageURL(dataURL)
      setImage(dataURL.split(',')[1])
    }
    reader.readAsDataURL(file)
  }

  async function analyzeWithGemini() {
    if (!image) return
    setStatus('scanning')
    setResult(null)
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      const prompt = `You are a forensic 3D reconstruction system.
Analyze this image and return a JSON object with exactly these fields:
{
  "name": "short object name (2-4 words)",
  "description": "2-3 sentence forensic description of the object",
  "shape": "primary 3D shape: box | sphere | cylinder | cone | irregular",
  "estimatedSize": "small | medium | large",
  "color": "primary color as hex code e.g. #8B4513",
  "material": "material type e.g. metal, wood, plastic, fabric",
  "forensicRelevance": "brief note on why this might be forensically relevant",
  "dimensions": { "width": 0.1, "height": 0.2, "depth": 0.1 },
  "texture": "rough | smooth | glossy | matte | transparent",
  "weight": "light | medium | heavy",
  "position": { "x": 0, "y": 0, "z": 0 },
  "rotation": { "x": 0, "y": 0, "z": 0 }
}
For dimensions, estimate real-world size in meters. Return ONLY the JSON. No markdown, no explanation, no backticks.`

      const result = await model.generateContent([
        prompt,
        { inlineData: { mimeType: 'image/jpeg', data: image } }
      ])
      const text = result.response.text().trim()
      const parsed = JSON.parse(text)
      setResult(parsed)
      setStatus('done')
    } catch (err) {
      console.error('Gemini error:', err)
      setStatus('error')
    }
  }

  async function saveToLibrary() {
    if (!result) return
    await addObject({
      ...result,
      imageUrl: imageURL,
      createdAt: new Date().toISOString()
    })
    setImage(null)
    setImageURL(null)
    setResult(null)
    setStatus('idle')
  }

  return (
    <div style={{ maxWidth: '680px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        .scan-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 32px;
        }
        .scan-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
        }
        .scan-btn-primary {
          padding: 11px 22px;
          background: #0c0c18;
          color: #fff;
          border: 1px solid #1e1e2e;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3px;
          transition: all 0.15s ease;
        }
        .scan-btn-primary:hover {
          border-color: #e63946;
          color: #e63946;
        }
        .scan-btn-label {
          padding: 11px 22px;
          background: #0c0c18;
          color: #fff;
          border: 1px solid #1e1e2e;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3px;
          transition: all 0.15s ease;
          display: inline-block;
        }
        .scan-btn-label:hover {
          border-color: #e63946;
          color: #e63946;
        }
        .video-container {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #1e1e2e;
          margin-bottom: 16px;
          position: relative;
        }
        .video-label {
          position: absolute;
          top: 12px; left: 12px;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #e63946;
          letter-spacing: 3px;
          text-transform: uppercase;
          background: #080810cc;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #e6394622;
        }
        .capture-btn {
          margin-top: 12px;
          padding: 12px 32px;
          background: #e63946;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: background 0.15s ease;
        }
        .capture-btn:hover { background: #ff4d5a; }
        .preview-container {
          margin-bottom: 24px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #1e1e2e;
          position: relative;
        }
        .preview-label {
          position: absolute;
          top: 12px; left: 12px;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #888;
          letter-spacing: 3px;
          text-transform: uppercase;
          background: #080810cc;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .analyze-btn {
          width: 100%;
          padding: 14px;
          background: #e63946;
          color: white;
          border: none;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          transition: background 0.15s ease;
        }
        .analyze-btn:hover:not(:disabled) { background: #ff4d5a; }
        .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .result-card {
          background: #0c0c18;
          border: 1px solid #1e1e2e;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 24px;
        }
        .result-header {
          padding: 16px 20px;
          border-bottom: 1px solid #13131f;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .result-title {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #e63946;
          letter-spacing: 3px;
          text-transform: uppercase;
        }
        .result-name {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }
        .result-fields {
          padding: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .result-field {
          background: #080810;
          border-radius: 6px;
          padding: 12px 14px;
        }
        .result-field.full {
          grid-column: 1 / -1;
        }
        .field-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #2a2a3a;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .field-value {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          color: #888;
          font-weight: 600;
        }
        .save-btn {
          width: 100%;
          padding: 14px;
          background: #0d2b1a;
          color: #2ecc71;
          border: none;
          border-top: 1px solid #13131f;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          transition: background 0.15s ease;
        }
        .save-btn:hover { background: #0f3a20; }
        .error-msg {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #e63946;
          letter-spacing: 1px;
          padding: 14px 18px;
          background: #e6394611;
          border: 1px solid #e6394622;
          border-radius: 6px;
        }
        .scanning-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: #0c0c18;
          border: 1px solid #1e1e2e;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .scan-spinner {
          width: 16px; height: 16px;
          border: 2px solid #1e1e2e;
          border-top-color: #e63946;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .scan-spinner-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #2a2a3a;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
      `}</style>

      <h2 className="scan-title">Evidence Scanner</h2>

      <div className="scan-controls">
        <button className="scan-btn-primary" onClick={startCamera}>
          Webcam
        </button>
        <label className="scan-btn-label">
          Upload Image
          <input type="file" accept="image/*" onChange={handleFileUpload}
            style={{ display: 'none' }} />
        </label>
      </div>

      {/* Webcam view */}
      <div style={{ display: cameraOn ? 'block' : 'none', marginBottom: '16px' }}>
        <div className="video-container">
          <div className="video-label">Live Feed</div>
          <video ref={videoRef} autoPlay playsInline muted
            style={{ width: '100%', display: 'block', background: '#000' }} />
        </div>
        <button className="capture-btn" onClick={capturePhoto}>
          Capture Frame
        </button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Image preview */}
      {imageURL && (
        <div style={{ marginBottom: '24px' }}>
          <div className="preview-container">
            <div className="preview-label">Evidence Image</div>
            <img src={imageURL} alt="Captured"
              style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', display: 'block' }} />
          </div>
          <button
            className="analyze-btn"
            onClick={analyzeWithGemini}
            disabled={status === 'scanning'}
          >
            {status === 'scanning' ? 'Analyzing...' : 'Analyze with Gemini AI'}
          </button>
        </div>
      )}

      {/* Scanning indicator */}
      {status === 'scanning' && (
        <div className="scanning-indicator">
          <div className="scan-spinner" />
          <span className="scan-spinner-label">Processing with Gemini AI...</span>
        </div>
      )}

      {/* Result */}
      {status === 'done' && result && (
        <div className="result-card">
          <div className="result-header">
            <span className="result-title">Analysis Complete</span>
            <span className="result-name">{result.name}</span>
          </div>
          <div className="result-fields">
            <div className="result-field">
              <div className="field-label">Shape</div>
              <div className="field-value">{result.shape}</div>
            </div>
            <div className="result-field">
              <div className="field-label">Material</div>
              <div className="field-value">{result.material}</div>
            </div>
            <div className="result-field">
              <div className="field-label">Size</div>
              <div className="field-value">{result.estimatedSize}</div>
            </div>
            <div className="result-field">
              <div className="field-label">Texture</div>
              <div className="field-value">{result.texture}</div>
            </div>
            <div className="result-field">
              <div className="field-label">Weight</div>
              <div className="field-value">{result.weight}</div>
            </div>
            <div className="result-field">
              <div className="field-label">Dimensions</div>
              <div className="field-value">
                {result.dimensions
                  ? `${result.dimensions.width}m × ${result.dimensions.height}m × ${result.dimensions.depth}m`
                  : 'N/A'}
              </div>
            </div>
            <div className="result-field full">
              <div className="field-label">Description</div>
              <div className="field-value" style={{ fontSize: '12px', fontWeight: '400', fontFamily: 'DM Mono, monospace', lineHeight: '1.6', color: '#555' }}>
                {result.description}
              </div>
            </div>
            <div className="result-field full">
              <div className="field-label">Forensic Relevance</div>
              <div className="field-value" style={{ fontSize: '12px', fontWeight: '400', fontFamily: 'DM Mono, monospace', lineHeight: '1.6', color: '#e63946' }}>
                {result.forensicRelevance}
              </div>
            </div>
          </div>
          <button className="save-btn" onClick={saveToLibrary}>
            Save to Evidence Library
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="error-msg">
          ANALYSIS FAILED — Check your Gemini API key and try again
        </div>
      )}
    </div>
  )
}