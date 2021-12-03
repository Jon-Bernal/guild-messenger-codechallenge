import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";

const Currentconvo = () => {
  const { globalState, globalDispatcher, ws } = useContext(GlobalContext);
  const { username, loggedIn, convoInput, convo } = globalState;

  return (
    <div>
      <ul id="messages">
        {convo &&
          convo.map((m, idx) => {
            return (
              <li key={idx} data-mine={`${m.username === username}`}>
                <p className="messageUserLabel">{m.username}:</p>
                <p>{m.msg}</p>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Currentconvo;
