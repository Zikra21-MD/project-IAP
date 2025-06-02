import { useEffect, useState } from "react";
import { ThreeDot } from "react-loading-indicators";

export default function Data() {
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
    <div className="min-h-screen bg-purple-100 px-6">
      <h1 className="text-3xl font-bold text-center text-black mb-6">
        Semua Pokemon
      </h1>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Cari Pokemon"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-lg text-black py-2 px-4 placeholder:text-black"
        />
      </div>
      <div role="tablist" className="tabs tabs-border justify-center mb-6">
        <a
          role="tab"
          className={`tab ${selectedStage === null ? "tab-active" : ""}`}
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
          className={`tab ${selectedStage === 0 ? "tab-active" : ""}`}
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
          className={`tab ${selectedStage === 1 ? "tab-active" : ""}`}
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
          className={`tab ${selectedStage === 2 ? "tab-active" : ""}`}
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
          <ThreeDot variant="bounce" color="#000000" size="medium" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayedPokemon.slice(0, searchQuery ? displayedPokemon.length : showMore).map((pokemon) => (
            <div
              key={pokemon.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center relative cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openModal(pokemon)}
            >
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-20 h-20 mb-2"
              />
              <h2 className="capitalize font-semibold text-black">
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-purple-500 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black capitalize">
                {selectedPokemon.name}
              </h2>
              <button 
                onClick={closeModal}
                className="text-black text-2xl hover:text-purple-200"
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
                  <h3 className="font-semibold text-black">Tinggi</h3>
                  <p className="text-lg text-black">{(selectedPokemon.height / 10).toFixed(1)} m</p>
                </div>
                <div>
                  <h3 className="font-semibold text-black">Berat</h3>
                  <p className="text-lg text-black">{(selectedPokemon.weight / 10).toFixed(1)} kg</p>
                </div>
                <div>
                  <h3 className="font-semibold text-black">Tipe</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-black">Evolusi</h3>
                  <p className="text-lg text-black">
                    {selectedPokemon.stage === 0 
                      ? "Awal" 
                      : selectedPokemon.stage === 1 
                        ? "Pertama" 
                        : "Kedua"}
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-black mb-2">Statistik</h3>
              <div className="space-y-2">
                {selectedPokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className="flex items-center">
                    <span className="w-32 text-sm font-medium text-black capitalize">
                      {stat.stat.name.replace('-', ' ')}
                    </span>
                    <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500  rounded-full"
                        style={{ width: `${Math.min(100, stat.base_stat)}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right text-sm font-medium">
                      {stat.base_stat}
                    </span>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold text-black mt-4 mb-2">Kemampuan</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPokemon.abilities.map((ability) => (
                  <span
                    key={ability.ability.name}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                  >
                    {ability.ability.name.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-purple-500 hover:bg-purple-600 text-black font-medium py-2 px-6 rounded-full transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {showMore < filteredPokemon.length && !searchQuery && (
        <div className="flex justify-center w-full py-6">
          <button
            className="bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleShowMore}
          >
            Muat lebih banyak
          </button>
        </div>
      )}
    </div>
  );
}

