import Overview from "./Overview";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Employee from "./Employee";

const App = () =>  (
    <Router>
      <div className="App-ok">
        <Switch>
          <Route exact path="/" render={(props) => <Overview {...props} />} />
          <Route exact path="/employee/:index" render={(props) => <Employee {...props} />} />
        </Switch>
      </div>
    </Router>
);

export default App;
