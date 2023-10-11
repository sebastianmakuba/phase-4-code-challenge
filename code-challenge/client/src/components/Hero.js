import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CircularProgress, Typography, List, ListItem } from "@mui/material";

function Hero() {
  const { id } = useParams();
  const [hero, setHero] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5500/heroes/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Hero not found");
        }
        return response.json();
      })
      .then((data) => setHero(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return <Typography variant="h5">Error: {error}</Typography>;
  }

  if (!hero) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h4">{hero.super_name}</Typography>
      <Typography variant="h5">AKA {hero.name}</Typography>
      <Typography variant="h6">Powers:</Typography>
      <List>
        {hero.powers.map((power) => (
          <ListItem key={power.id}>
            <Link to={`/powers/${power.id}`}>{power.name}</Link>
          </ListItem>
        ))}
      </List>
      <Link to="/hero_powers/new">Add Hero Power</Link>
    </div>
  );
}

export default Hero;
