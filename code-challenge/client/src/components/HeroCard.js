import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function HeroCard({ hero, onDelete }) {
  const handleDeleteHero = () => {
    onDelete(hero.id);
  };

  return (
    <Card className="hero-card">
      <CardContent>
        <Typography variant="h6">{hero.name}</Typography>
        <Typography variant="subtitle1">{hero.super_name}</Typography>
        <Link to={`/hero/${hero.id}/edit`}>
          <Button variant="outlined" color="primary">
            Edit Powers
          </Button>
        </Link>
        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleDeleteHero}>
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}

export default HeroCard;
