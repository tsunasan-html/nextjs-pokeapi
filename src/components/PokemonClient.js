"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/Card";

const PokemonClient = ({ initialData }) => {
  const [pokemonData, setPokemonData] = useState(initialData);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPage = async (newOffset) => {
    setLoading(true);
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${newOffset}&limit=20`
    );
    const data = await res.json();
    const details = await Promise.all(
      data.results.map((pokemon) => fetch(pokemon.url).then((res) => res.json()))
    );
    setPokemonData(details);
    setOffset(newOffset);
    setLoading(false);

    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    fetchPage(offset + 20);
  };

  const handlePrev = () => {
    if (offset >= 20) {
      fetchPage(offset - 20);
    }
  };

  return (
    <div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid">
          {pokemonData.map((pokemon, i) => (
            <Card key={i} pokemon={pokemon} />
          ))}
        </div>
      )}

      <div className="btn">
        {!loading && (
          <>
            <button
              onClick={handlePrev}
              disabled={offset === 0}
              className={`prev-btn ${offset === 0 ? "disabled" : ""}`}
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className={`next-btn ${loading ? "disabled" : ""}`}
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PokemonClient;
