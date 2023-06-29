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
import LoginPage from "./Pages/Login";
import Home from "./Pages/Dancer/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/profits" element={<ProfitsUsers />} />
        <Route path="/tariff" element={<Tariff />} />
        <Route path="/evaluation" element={<Evaluation />} />
        {/**
         *  Pages Dancers
         */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path='*' exact={true} element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;
