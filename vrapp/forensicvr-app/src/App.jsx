import { useAuth0 } from '@auth0/auth0-react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', background:'#0a0a0f', color:'#e63946', fontSize:'24px' }}>
      Loading...
    </div>
  )

  return isAuthenticated ? <Dashboard /> : <Login />
}