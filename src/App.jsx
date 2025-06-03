import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Data from './Data'
import Profile from './Profile'
import { useRef } from 'react'

function App() {
  const dataRef = useRef(null)
  const [darkMode, setDarkMode] = useState(false)
  const toggleDarkMode = () => setDarkMode(prev => !prev)
  const scrollToData = () => {
    dataRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={darkMode ? 'bg-gray-900 text-white min-h-screen' : 'bg-purple-100 text-black min-h-screen'}>
      <Profile darkMode={darkMode} toggleDarkMode={toggleDarkMode} scrollToData={scrollToData} />
      <div ref={dataRef}>
        <Data darkMode={darkMode} />
      </div>
    </div>
  )
}

export default App
