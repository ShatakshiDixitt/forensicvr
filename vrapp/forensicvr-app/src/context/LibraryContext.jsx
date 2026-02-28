import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const LibraryContext = createContext()

export function LibraryProvider({ children }) {
  const [objects, setObjects] = useState([])
  const [loading, setLoading] = useState(true)

  const backendURL = import.meta.env.VITE_BACKEND_URL

  // Load all objects from backend on startup
  useEffect(() => {
    fetchObjects()
  }, [])

  async function fetchObjects() {
    try {
      const res = await axios.get(`${backendURL}/api/objects`)
      setObjects(res.data)
    } catch (e) {
      console.error('Failed to fetch objects:', e)
      setObjects([])
    } finally {
      setLoading(false)
    }
  }

  async function addObject(newObject) {
    try {
      const res = await axios.post(`${backendURL}/api/objects`, newObject)
      setObjects(prev => [res.data, ...prev])
      return res.data
    } catch (e) {
      console.error('Failed to add object:', e)
    }
  }

  async function deleteObject(id) {
    try {
      await axios.delete(`${backendURL}/api/objects/${id}`)
      setObjects(prev => prev.filter(o => o.id !== id))
    } catch (e) {
      console.error('Failed to delete object:', e)
    }
  }

  function sendObjectToVR(object) {
    // Sends object data to Unity via Electron's WebSocket bridge
    if (window.electronAPI) {
      window.electronAPI.sendToVR({
        type: 'SPAWN_OBJECT',
        payload: object
      })
    }
  }

  return (
    <LibraryContext.Provider value={{
      objects, loading, addObject, deleteObject, sendObjectToVR, fetchObjects
    }}>
      {children}
    </LibraryContext.Provider>
  )
}

export const useLibrary = () => useContext(LibraryContext)
