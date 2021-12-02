import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";

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
        </form>
      </div>
    );
  } else {
    return null;
  }
};

export default Login;
