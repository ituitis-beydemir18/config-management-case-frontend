import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './styles/main.css'; // Ana CSS dosyasını import edin
import { initializeApp } from "firebase/app"; // Firebase'i içe aktarın
import { firebaseConfig } from './firebaseConfig'; // Firebase yapılandırmasını içe aktarın

// Firebase'i başlatın
initializeApp(firebaseConfig);

const auth = getAuth();

let app;
onAuthStateChanged(auth, user => {
  if (!app) {
    app = createApp(App);
    app.use(router);
    app.mount('#app');
  }

  if (user) {
    router.push('/home');
  } else {
    router.push('/');
  }
});




