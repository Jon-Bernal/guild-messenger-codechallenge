import { useEffect, useReducer } from "react";
import "./App.css";
import { w3cwebsocket as w3cws } from "websocket";

// Create websocket connection
const ws = new w3cws("ws://127.0.0.1:5000");

// const socket = new WebSocket("ws://localhost:5000/chat", "chatOne");

function reducer(state, action) {
  switch (action.type) {
    case "set pass":
      return {
        ...state,
        pass: action.pass,
      };
    case "set username":
      return {
        ...state,
        username: action.username,
      };
    case "login successful":
      return {
        ...state,
        loggedIn: true,
        pass: "",
      };
    case "login failed":
      return {
        ...state,
        loggedIn: false,
        loginError: action.errMsg,
      };
    case "log out":
      return {
        ...initState,
      };
    case "change convo input":
      return {
        ...state,
        convoInput: action.string,
      };
    case "sent convo message":
      return {
        ...state,
        convoInput: "",
      };
    case "received msg":
      return {
        ...state,
        convo: [...state.convo, action.msg],
        convoInput: "",
      };
    default:
      return state;
  }
}

const initState = {
  username: "",
  pass: "",
  loggedIn: "",
  convo: [],
  convoInput: "",
};

function App() {
  // TODO: Soon to be global state
  const [state, dispatcher] = useReducer(reducer, initState);

  const { username, pass, loggedIn, convoInput, convo } = state;

  // ============== Login Stuff ============ //

  function login({ username, pass }) {
    if (username && pass) {
      // reset username and pass fields
      dispatcher({ type: "login successful" });
    } else {
      dispatcher({ type: "login failed" });
    }
  }
  function logout() {
    // reset everything here!
    dispatcher({ type: "log out" });
  }

  // ============== Chat Websocket Stuff ============ //

  function updateConvo(msg) {
    console.log("New msg :>> ", msg);
    dispatcher({ type: "received msg", msg });
  }

  useEffect(() => {
    // confirm websocket connection
    ws.onopen = (websocketInfo) => {
      console.log("websocket connected");
      // TODO: enable messaging here, otherwise it will be shouting in the void
    };

    // when receiving message
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log("Reply: ", data);
      if (data.type === "message") {
        updateConvo({ msg: data.msg, user: data.user });
      }
    };

    return () => {
      // close websocket connection
      ws.close(1000);
    };
  }, []);

  useEffect(() => {
    console.log("convo :>> ", convo);
  }, [convo]);

  function sendMessage(string) {
    ws.send(
      JSON.stringify({
        type: "message",
        msg: string,
        user: username,
        // Todo: chat id
        // Todo: set this type of info in context
      })
    );
    dispatcher({ type: "sent convo message" });
  }
  // ============== Chat Selection Stuff ============ //

  // ============== Login JSX ============ //
  if (!loggedIn) {
    return (
      <div className="App">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login({ username, pass });
          }}
        >
          <input
            type="text"
            value={username}
            onChange={(e) =>
              dispatcher({ type: "set username", username: e.target.value })
            }
          />
          <input
            type="password"
            value={pass}
            onChange={(e) =>
              dispatcher({ type: "set pass", pass: e.target.value })
            }
          />
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
  }

  // ============== Chat Selection JSX ============ //

  // ============== Chat JSX ============ //
  return (
    <div className="App">
      <ul id="messages">
        {convo &&
          convo.map((m, idx) => {
            return <li key={idx}>{m.msg}</li>;
          })}
      </ul>
      <form
        id="form"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(convoInput);
        }}
      >
        <input
          id="input"
          autoComplete="off"
          value={convoInput}
          onChange={(e) => {
            e.preventDefault();
            dispatcher({ type: "change convo input", string: e.target.value });
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            sendMessage(convoInput);
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
