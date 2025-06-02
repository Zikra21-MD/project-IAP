import pp from '/src/assets/pp.png'
import { Zap } from 'lucide-react'
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa'

export default function Profile() {
    return (
        <div className="min-h-screen bg-purple-100 px-6 flex flex-col items-start justify-center overflow-x-hidden">
            <div className="flex items-center relative w-full ml-20">
                <div className="relative">
                    <img src={pp} alt="profile picture" className="w-60 h-auto rounded-full" />
                    <a href="https://www.instagram.com/zikramulya/" target="_blank" className="absolute -top-4 -left-4 w-8 h-8 rounded-lg flex items-center justify-center animate-float">
                        <FaInstagram className="text-3xl text-black hover:text-purple-500" />
                    </a>
                    <a href="https://github.com/zikramulya" target="_blank" className="absolute -top-4 -right-4 w-8 h-8  rounded-lg flex items-center justify-center animate-float animation-delay-1000">
                        <FaGithub className="text-3xl text-black hover:text-purple-500" />
                    </a>
                    <a href="https://www.linkedin.com/in/zikramulya/" target="_blank" className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-white/20 flex items-center justify-center animate-bounce">
                        <FaLinkedin className="text-3xl text-black hover:text-purple-500" />
                    </a>
                </div>
                <div className="ml-16">
                    <h2 className="text-4xl text-black font-semibold whitespace-nowrap">Zikra Mulya Deswanto</h2>
                    <p className="text-lg text-black mt-2 flex items-center">
                        <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                        front-end developer
                    </p>
                    <p className='text-lg text-black'>
                        untuk lebih mengetahui tentang saya silahkan klik tombol dibawah
                    </p>
                    <a href="https://zikramulya.vercel.app/" target="_blank">
                        <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full mt-4">
                            About Me
                        </button>
                    </a>
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

