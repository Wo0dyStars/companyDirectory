import Overview from "./Overview";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Employee from "./Employee";
import AddEmployee from "./AddEmployee";
import Locations from "./Locations";
import Departments from "./Departments";

const App = () =>  (
    <Router>
      <div className="container">
        <Switch>
          <Route exact path="/" render={(props) => <Overview {...props} />} />
          <Route exact path="/locations" render={(props) => <Locations {...props} />} />
          <Route exact path="/departments" render={(props) => <Departments {...props} />} />
          <Route exact path="/employee/new" render={(props) => <AddEmployee {...props} />} />
          <Route path="/employee/:index" render={(props) => <Employee {...props} />} />
        </Switch>
      </div>
    </Router>
);

export default App;
