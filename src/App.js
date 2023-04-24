import {
  BrowserRouter as Router,
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/profits" element={<ProfitsUsers />} />
        <Route path="/tariff" element={<Tariff />} />
        <Route path="/evaluation" element={<Evaluation />} />
      </Routes>
    </Router>
  );
}

export default App;
