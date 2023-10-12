import React, { useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

function PowerEditForm({ open, onClose, power, onSave }) {
  const [editedDescription, setEditedDescription] = useState(power ? power.description : '');

  const handleSave = () => {
    if (power) {
      const updatedPower = { ...power, description: editedDescription };
      
      fetch(`http://localhost:5500/powers/${power.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPower),
      })
        .then((response) => response.json())
        .then((data) => {
          onSave(data);
          onClose();
        })
        .catch((error) => {
          console.error('Error updating power description:', error);
        });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Power</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Description"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PowerEditForm;
