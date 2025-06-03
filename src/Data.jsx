import { useEffect, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import pikachu from "/src/assets/Daco_540500.png";

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
          Basic
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
          Evolusi kedua
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
          Evolusi ketiga
        </a>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <ThreeDot variant="bounce" color={darkMode ? "#ffffff" : "#000000"} size="medium" />
        </div>
      ) : displayedPokemon.length === 0 ? (
  <div className="text-center text-lg font-semibold py-10">
    {searchQuery ? (
      <div>
        <img src={pikachu} alt="Pokemon tidak ditemukan" className="mx-auto mt-4 w-20 h-20" />
        <p>Pokemon tidak ditemukan.</p>
      </div>
    ) : (
      <div>
        <p>Tidak ada data tersedia.</p>
        <img src="/path/to/no-data-image.png" alt="Tidak ada data tersedia" className="mx-auto mt-4" />
      </div>
    )}
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
    className={`fixed inset-0 flex items-center justify-center z-50 p-2`}
    style={{background: darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)'}}
    onClick={closeModal}
  >
    <div
      className={`rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`p-3 flex justify-center items-center ${darkMode ? 'bg-gray-800' : 'bg-purple-500 text-white'}`}>
        <h2 className="text-lg sm:text-xl font-bold capitalize">{selectedPokemon.name}</h2>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex flex-col items-center">
          <img
            src={selectedPokemon.sprites.front_default}
            alt={selectedPokemon.name}
            className="w-28 h-28 sm:w-36 sm:h-36 mb-2"
          />
          <div className="flex flex-wrap justify-center gap-1">
            {selectedPokemon.types.map((type) => (
              <span
                key={type.type.name}
                className="text-xs sm:text-sm bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-medium"
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div>
            <h4 className="font-semibold">Tinggi</h4>
            <p>{(selectedPokemon.height / 10).toFixed(1)} m</p>
          </div>
          <div>
            <h4 className="font-semibold">Berat</h4>
            <p>{(selectedPokemon.weight / 10).toFixed(1)} kg</p>
          </div>
          <div>
            <h4 className="font-semibold">Evolusi</h4>
            <p>
              {selectedPokemon.stage === 0
                ? "basic"
                : selectedPokemon.stage === 1
                ? "kedua"
                : "Ketiga"}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Statistik</h4>
          <div className="space-y-2">
            {selectedPokemon.stats.map((stat) => (
              <div key={stat.stat.name}>
                <div className="flex justify-between text-xs font-medium capitalize mb-1">
                  <span>{stat.stat.name.replace('-', ' ')}</span>
                  <span>{stat.base_stat}</span>
                </div>
                <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className={`${darkMode ? 'bg-purple-600' : 'bg-purple-500'} h-full rounded-full transition-all`}
                    style={{
                      width: `${Math.min((stat.base_stat / 150) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-3">
          <button
            onClick={closeModal}
            className={`font-medium py-1 px-4 rounded-full transition-colors ${
              darkMode
                ? "bg-purple-700 hover:bg-purple-600 text-white"
                : "bg-purple-500 hover:bg-purple-600 text-white"
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

