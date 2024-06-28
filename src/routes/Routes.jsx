import { Route, Switch } from 'react-router-dom';
import Generate from '../pages/generate.jsx'
import Coord from '../pages/coordinates.jsx';



function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={ Coord } />
      <Route exact path="/generate" component={ Generate } />
     
    </Switch>
  )
}

export default Routes;