import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Evaluation from "./Pages/Evaluation";
import ProfitsUsers from "./Pages/ProfitsUsers";
import Tariff from "./Pages/Tariff";
import UsersPage from './Pages/UsersPage';

/**
 * 
 * @returns Styles
 */

import '../src/Styles/Global.scss';
import Page404 from "./Pages/404Page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/profits" element={<ProfitsUsers />} />
        <Route path="/tariff" element={<Tariff />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path='*' exact={true} element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;
