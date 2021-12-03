import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import { baseURL } from "../../config/clientConfig";
import toast from "react-hot-toast";

// import bcrypt from "bcrypt";

const Login = () => {
  const { globalState, globalDispatcher } = useContext(GlobalContext);
  const { username, pass, loggedIn } = globalState;

  async function login({ username, pass }) {
    if (username && pass) {
      try {
        const response = await axios.post(`${baseURL}/auth/login`, {
          username: username,
          pass: pass,
        });
        if (response?.data?.userID) {
          globalDispatcher({
            type: "login successful",
            userID: response.data.userID,
            username: response.data.username,
          });
          return;
        }
      } catch (err) {
        toast.error(`login failed because of ${err}`);
        return;
      }
    }
    toast.error("login failed try again");
  }

  async function signup({ username, pass }) {
    if (username && pass) {
      try {
        const response = await axios.post(`${baseURL}/auth/signup`, {
          username: username,
          pass: pass,
        });

        if (response?.data?.userID) {
          globalDispatcher({
            type: "login successful",
            userID: response.data.userID,
            username: username,
          });
          return;
        }
        toast.error(`Error: ${response.data.error}`);
      } catch (err) {
        toast.error(`Error: ${err}`);
      }
    } else {
      toast.error("Please fill in both fields");
    }
  }

  // ============== Login Stuff ============ //

  // function logout() {
  //   // reset everything here!
  //   globalDispatcher({ type: "log out" });
  // }

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
