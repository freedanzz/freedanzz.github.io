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
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import app from './firebase';


function App() {
  useEffect(() => {
    const messaging = getMessaging(app);
    const subscribeToTopic = async () => {
      try {
        const token = await messaging.getToken({ vapidKey: 'TU_VAPID_KEY' });
        const response = await fetch(
          `https://iid.googleapis.com/iid/v1/${token}/rel/topics/MI_TEMA`,
          {
            method: 'POST',
            headers: {
              Authorization: `key=TU_CLAVE_DEL_SERVIDOR`,
            },
          }
        );

        if (response.ok) {
          console.log('Suscripción al tema exitosa');
        } else {
          throw new Error('Error al suscribirse al tema');
        }
      } catch (error) {
        console.error('Error al suscribirse al tema:', error);
      }
    };

    // Add the public key generated from the console here.
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        getToken(messaging, { vapidKey: 'BJPzWOTY8OE7mFckOcdgOEl5Y7Bve4xzOA1C-BkH_ylerDf7-gEDyuTTCxe86VtVzuje356ZWXjOHgiNE76-ybw' }).then((currentToken) => {
          if (currentToken) {
            const topic = 'freedanz';
            console.log("Token", currentToken);
            const isSubscribed = currentToken.startsWith('/topics/freedanz');
            if (isSubscribed) {
              console.log('El dispositivo está suscrito al tema');
            } else {
              console.log('El dispositivo NO está suscrito al tema');
            }
            try {
              fetch(`https://iid.googleapis.com/iid/v1/${currentToken}/rel/topics/${topic}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer AAAAOiEZ5tM:APA91bF3Zqtu7Phnq-ZZbHqHm3KV0S_pFuOPY5mwWD_uwhMy0uktTZRzwXzrq_z7fAYvs9zEDPCVmyXI2OYm2f2MWh5we5AX57Zcx1U2nN2-fOoBLP1vPZQ_6LtR1IYrV40Jrj3cEoHY' // Replace with your FCM server key
                }
              });
              console.log("Suscrito");
            } catch (error) {
              console.log("Topic", error);
            }
          } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          // ...
        });
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
