import pp from '/src/assets/pp.png'

export default function Profile() {
    return (
        <div className="min-h-screen bg-purple-100 px-6 flex flex-col items-center justify-center">
            <img src={pp} alt="profile picture" className="w-32 h-32 rounded-full mb-2" />
            <h2 className="text-3xl text-center text-black font-semibold">Zikra Mulya Deswanto</h2>
            <p className="text-lg text-center text-black mt-2">Saya seorang mahasiswa Sistem Informasi</p>
            <div className=" flex flex-col items-center">
                <p className='text-lg text-center text-black'>
                    untuk lebih mengetahui tentang saya silahkan klik tombol dibawah
                </p>
                <div className="animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-black mt-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l-4-4m4 4l4-4" />
                    </svg>
                </div>
            </div>
            <a href="https://zikramulya.vercel.app/" target='_blank'>
                <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full mt-4">
                    About Me
                </button>
            </a>
        </div>
    );
}

