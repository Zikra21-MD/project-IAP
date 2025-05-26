import pp from '/src/assets/pp.png'

export default function Profile() {
    return (
        <div className="min-h-screen bg-purple-100 px-6 flex flex-col items-center justify-center">
            <img src={pp} alt="profile picture" className="w-32 h-32 rounded-full mb-2" />
            <h2 className="text-3xl text-center font-semibold">Zikra Mulya Deswanto</h2>
            <a href="https://zikramulya.vercel.app/" target='_blank'>
                <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full mt-4">
                    About Me
                </button>
            </a>
        </div>
    );
}

