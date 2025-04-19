import React from 'react';

const Card = ({ pokemon }) => {
  return (
    <div className='item'>
      <div className='item_img'>
        <img  src={pokemon.sprites.front_default} alt={pokemon.name} />
        <h3>{pokemon.name}</h3>
      </div>
      <div className='item_txt'>
        {pokemon.types.map((type, index) => (
          <p key={index}>
            <span>Type : {type.type.name}</span>
          </p>
        ))}
        <p>Weight : {pokemon.weight}</p>
        <p>Height : {pokemon.height}</p>
        <p> Ability : {pokemon.abilities[0].ability.name}</p>
      </div>
    </div>
  );
};

export default Card;
