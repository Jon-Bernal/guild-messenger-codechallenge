import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import { baseURL } from "../../config/clientConfig";

const Login = () => {
  const { globalState, globalDispatcher } = useContext(GlobalContext);
  const { username, pass, loggedIn } = globalState;

  function login({ username, pass }) {
    if (username && pass) {
      // reset username and pass fields
      globalDispatcher({ type: "login successful" });
    } else {
      globalDispatcher({ type: "login failed" });
    }
  }

  function signup({ username, pass }) {
    if (username && pass) {
      axios.post(`${baseURL}/login`, {
        body: { username: username, pass: pass },
      });
    }
  }

  // ============== Login Stuff ============ //

  function logout() {
    // reset everything here!
    globalDispatcher({ type: "log out" });
  }

  if (!loggedIn) {
    return (
      <div className="App">
        <form
          id="loginForm"
          onSubmit={(e) => {
            e.preventDefault();
            login({ username, pass });
          }}
        >
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) =>
                globalDispatcher({
                  type: "set username",
                  username: e.target.value,
                })
              }
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={pass}
              onChange={(e) =>
                globalDispatcher({ type: "set pass", pass: e.target.value })
              }
            />
          </label>
          <button
            onClick={(e) => {
              e.preventDefault();
              login({ username, pass });
            }}
          >
            Login
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              signup({ username, pass });
            }}
            style={{ marginTop: "20px", background: "#0c6" }}
          >
            Sign Up
          </button>
        </form>
      </div>
    );
  } else {
    return null;
  }
};

export default Login;
