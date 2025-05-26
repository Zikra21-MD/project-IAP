import { useEffect, useState } from "react";


export default function Data() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(30);

  const fetchAllPokemon = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
    const data = await res.json();
    const detailedData = await Promise.all(
      data.results.map(p => fetch(p.url).then(res => res.json()))
    );

    setPokemonList(detailedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllPokemon();
  }, []);

  const handleShowMore = () => {
    setShowMore(showMore + 30);
  };

  return (
    <div className="min-h-screen bg-purple-100 px-6">
      <h1 className="text-3xl font-bold text-center mb-6">Semua Pokemon</h1>
      {loading ? (
        <p className="text-center text-gray-600">Memuat semua Pokemon...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {pokemonList.slice(0, showMore).map((pokemon) => (
            <div
              key={pokemon.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
            >
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-20 h-20 mb-2"
              />
              <h2 className="capitalize font-semibold">{pokemon.name}</h2>
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

