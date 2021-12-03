import { render, screen } from "@testing-library/react";
import { GlobalContext, initState } from "../../context/GlobalContext";
import CurrentConvo from "./CurrentConvo";

initState.convo = [
  { username: "tester1", userID: "012345678910", msg: "message1" },
  { username: "tester2", userID: "012345678911", msg: "message2" },
];
initState.username = "tester1";

test("currentConvo renders multiple messages", () => {
  render(
    <GlobalContext.Provider value={{ globalState: initState }}>
      <CurrentConvo />
    </GlobalContext.Provider>
  );
  const msg1 = screen.getByText("message1");
  expect(msg1).toBeInTheDocument();
  const user1 = screen.getByText(/tester1/);
  expect(user1).toBeInTheDocument();

  const msg2 = screen.getByText("message2");
  expect(msg2).toBeInTheDocument();
  const user2 = screen.getByText(/tester2/);
  expect(user2).toBeInTheDocument();
});
