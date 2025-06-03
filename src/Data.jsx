import { useEffect, useState } from "react";
import { ThreeDot } from "react-loading-indicators";

export default function Data({ darkMode }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(30);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvolutionChain = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data.chain;
    } catch (error) {
      return null;
    }
  };

  const getEvolutionStage = (chain, targetSpecies, stage = 0) => {
    if (chain.species.name === targetSpecies) return stage;
    for (const evolution of chain.evolves_to) {
      const result = getEvolutionStage(evolution, targetSpecies, stage + 1);
      if (result !== -1) return result;
    }
    return 'data tidak ditemukan';
  };

  const fetchAllPokemon = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=300");
    const data = await res.json();

    const detailedData = await Promise.all(
      data.results.map(async (p) => {
        try {
          const pokemonRes = await fetch(p.url);
          const pokemonData = await pokemonRes.json();

          const speciesRes = await fetch(pokemonData.species.url);
          const speciesData = await speciesRes.json();

          const evolutionChain = await fetchEvolutionChain(speciesData.evolution_chain.url);
          const stage = evolutionChain ? getEvolutionStage(evolutionChain, speciesData.name) : 0;

          return {
            ...pokemonData,
            stage,
          };
        } catch (error) {
          return null;
        }
      })
    );

    setPokemonList(detailedData.filter((p) => p !== null));
    setLoading(false);
  };

  useEffect(() => {
    fetchAllPokemon();
  }, []);

  const handleShowMore = () => {
    setShowMore((prev) => prev + 30);
  };

  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  const filteredPokemon = pokemonList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedPokemon = selectedStage === null
    ? filteredPokemon
    : filteredPokemon.filter((p) =>
        selectedStage === 0
          ? p.stage === 0
          : selectedStage === 1
          ? p.stage === 1
          : p.stage >= 2
      );

  return (
    <div className={`min-h-screen px-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-purple-100 text-black'}`}>
      <h1 className={`text-3xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
        Semua Pokemon
      </h1>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Cari Pokemon"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`border rounded-lg py-2 px-4 placeholder:${darkMode ? 'text-gray-300' : 'text-black'} 
            ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
        />
      </div>
      <div role="tablist" className={`tabs tabs-border justify-center mb-6 ${darkMode ? 'border-gray-700' : ''}`}>
        <a
          role="tab"
          href="#"
          className={`tab ${selectedStage === null ? "tab-active" : ""} ${darkMode ? 'text-white' : 'text-black'}`}
          onClick={(e) => {
            e.preventDefault();
            setSelectedStage(null);
            setShowMore(30);
          }}
        >
          Semua
        </a>
        <a
          role="tab"
          href="#"
          className={`tab ${selectedStage === 0 ? "tab-active" : ""} ${darkMode ? 'text-white' : 'text-black'}`}
          onClick={(e) => {
            e.preventDefault();
            setSelectedStage(0);
            setShowMore(30);
          }}
        >
          Evolusi Awal
        </a>
        <a
          role="tab"
          href="#"
          className={`tab ${selectedStage === 1 ? "tab-active" : ""} ${darkMode ? 'text-white' : 'text-black'}`}
          onClick={(e) => {
            e.preventDefault();
            setSelectedStage(1);
            setShowMore(30);
          }}
        >
          Evolusi Pertama
        </a>
        <a
          role="tab"
          href="#"
          className={`tab ${selectedStage === 2 ? "tab-active" : ""} ${darkMode ? 'text-white' : 'text-black'}`}
          onClick={(e) => {
            e.preventDefault();
            setSelectedStage(2);
            setShowMore(30);
          }}
        >
          Evolusi Kedua
        </a>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <ThreeDot variant="bounce" color={darkMode ? "#ffffff" : "#000000"} size="medium" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayedPokemon.slice(0, searchQuery ? displayedPokemon.length : showMore).map((pokemon) => (
            <div
              key={pokemon.id}
              className={`rounded-lg shadow-md p-4 flex flex-col items-center relative cursor-pointer hover:shadow-lg transition-shadow ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
              }`}
              onClick={() => openModal(pokemon)}
            >
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-20 h-20 mb-2"
              />
              <h2 className="capitalize font-semibold">
                {pokemon.name}
              </h2>
              <div className="flex flex-wrap justify-center gap-1 mt-1">
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full"
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && selectedPokemon && (
        <div 
          className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${darkMode ? 'bg-black bg-opacity-80' : 'bg-black bg-opacity-50'}`}
          onClick={closeModal}
        >
          <div 
            className={`rounded-xl shadow-2xl w-full max-w-md overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-4 flex justify-between items-center ${darkMode ? 'bg-gray-700' : 'bg-purple-500'}`}>
              <h2 className="text-2xl font-bold capitalize">
                {selectedPokemon.name}
              </h2>
              <button 
                onClick={closeModal}
                className={`${darkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-purple-200'} text-2xl`}
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-center mb-4">
                <img
                  src={selectedPokemon.sprites.front_default}
                  alt={selectedPokemon.name}
                  className="w-40 h-40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold">Tinggi</h3>
                  <p className="text-lg">{(selectedPokemon.height / 10).toFixed(1)} m</p>
                </div>
                <div>
                  <h3 className="font-semibold">Berat</h3>
                  <p className="text-lg">{(selectedPokemon.weight / 10).toFixed(1)} kg</p>
                </div>
                <div>
                  <h3 className="font-semibold">Tipe</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full"
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Evolusi</h3>
                  <p className="text-lg">
                    {selectedPokemon.stage === 0 
                      ? "Awal" 
                      : selectedPokemon.stage === 1 
                        ? "Pertama" 
                        : "Kedua"}
                  </p>
                </div>
              </div>

              <h3 className="font-semibold mb-2">Statistik</h3>
              <div className="space-y-2">
                {selectedPokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className="flex items-center">
                    <span className="w-32 text-sm font-medium capitalize">
                      {stat.stat.name.replace('-', ' ')}
                    </span>
                    <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`${darkMode ? 'bg-purple-600' : 'bg-purple-500'}`}
                        style={{ width: `${(stat.base_stat / 150) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-10 text-right ml-2 font-bold">{stat.base_stat}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={closeModal}
                  className={`font-medium py-2 px-6 rounded-full transition-colors ${
                    darkMode
                      ? "bg-purple-700 hover:bg-purple-600 text-white"
                      : "bg-purple-500 hover:bg-purple-600 text-black"
                  }`}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!searchQuery && !loading && displayedPokemon.length > showMore && (
        <div className="flex justify-center my-6">
          <button
            className={`font-bold py-2 px-4 rounded-full ${
              darkMode
                ? "bg-purple-700 hover:bg-purple-600 text-white"
                : "bg-purple-500 hover:bg-blue-700 text-white"
            }`}
            onClick={handleShowMore}
          >
            Muat lebih banyak
          </button>
        </div>
      )}
    </div>
  );
}
