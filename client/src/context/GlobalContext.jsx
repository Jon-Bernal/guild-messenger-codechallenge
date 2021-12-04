import axios from "axios";
import React, { createContext, useReducer, useEffect } from "react";
import toast from "react-hot-toast";

// Websocket connection
import { w3cwebsocket as w3cws } from "websocket";
import { baseURL, baseWebsocketURL } from "../config/clientConfig";
let ws;

export const GlobalContext = createContext();

export const initState = {
  username: "",
  pass: "",
  loggedIn: "",
  convo: [],
  convoInput: "",
  userID: "",
  userList: [],
  convoPartner: "",
};

// Left this reducer super clear for you all to look through instead of making a single set field reducer.
// Hopefully this will make it easier to read and understand the different things this can do.
export const globalReducer = (state, action) => {
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
        username: action.username,
        userID: action.userID,
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
      if (
        action.msg.senderID === state.convoPartner ||
        action.msg.recipient === state.convoPartner
      ) {
        return {
          ...state,
          convo: [...state.convo, action.msg],
        };
      }
      return state;

    case "set userList":
      return {
        ...state,
        userList: action.userList,
      };

    case "set convoPartner":
      return {
        ...state,
        convoPartner: action.userID,
      };

    case "set convo":
      return {
        ...state,
        convo: action.convo,
      };

    default:
      return state;
  }
};

export const GlobalProvider = (props) => {
  const [globalState, globalDispatcher] = useReducer(
    globalReducer,
    props?.testing ? props.testing : initState
  );
  const { userID, loggedIn, convoPartner } = globalState;

  // ============== Chat Websocket Stuff ============ //

  function updateConvo(msg) {
    globalDispatcher({ type: "received msg", msg });
  }

  useEffect(() => {
    if (loggedIn) {
      ws = new w3cws(`${baseWebsocketURL}?id=${userID}`);

      // confirm websocket connection
      ws.onopen = (websocketInfo) => {
        console.log("websocket connected");
      };

      // when receiving message
      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.type === "message") {
          updateConvo({
            msg: data.msg,
            username: data.username,
            userID: data.userID,
            recipient: data.recipient,
          });
        }
      };

      return () => {
        // close websocket connection
        ws.close(1000);
      };
    }
  }, [loggedIn]);

  // fetch users for client side lookup when logged in
  //! This would be a server side search for a specific user if I had more time and this was really going to be a production app instead of sending everything to the client, which is a user info security no no (I know).
  useEffect(() => {
    if (loggedIn) {
      async function getUsers() {
        try {
          const res = await axios.get(`${baseURL}/users?userID=${userID}`);
          if (res?.data?.users) {
            // place users in searchable list
            globalDispatcher({
              type: "set userList",
              userList: res.data.users,
            });
          }
        } catch (err) {
          toast.error("User list broke, sorry! Try reloading");
        }
      }
      getUsers();
    }
  }, [loggedIn]);

  // fetch past conversation when user changes conversations
  useEffect(() => {
    if (convoPartner) {
      async function getConversation() {
        try {
          const res = await axios.post(`${baseURL}/convo`, {
            userID,
            convoPartner,
          });
          if (res?.data) {
            // place users in searchable list
            globalDispatcher({
              type: "set convo",
              convo: res.data.convo,
            });
          }
        } catch (err) {
          toast.error("Failed to load chat, try reloading.");
        }
      }
      getConversation();
    }
  }, [convoPartner]);

  return (
    <GlobalContext.Provider value={{ globalDispatcher, globalState, ws }}>
      {props.children}
    </GlobalContext.Provider>
  );
};
