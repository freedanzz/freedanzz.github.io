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
import { useEffect } from "react";
import { deleteToken, getMessaging, getToken, onMessage } from "firebase/messaging";

import app from './firebase';


function App() {
  useEffect(() => {
    const messaging = getMessaging(app);
    // Add the public key generated from the console here.
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission reject.');
      }
    });
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // ...
    });
  }, []);
  return (
    <>
      <Router>
        <Routes>
          {/*<Route path="/users" element={<UsersPage />} />*/}
          {/*<Route path="/profits" element={<ProfitsUsers />} />*/}
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
    </>
  );
}

export default App;
