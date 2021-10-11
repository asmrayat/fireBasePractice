import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';

const initauth = () => {
    initializeApp(firebaseConfig);
}

export default initauth;