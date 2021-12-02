import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";

const Convoinput = () => {
  const { globalState, globalDispatcher, ws } = useContext(GlobalContext);
  const { username, convoInput } = globalState;

  function sendMessage(string) {
    if (string) {
      ws.send(
        JSON.stringify({
          type: "message",
          msg: string,
          user: username,
          // Todo: chat id
          // Todo: set this type of info in context
        })
      );
      globalDispatcher({ type: "sent convo message" });
    }
  }

  return (
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
          globalDispatcher({
            type: "change convo input",
            string: e.target.value,
          });
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
  );
};

export default Convoinput;
