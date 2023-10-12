import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import HeroDetails from './HeroDetails';
import NewHero from './NewHero';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/hero/:id" component={HeroDetails} />
        <Route path="/new-hero" component={NewHero} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
