import PokemonClient from "@/components/PokemonClient";
import Nav from "@/components/Nav";
import { getAllPokemon, getPokemon } from "@/utils/pokemon";

export default async function Home() {
  const limit = 20;
  const initialURL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;
  const res = await getAllPokemon(initialURL);
  const pokemonData = await Promise.all(
    res.results.map((pokemon) => getPokemon(pokemon.url))
  );

  return (
    <>
      <Nav />
      <main>
        <p className="main_p">
          You can find all Pokémon on this page.
        </p>
        <PokemonClient initialData={pokemonData} />
      </main>
    </>
  );
}
