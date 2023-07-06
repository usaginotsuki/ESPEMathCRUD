import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

loadFonts()

const firebaseConfig = {
  apiKey: "AIzaSyAdiYEpjASgd3vlzY_YZrbyePJeX8U6VvY",
  authDomain: "matbook-93511.firebaseapp.com",
  projectId: "matbook-93511",
  storageBucket: "matbook-93511.appspot.com",
  messagingSenderId: "385796186485",
  appId: "1:385796186485:web:8e6f5854325b46749db33c",
  measurementId: "G-ZCKBWBF9HP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')
