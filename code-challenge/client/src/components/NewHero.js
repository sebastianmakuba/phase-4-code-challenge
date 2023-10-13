import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Container,
  Card,
  CardContent,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';

const NewHero = () => {
  const initialValues = {
    name: '',
    super_name: '',
    powers: [],
  };

  const [powers, setPowers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5500/powers')
      .then((response) => response.json())
      .then((data) => setPowers(data))
      .catch((error) => console.error(error));
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    super_name: Yup.string().required('Superhero name is required'),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Step 1: Create the hero
    fetch('http://localhost:5500/heroes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.name,
        super_name: values.super_name,
      }),
    })
      .then((response) => response.json())
      .then((heroData) => {
        // Step 2: Create hero's powers
        const heroId = heroData.id;
        const powerPromises = values.powers.map((selectedPower) => {
          return fetch('http://localhost:5500/hero_powers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              hero_id: heroId,
              power_id: selectedPower.id,
              strength: selectedPower.strength,
            }),
          });
        });
  
        // Wait for all power creation requests to complete
        return Promise.all(powerPromises);
      })
      .then(() => {
        console.log('New hero and powers created successfully');
        // Reset the form values
        resetForm();
      })
      .catch((error) => {
        console.error('Error creating hero and powers:', error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Container>
      <h1>Create New Superhero</h1>
      <Link to="/">
        <Button variant="contained" color="primary">
          Back to Heroes
        </Button>
      </Link>
      <Card>
        <CardContent>
          <Typography variant="h6">Enter Superhero Details</Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div>
                  <label htmlFor="name">Name:</label>
                  <Field type="text" id="name" name="name" />
                  <ErrorMessage name="name" component="div" className="error" />
                </div>

                <div>
                  <label htmlFor="super_name">Superhero Name:</label>
                  <Field type="text" id="super_name" name="super_name" />
                  <ErrorMessage name="super_name" component="div" className="error" />
                </div>

                <div>
                  <label>Powers:</label>
                  <FormGroup>
                    {powers.map((power) => (
                      <div key={power.id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={values.powers.some(
                                (selectedPower) => selectedPower.id === power.id
                              )}
                              onChange={(event) => {
                                const powerId = power.id;
                                if (event.target.checked) {
                                  setFieldValue('powers', [
                                    ...values.powers,
                                    { id: powerId, strength: 'Strong' },
                                  ]);
                                } else {
                                  setFieldValue(
                                    'powers',
                                    values.powers.filter((powerItem) => powerItem.id !== powerId)
                                  );
                                }
                              }}
                              name={`power_${power.id}`}
                            />
                          }
                          label={power.name}
                        />

                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <InputLabel>Strength:</InputLabel>
                          </Grid>
                          <Grid item xs={6}>
                            <Select
                              value={
                                values.powers.find((selectedPower) => selectedPower.id === power.id)
                                  ?.strength || 'Strong'
                              }
                              onChange={(event) => {
                                const powerId = power.id;
                                const selectedStrength = event.target.value;
                                setFieldValue(
                                  'powers',
                                  values.powers.map((powerItem) => {
                                    if (powerItem.id === powerId) {
                                      return { id: powerId, strength: selectedStrength };
                                    }
                                    return powerItem;
                                  })
                                );
                              }}
                            >
                              <MenuItem value="Strong">Strong</MenuItem>
                              <MenuItem value="Weak">Weak</MenuItem>
                              <MenuItem value="Average">Average</MenuItem>
                            </Select>
                          </Grid>
                        </Grid>
                      </div>
                    ))}
                  </FormGroup>
                </div>

                <Button type="submit" variant="contained" color="primary">
                  Create Superhero
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NewHero;
