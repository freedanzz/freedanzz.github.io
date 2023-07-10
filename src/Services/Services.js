import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, doc, getDocs, getDoc, collection, query, where } from 'firebase/firestore';
import { firebaseConfig } from '../firebase.config';

class Services {

  connectFirebase = async () => {
    const app = initializeApp(firebaseConfig);
    return app;
  }

  connectDatabaseFirebase = async (connection) => {
    const db = getFirestore(connection);
    return db;
  }

  addUserDB = async (db, names, level) => {
    await addDoc(collection(db, "dancers"), {
      names: names,
      level: level
    });
  }

  addEvaluationDB = async (db, data) => {
    await addDoc(collection(db, "scores"), {
      ...data
    });
  }

  getDancersToday = async (db, date) => {
    const queryScore = query(collection(db, "scores"), where("date", "==", date));
    const querySnapshot = await getDocs(queryScore);
    return querySnapshot;
  }

  getDancer = async (db, id_dancer) => {
    const dancer = await getDoc(doc(db, "dancers", id_dancer));
    return dancer.data();
  }

  getDancersDB = async (db) => {
    const getDancers =  await getDocs(collection(db, 'dancers'));
    return getDancers;
  }

  getUserLoginDB = async (db, username) => {
    const queryScore = query(collection(db, "dancers"), where("username", "==", username));
    const querySnapshot = await getDocs(queryScore);
    return querySnapshot;
  }

}

export default Services;