import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { firebaseConfig } from './firebase.config';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export default messaging;