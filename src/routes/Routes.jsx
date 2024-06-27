import { Route, Switch } from 'react-router-dom';
import Generate from '../pages/generate.jsx'
import Coord from '../pages/coord';
import Teste from '../pages/teste'

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={ Generate } />
      <Route exact path="/coord" component={ Coord } />
      <Route exact path="/teste" component={ Teste } />
    </Switch>
  )
}

export default Routes;