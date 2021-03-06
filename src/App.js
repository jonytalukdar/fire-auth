import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebase.config';
import { useState } from 'react';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false,
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
  const handleSingOut = () => {
    firebase
      .auth()
      .signOut()
      .then((response) => {
        const singOutUser = {
          isSignIn: false,
          name: '',
          email: '',
          photo: '',
        };
        setUser(singOutUser);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleSubmit = (e) => {
    // console.log(user.email, user.password);

    if (newUser && user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((response) => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
        })

        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  };

  if (!newUser && user.email && user.password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        // Signed in
        const newUserInfo = { ...user };
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
      })
      .catch((error) => {
        const newUserInfo = { ...user };
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
  }

  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  };

  return (
    <div className="App">
      {user.isSignIn ? (
        <button onClick={handleSingOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIN}>Sign In</button>
      )}
      {user.isSignIn && (
        <div>
          <h2>{user.name}</h2>
          <h3>YOur email : {user.email}</h3>
          <img src={user.photo} alt="" />
        </div>
      )}
      <h1>Our own authentication</h1>
      <input
        type="checkbox"
        onChange={() => setNewUser(!newUser)}
        name="newUser"
      />
      <label htmlFor="newUser">New User Sing Up</label>
      <form onSubmit={handleSubmit}>
        {newUser && (
          <input
            type="text"
            name="name"
            id=""
            onBlur={handleBlur}
            placeholder="your name"
          />
        )}
        <br />
        <input
          type="text"
          name="email"
          onBlur={handleBlur}
          placeholder="Write Your Email Address"
          required
        />
        <br />
        <input
          type="password"
          name="password"
          onBlur={handleBlur}
          placeholder="Password"
          required
        />
        <br />
        <input type="submit" value="submit" />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      <p style={{ color: 'green' }}>{user.success}</p>
      {user.success && (
        <p style={{ color: 'green' }}>
          User {newUser ? 'Created' : 'Logged In'} Successfully
        </p>
      )}
    </div>
  );
}

export default App;
