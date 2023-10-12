import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCard from './HeroCard';
import { Button, Container } from '@mui/material';

function Home() {
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5500/heroes')
      .then((response) => response.json())
      .then((data) => setHeroes(data))
      .catch((error) => console.error(error));
  }, []);

  const handleDeleteHero = (heroId) => {
    fetch(`http://localhost:5500/heroes/${heroId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setHeroes((prevHeroes) => prevHeroes.filter((hero) => hero.id !== heroId));
      })
      .catch((error) => console.error(error));
  };

  return (
    <Container>
      <h1>Superheroes</h1>
      <Link to="/new-hero">
        <Button variant="contained" color="primary">
          Create New Superhero
        </Button>
      </Link>
      <div className="hero-list">
        {heroes.map((hero) => (
          <HeroCard key={hero.id} hero={hero} onDelete={handleDeleteHero} />
        ))}
      </div>
    </Container>
  );
}

export default Home;
