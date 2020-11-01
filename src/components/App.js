import Overview from "./Overview";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Employee from "./Employee";
import AddEmployee from "./AddEmployee";
import Navigation from "./Navigation";

const App = () =>  (
    <Router>
      <div className="container">
        <Switch>
          <Route exact path="/" render={(props) => <Overview {...props} />} />
          <Route exact path="/employee/new" render={(props) => <AddEmployee {...props} />} />
          <Route path="/employee/:index" render={(props) => <Employee {...props} />} />
        </Switch>
      </div>
    </Router>
);

export default App;
