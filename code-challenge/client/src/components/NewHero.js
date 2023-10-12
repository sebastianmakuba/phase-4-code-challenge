import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Container, Card, CardContent, Typography, FormControl, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

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

  const handleSubmit = (values, { setSubmitting }) => {
    fetch('http://localhost:5500/heroes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('New hero created:', data);
      })
      .catch((error) => {
        console.error('Error creating hero:', error);
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
                  <FormControl component="fieldset">
                    <FormGroup>
                      {powers.map((power) => (
                        <FormControlLabel
                          key={power.id}
                          control={
                            <Checkbox
                              checked={values.powers.includes(power.id)}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  setFieldValue('powers', [...values.powers, power.id]);
                                } else {
                                  setFieldValue('powers', values.powers.filter((id) => id !== power.id));
                                }
                              }}
                              name={`power_${power.id}`}
                            />
                          }
                          label={power.name}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
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
