import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    photoUrl: '',
  });
  const handleSignIN = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((response) => {
        setUser(response.user);
      });
  };
  return (
    <div className="App">
      <button onClick={handleSignIN}>Sign In</button>
      {user.map((user) => (
        <div>
          <h1>{user.displayName}</h1>
        </div>
      ))}
    </div>
  );
}

export default App;
