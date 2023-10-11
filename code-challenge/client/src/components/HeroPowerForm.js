import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";

function HeroPowerForm() {
  const history = useHistory();
  const [heroes, setHeroes] = useState([]);
  const [powers, setPowers] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5500/heroes")
      .then((response) => response.json())
      .then((data) => {
        setHeroes(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5500/powers")
      .then((response) => response.json())
      .then((data) => setPowers(data));
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Formik
      initialValues={{
        hero_id: "",
        power_id: "",
        strength: "",
      }}
      onSubmit={(values) => {
        fetch("http://127.0.0.1:5500/hero_powers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((response) => {
            if (response.ok) {
              history.push(`http://127.0.0.1:5500/heroes/${values.hero_id}`);
            } else {
              response.json().then((err) => setFormErrors(err.errors));
            }
          });
      }}
    >
      <Form>
        <Typography variant="h4">Create Hero Power</Typography>
        <FormControl>
          <InputLabel htmlFor="hero_id">Select a Hero</InputLabel>
          <Field as={Select} name="hero_id" id="hero_id">
            <MenuItem value="" disabled>
              Select a hero
            </MenuItem>
            {heroes.map((hero) => (
              <MenuItem key={hero.id} value={hero.id}>
                {hero.name}
              </MenuItem>
            ))}
          </Field>
          <ErrorMessage name="hero_id" component="div" style={{ color: "red" }} />
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="power_id">Select a Power</InputLabel>
          <Field as={Select} name="power_id" id="power_id">
            <MenuItem value="" disabled>
              Select a power
            </MenuItem>
            {powers.map((power) => (
              <MenuItem key={power.id} value={power.id}>
                {power.name}
              </MenuItem>
            ))}
          </Field>
          <ErrorMessage name="power_id" component="div" style={{ color: "red" }} />
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="strength">Strength</InputLabel>
          <Field as={Select} name="strength" id="strength">
            <MenuItem value="Strong">Strong</MenuItem>
            <MenuItem value="Weak">Weak</MenuItem>
            <MenuItem value="Average">Average</MenuItem>
          </Field>
          <ErrorMessage name="strength" component="div" style={{ color: "red" }} />
        </FormControl>

        {formErrors.length > 0 &&
          formErrors.map((error) => (
            <Typography key={error} variant="body1" style={{ color: "red" }}>
              {error}
            </Typography>
          ))}

        <Button type="submit" variant="contained" color="primary">
          Create Hero Power
        </Button>
      </Form>
    </Formik>
  );
}

export default HeroPowerForm;
