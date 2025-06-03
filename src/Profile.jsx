import { useState } from 'react'
import pp from '/src/assets/pp.png'
import { Zap, Info } from 'lucide-react'
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa'

export default function Profile({ scrollToData, darkMode, toggleDarkMode }) {
  return (
    <div
      className={`min-h-screen px-6 flex flex-col items-center justify-center overflow-x-hidden
      ${darkMode ? 'bg-gray-900 text-white' : 'bg-purple-100 text-black'}`}
    >
      <div className="absolute top-0 right-0 p-6">
        <label htmlFor="dark-mode-toggle" className="inline-flex relative items-center cursor-pointer">
          <input
            type="checkbox"
            id="dark-mode-toggle"
            className="sr-only"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          <div className="w-14 h-8 bg-gray-300 dark:bg-gray-700 rounded-full relative transition-colors duration-300 peer-checked:bg-purple-600"></div>
          <div
            className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300
              ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}
          ></div>
        </label>
      </div>

      {/* Container Foto + Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start w-full max-w-5xl mt-8">

        <div className="relative flex-shrink-0">
          <img
            src={pp}
            alt="profile picture"
            className="w-40 h-40 sm:w-60 sm:h-auto rounded-full border-4 border-gray-300 dark:border-gray-700 mx-auto"
          />

          {/* Social Icons */}
          <a
            href="https://www.instagram.com/zikr_21?igsh=Y2NzOHd5NXJtbGZz"
            target="_blank"
            rel="noreferrer"
            className="absolute top-0 left-0 w-8 h-8 rounded-lg flex items-center justify-center animate-float"
          >
            <FaInstagram
              className={`text-3xl hover:text-purple-500 ${
                darkMode ? 'text-white' : 'text-black'
              }`}
            />
          </a>
          <a
            href="https://github.com/Zikra21-MD"
            target="_blank"
            rel="noreferrer"
            className="absolute top-0 right-0 w-8 h-8 rounded-lg flex items-center justify-center animate-float animation-delay-1000"
          >
            <FaGithub
              className={`text-3xl hover:text-purple-500 ${
                darkMode ? 'text-white' : 'text-black'
              }`}
            />
          </a>
          <a
            href="https://www.linkedin.com/in/zikra-mulya-9a5297303/"
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full border-4 flex items-center justify-center animate-bounce border-gray-300 dark:border-gray-700"
          >
            <FaLinkedin
              className={`text-3xl hover:text-purple-500 ${
                darkMode ? 'text-white' : 'text-black'
              }`}
            />
          </a>
          <a
            href="https://zikramulya.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-0 left-0 w-10 h-10 rounded-full border-4 flex items-center justify-center animate-bounce animation-delay-1000 border-gray-300 dark:border-gray-700"
          >
            <Info
              className={`text-3xl hover:text-purple-500 ${
                darkMode ? 'text-white' : 'text-black'
              }`}
            />
          </a>
        </div>

        <div className="mt-8 sm:mt-0 sm:ml-16 max-w-xl text-center sm:text-left px-4">
          <h2 className="text-3xl sm:text-4xl font-semibold whitespace-nowrap">
            Zikra Mulya Deswanto
          </h2>
          <p className="text-lg mt-2 flex items-center justify-center sm:justify-start">
            <Zap className="w-6 h-6 text-yellow-400 animate-pulse mr-2" />
            front-end developer
          </p>
          <p className="text-base sm:text-lg mt-4">
            Saya adalah seorang mahasiswa Sistem Informasi di Universitas Islam Negeri Imam Bonjol Padang. Saya memiliki minat pada pengembangan web dan aplikasi.
          </p>

          <button
            onClick={scrollToData}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full mt-6"
          >
            Let's Start
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}