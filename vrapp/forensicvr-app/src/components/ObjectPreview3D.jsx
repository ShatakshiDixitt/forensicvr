import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ObjectPreview3D({ object }) {
  const mountRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    const width = mountRef.current.clientWidth
    const height = mountRef.current.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0d0d14')

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0.5, 2)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    mountRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(5, 10, 5)
    dirLight.castShadow = true
    scene.add(dirLight)

    const rimLight = new THREE.DirectionalLight(0xe63946, 0.3)
    rimLight.position.set(-5, -2, -5)
    scene.add(rimLight)

    // Material
    const color = object.color || '#888888'
    const isGlossy = object.texture === 'glossy' || object.material === 'metal'
    const isTransparent = object.texture === 'transparent' || object.material === 'glass'

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: isGlossy ? 0.1 : isTransparent ? 0.05 : 0.7,
      metalness: object.material === 'metal' ? 0.9 : isGlossy ? 0.3 : 0,
      transparent: isTransparent,
      opacity: isTransparent ? 0.5 : 1,
    })

    // Geometry based on shape
    const d = object.dimensions || { width: 0.2, height: 0.2, depth: 0.2 }
    const scale = 1.2
    const w = Math.min(d.width * scale, 1.5)
    const h = Math.min(d.height * scale, 1.5)
    const dep = Math.min(d.depth * scale, 1.5)

    let geometry
    switch (object.shape) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(Math.max(w, h) / 2, 32, 32)
        break
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(w / 2, w / 2, h, 32)
        break
      case 'cone':
        geometry = new THREE.ConeGeometry(w / 2, h, 32)
        break
      case 'box':
      default:
        geometry = new THREE.BoxGeometry(w, h, dep)
        break
    }

    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    scene.add(mesh)

    // Grid floor
    const grid = new THREE.GridHelper(4, 10, '#222233', '#1a1a2a')
    grid.position.y = -0.8
    scene.add(grid)

    // Animation loop
    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      mesh.rotation.y += 0.008
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      renderer.dispose()
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [object])

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '200px',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
        background: '#0d0d14'
      }}
    />
  )
}