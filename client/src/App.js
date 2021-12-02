import { useContext } from "react";
import "./App.css";
import { GlobalContext } from "./context/GlobalContext";

// ----- Components ----- //
import Login from "./components/Login/Login";
import CurrentConvo from "./components/CurrentConvo/CurrentConvo";
import ConvoInput from "./components/ConvoInput/ConvoInput";

function App() {
  const { globalState, globalDispatcher, ws } = useContext(GlobalContext);
  const { username, loggedIn, convoInput, convo } = globalState;

  console.log("loggedIn :>> ", loggedIn);

  return (
    <div className="App">
      <Login />
      {loggedIn && (
        <>
          <CurrentConvo />
          <ConvoInput />
        </>
      )}
    </div>
  );
}

export default App;
