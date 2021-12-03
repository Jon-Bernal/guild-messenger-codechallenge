import { render, screen, useReducer, renderHook } from "@testing-library/react";
import {
  GlobalContext,
  initState,
  globalReducer,
} from "../../context/GlobalContext";
import Selectconvo from "./SelectConvo";

initState.userList = [
  { username: "tester", userID: "012345678910" },
  { username: "tester2", userID: "012345678911" },
];
initState.convoPartner = "012345678910";

test("selectConvo renders user list", () => {
  render(
    <GlobalContext.Provider value={{ globalState: initState }}>
      <Selectconvo />
    </GlobalContext.Provider>
  );
  const tester = screen.getByText("tester");
  expect(tester).toBeInTheDocument();
  const tester2 = screen.getByText("tester2");
  expect(tester2).toBeInTheDocument();
});
