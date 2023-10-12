import React, { useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

function EditHeroForm({ open, onClose, field, value, onSave }) {
  const [editedValue, setEditedValue] = useState(value || '');

  const handleSave = () => {
    onSave(editedValue);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit {field === 'name' ? 'Name' : 'Superhero Name'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label={field === 'name' ? 'Name' : 'Superhero Name'}
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
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

export default EditHeroForm;
