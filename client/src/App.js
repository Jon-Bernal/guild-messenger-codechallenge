import { useContext } from "react";
import { GlobalContext } from "./context/GlobalContext";
import "./App.css";

// ----- Components ----- //
import { Toaster } from "react-hot-toast";
import Login from "./components/Login/Login";
import CurrentConvo from "./components/CurrentConvo/CurrentConvo";
import ConvoInput from "./components/ConvoInput/ConvoInput";
import Selectconvo from "./components/SelectConvo/SelectConvo";

function App() {
  const { globalState } = useContext(GlobalContext);
  const { loggedIn } = globalState;

  return (
    <div className="App">
      <Login />
      {loggedIn && (
        <>
          <div style={{ minHeight: "100vh", display: "flex" }}>
            <Selectconvo />
            <div
              style={{
                flexGrow: "1",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CurrentConvo />
              <ConvoInput />
            </div>
          </div>
        </>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
