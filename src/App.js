import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut } from 'firebase/auth';
import { useState } from 'react';
import './App.css';
import initauth from './Firebase/firebase.init';

initauth();

const googleprovider = new GoogleAuthProvider();
const githubprovider = new GithubAuthProvider();

function App() {
  const [user, setUser] = useState({})
  const auth = getAuth();
  const handleGoogleSignIn = () => {

    signInWithPopup(auth, googleprovider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const logedInUser = {
          name: displayName,
          email: email,
          photo: photoURL
        };
        setUser(logedInUser);
      })
      .catch(error => {
        console.log(error.message);
      })

  }

  const handleGithubSignIn = () => {
    signInWithPopup(auth, githubprovider)
      .then(result => {
        const { displayName, photoURL, email } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(loggedInUser);
      })
  }
  const handlesignOut = () => {
    signOut(auth)
      .then(() => {
        setUser({});
      })
  }
  const handelRegistration = e => {
    console.log("reg");
    e.preventDefault();
  }
  return (
    <div className="App">
      {!user.name ?
        <div>
          <form onSubmit={handelRegistration}>
            <h3>Please Sign up</h3>
            <label htmlFor="email">Email:</label>
            <input type="text" naem="email" />
            <br />
            <label htmlFor="password">Password:</label>
            <input type="password" naem="password" id="" />
            <br />
            <input type="submit" value="Register" />
          </form>
          <br /><br /><br />
          <div>------------------------------------------------------</div>
          <button onClick={handleGoogleSignIn}>google sign in</button>
          <button onClick={handleGithubSignIn}>Github sign in</button>
        </div> :
        <button onClick={handlesignOut}>Sign Out</button>}
      <br />
      {
        user.name && <div>
          <h2>welcome {user.name}
            <p>Your email : {user.email}</p>
            <img src={user.photo} alt="" />
          </h2>
        </div>
      }
    </div>
  );
}


export default App;
