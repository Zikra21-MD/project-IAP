import { useEffect, useState } from "react";
import { ThreeDot } from "react-loading-indicators";

export default function Data() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(30);
  const [selectedStage, setSelectedStage] = useState(null);

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
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1302");
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

  const filteredPokemon = selectedStage === null
    ? pokemonList
    : pokemonList.filter((p) =>
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
          {filteredPokemon.slice(0, showMore).map((pokemon) => (
            <div
              key={pokemon.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center relative"
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
      {showMore < pokemonList.length && (
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

