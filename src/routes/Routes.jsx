import { Route, Switch } from 'react-router-dom';
import Generate from '../pages/generate.jsx'
import Coord from '../pages/coord';
import Teste from '../pages/teste'
import InputFile from '../pages/inputfile.jsx';

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={ Generate } />
      <Route exact path="/coord" component={ Coord } />
      <Route exact path="/teste" component={ Teste } />
      <Route exact path="/inputfile" component={ InputFile } />
    </Switch>
  )
}

export default Routes;