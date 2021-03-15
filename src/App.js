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
    photo: '',
  });
  const handleSignIN = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((response) => {
        const { displayName, email, photoURL } = response.user;
        const signedInUser = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signedInUser);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };
  return (
    <div className="App">
      <button onClick={handleSignIN}>Sign In</button>
      {user.isSignIn && (
        <div>
          <h2>{user.name}</h2>
          <h3>YOur email : {user.email}</h3>
          <img src={user.photo} alt="" />
        </div>
      )}
    </div>
  );
}

export default App;
