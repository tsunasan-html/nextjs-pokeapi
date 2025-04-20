"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/Card";

const PokemonClient = ({ initialData }) => {
  const [pokemonData, setPokemonData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [visiblePages, setVisiblePages] = useState(6); 
  const [isMobile, setIsMobile] = useState(false); 
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const limit = 24;
  const totalCount = 1302;
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    const updateVisiblePages = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true); 
        setVisiblePages(4);
      } else {
        setIsMobile(false); 
        setVisiblePages(6);
      }
    };

    updateVisiblePages(); 
    window.addEventListener("resize", updateVisiblePages); 

    return () => {
      window.removeEventListener("resize", updateVisiblePages); 
    };
  }, []);

  const fetchPage = async (pageNumber) => {
    if (pageNumber === 1) {
      setPokemonData(initialData);
      setCurrentPage(1);
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    const offset = (pageNumber - 1) * limit;
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    const data = await res.json();
    const details = await Promise.all(
      data.results.map((pokemon) => fetch(pokemon.url).then((res) => res.json()))
    );
    setPokemonData(details);
    setCurrentPage(pageNumber);
    setLoading(false);
    window.scrollTo(0, 0);
  };

  const renderPageNumbers = () => {
    const pages = [];
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + visiblePages - 1, totalPages);

    if (end - start < visiblePages - 1) {
      start = Math.max(end - visiblePages + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => fetchPage(i)}
          className={i === currentPage ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div>
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid">
          {pokemonData.map((pokemon, i) => (
            <Card key={i} pokemon={pokemon} />
          ))}
        </div>
      )}

    {hasMounted && !loading && (
      <div className="pagination">
        {isMobile ? (
          <div className="mobile-pagination">
            <button onClick={() => fetchPage(1)} disabled={currentPage === 1}>
              &laquo;
            </button>
            <button onClick={() => currentPage > 1 && fetchPage(currentPage - 1)} disabled={currentPage === 1}>
              &lsaquo;
            </button>
            <span>
              Page {currentPage}/{totalPages}
            </span>
            <button onClick={() => currentPage < totalPages && fetchPage(currentPage + 1)} disabled={currentPage === totalPages}>
              &rsaquo;
            </button>
            <button onClick={() => fetchPage(totalPages)} disabled={currentPage === totalPages}>
              &raquo;
            </button>
          </div>
        ) : (
          <div className="desktop-pagination">
            <button onClick={() => fetchPage(1)} disabled={currentPage === 1}>
              &laquo;
            </button>
            <button onClick={() => currentPage > 1 && fetchPage(currentPage - 1)} disabled={currentPage === 1}>
              &lsaquo;
            </button>
            {renderPageNumbers()}
            <button onClick={() => currentPage < totalPages && fetchPage(currentPage + 1)} disabled={currentPage === totalPages}>
              &rsaquo;
            </button>
            <button onClick={() => fetchPage(totalPages)} disabled={currentPage === totalPages}>
              &raquo;
            </button>
          </div>
        )}
      </div>
    )}

    </div>
  );
};

export default PokemonClient;
