import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Data from './Data'
import Profile from './Profile'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col space-y-0">
      <Profile />
      <Data />
    </div>
  )
}

export default App
