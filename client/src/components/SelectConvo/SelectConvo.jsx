import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";

const Selectconvo = () => {
  const { globalState, globalDispatcher } = useContext(GlobalContext);
  const {
    username,
    userID,
    pass,
    loggedIn,
    convoInput,
    convo,
    userList,
    convoPartner,
  } = globalState;

  console.log("userList :>> ", userList);

  return (
    <div>
      {userList.map((u) => {
        console.log("u :>> ", u);
        return (
          <p
            onClick={() => {
              globalDispatcher({ type: "set convoPartner", userID: u.userID });
            }}
            style={{
              width: "100%",
              padding: "6px 10px",
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              background: `${convoPartner === u.userID ? "#0088ff" : "none"}`,
            }}
            key={u.userID}
          >
            {u.username}
          </p>
        );
      })}
    </div>
  );
};

export default Selectconvo;
