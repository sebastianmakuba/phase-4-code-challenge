import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import PowerEditForm from './PowerEditForm';
import { useParams } from 'react-router-dom';

function HeroDetails() {
  const { id } = useParams();
  const [hero, setHero] = useState(null);
  const [editPowerId, setEditPowerId] = useState(null);
  const [editHeroField, setEditHeroField] = useState(null);

  const [openEditForm, setOpenEditForm] = useState(false);
  const [editedPower, setEditedPower] = useState(null);
  const [editedHeroField, setEditedHeroField] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5500/heroes/${id}`)
      .then((response) => response.json())
      .then((data) => setHero(data))
      .catch((error) => console.error(error));
  }, [id]);

  const handleEditPower = (powerId) => {
    setEditPowerId(powerId);
    setEditedPower(hero.powers.find((power) => power.id === powerId));
    setOpenEditForm(true);
  };

  const handleEditHeroField = (field) => {
    setEditHeroField(field);
    setEditedHeroField(hero[field]);
    setOpenEditForm(true);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
  };

  const handleSavePower = (updatedPower) => {
    fetch(`http://localhost:5500/powers/${updatedPower.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPower),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedPowers = hero.powers.map((power) =>
          power.id === updatedPower.id ? data : power
        );
        setHero({ ...hero, powers: updatedPowers });
        setOpenEditForm(false);
      })
      .catch((error) => {
        console.error('Error updating power description:', error);
      });
  };

  const handleSaveHeroField = (value) => {
    const updatedHeroData = { ...hero, [editHeroField]: value };
    fetch(`http://localhost:5500/heroes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedHeroData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to update hero data');
        }
      })
      .then((updatedHero) => {
        // Ensure the 'powers' property is included in the response
        if ('powers' in updatedHero) {
          setHero(updatedHero);
        } else {
          setHero({ ...updatedHero, powers: hero.powers }); // Preserve the original 'powers'
        }
        setOpenEditForm(false);
      })
      .catch((error) => {
        console.error('Error updating hero data:', error);
      });
  };
  

  if (!hero) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Card>
        <CardContent>
          <Typography variant="h6">{hero.name}</Typography>
          <Typography variant="subtitle1">{hero.super_name}</Typography>
          <Typography variant="subtitle2">Powers:</Typography>
          <List>
            {hero.powers.map((power) => (
              <ListItem key={power.id}>
                <>
                  <ListItemText
                    primary={power.name}
                    secondary={`Description: ${power.description}, Strength: ${power.strength}`}
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditPower(power.id)}
                    style={{ marginRight: '8px' }}
                  >
                    Edit Power
                  </Button>
                </>
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEditHeroField('name')}
            style={{ marginRight: '8px' }}
          >
            Edit Name
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEditHeroField('super_name')}
            style={{ marginRight: '8px' }}
          >
            Edit Superhero Name
          </Button>
        </CardContent>
      </Card>

      <PowerEditForm
        open={openEditForm && editPowerId !== null}
        onClose={handleCloseEditForm}
        power={editedPower}
        onSave={handleSavePower}
      />

      <Dialog open={openEditForm && editHeroField !== null} onClose={handleCloseEditForm}>
        <DialogTitle>Edit {editHeroField === 'name' ? 'Name' : 'Superhero Name'}</DialogTitle>
        <DialogContent>
          <TextField
            label={`Edit ${editHeroField === 'name' ? 'Name' : 'Superhero Name'}`}
            variant="outlined"
            fullWidth
            value={editedHeroField}
            onChange={(e) => setEditedHeroField(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSaveHeroField(editedHeroField)}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default HeroDetails;
