import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import './App.css';
import initauth from './Firebase/firebase.init';

initauth();

const googleprovider = new GoogleAuthProvider();
const githubprovider = new GithubAuthProvider();

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState({})
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);

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
    e.preventDefault();
    console.log(email, password);
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;

    }
    // if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/) {
    //   setError('Password Must Contain 2 Upper case')
    //   return;
    // }

    if (isLogin) {
      processLogin(email, password);

    }
    else {
      creatNewUser(email, password);
    }
  }
  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
      })
      .catch(error => {
        setError(error.message);
      })

  }
  const handelEmailChange = e => {
    setEmail(e.target.value);
  }
  const handelPasswordChange = e => {
    setPassword(e.target.value);
  }
  const toggleLogin = e => {
    setIsLogin(e.target.checked);
  }
  const creatNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
        verifyEmail();
      })
      .catch(error => {
        setError(error.message);
      })
  }
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result);
      })
  }
  const handelResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => { })
  }
  return (
    <div className="mx-5 mt-5">
      {!user.name ?
        <div>
          <form onSubmit={handelRegistration}>
            <h3 className="text-primary">Please {isLogin ? 'Login' : 'Registert'}</h3>
            <div className="row mb-3">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
              <div className="col-sm-10">
                <input onBlur={handelEmailChange} type="email" className="form-control" id="inputEmail3" required />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
              <div className="col-sm-10">
                <input onBlur={handelPasswordChange} type="password" className="form-control" id="inputPassword3" required />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-10 offset-sm-2">
                <div className="form-check">
                  <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1" />
                  <label className="form-check-label" htmlFor="gridCheck1">
                    Already Registered?
                  </label>
                </div>
              </div>
            </div>
            <div className="row mb-3 text-danger">{error}</div>
            <button onClick={handelResetPassword} type="submit" className="btn btn-primary">{isLogin ? 'Login' : 'Register'}</button>
            <button type="button" className="mx-4 btn btn-primary btn-sm">Reset Password</button>
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
