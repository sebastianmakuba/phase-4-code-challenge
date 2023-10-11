import { Container, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./Header";
import Hero from "./Hero";
import Home from "./Home";
import HeroPowerForm from "./HeroPowerForm";
import Power from "./Power";
import PowerEditForm from "./PowerEditForm";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Header />
      <Container>
        <Switch>
          <Route exact path="/hero_powers/new">
            <HeroPowerForm />
          </Route>
          <Route exact path="/powers/:id/edit">
            <PowerEditForm />
          </Route>
          <Route exact path="/powers/:id">
            <Power />
          </Route>
          <Route exact path="/heroes/:id">
            <Hero />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
