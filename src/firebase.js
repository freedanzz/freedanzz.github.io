import { initializeApp } from 'firebase/app';
import { firebaseConfig as FBC } from './firebase.config';

const firebaseConfig = {
  ...FBC
};

const app = initializeApp(firebaseConfig);

export default app;