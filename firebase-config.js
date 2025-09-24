// firebase-config.js
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI", // 🔑 Obter no Firebase Console
  authDomain: "SEU_PROJETO_ID.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO_ID-default-rtdb.firebaseio.com/", // 🔑 URL do seu banco
  projectId: "SEU_PROJETO_ID"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
