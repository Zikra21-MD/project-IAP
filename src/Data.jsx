import { useEffect, useState } from "react";


export default function Data() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllPokemon = async () => {
    let allResults = [];
    let nextUrl = "https://pokeapi.co/api/v2/pokemon?limit=100";
    
    while (nextUrl) {
      const res = await fetch(nextUrl);
      const data = await res.json();
      allResults = allResults.concat(data.results);
      nextUrl = data.next;
    }

    const detailedData = await Promise.all(
      allResults.map(p => fetch(p.url).then(res => res.json()))
    );

    setPokemonList(detailedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllPokemon();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Semua Pokémon</h1>
      {loading ? (
        <p className="text-center text-gray-600">Memuat semua Pokémon...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {pokemonList.map((pokemon) => (
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
    </div>
  );
}
