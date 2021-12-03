import { useContext } from "react";
import toast from "react-hot-toast";
import { GlobalContext } from "../../context/GlobalContext";

const Convoinput = () => {
  const { globalState, globalDispatcher, ws } = useContext(GlobalContext);
  const { userID, convoInput, convoPartner, username } = globalState;

  function sendMessage(string, recipient) {
    if (string && convoPartner) {
      ws.send(
        JSON.stringify({
          type: "message",
          msg: string,
          userID: userID,
          username: username,
          recipient: recipient,
        })
      );
      globalDispatcher({ type: "sent convo message" });
    } else {
      if (!recipient) toast.error("Please select a recipient");
      if (!string) toast.error("You aren't sending anything");
    }
  }

  return (
    <form
      id="form"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(convoInput, convoPartner);
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
          sendMessage(convoInput, convoPartner);
        }}
      >
        Send
      </button>
    </form>
  );
};

export default Convoinput;
