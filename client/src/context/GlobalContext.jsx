import React, { createContext, useReducer, useEffect } from "react";

// Websocket connection
import { w3cwebsocket as w3cws } from "websocket";
import { baseWebsocketURL } from "../config/clientConfig";
const ws = new w3cws(baseWebsocketURL);

export const GlobalContext = createContext();

const initState = {
  username: "",
  pass: "",
  loggedIn: "",
  convo: [],
  convoInput: "",
};

const globalReducer = (state, action) => {
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
};

export const GlobalProvider = (props) => {
  const [globalState, globalDispatcher] = useReducer(globalReducer, initState);
  const { username, pass, loggedIn, convoInput, convo } = globalState;

  // ============== Chat Websocket Stuff ============ //

  function updateConvo(msg) {
    console.log("New msg :>> ", msg);
    globalDispatcher({ type: "received msg", msg });
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

  return (
    <GlobalContext.Provider value={{ globalDispatcher, globalState, ws }}>
      {props.children}
    </GlobalContext.Provider>
  );
};
