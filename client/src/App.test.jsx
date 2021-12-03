import { useReducer } from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import {
  GlobalProvider,
  GlobalContext,
  initState,
} from "./context/GlobalContext";

// Integration tests
test("renders login form on startup", () => {
  render(
    <GlobalProvider>
      <App />
    </GlobalProvider>
  );
  const loginButton = screen.getByText(/Login/i);
  expect(loginButton).toBeInTheDocument();
});

test("renders userlist when loggedin", () => {
  initState.userList = [
    { username: "tester", userID: "012345678910" },
    { username: "tester2", userID: "012345678911" },
  ];
  initState.convoPartner = "012345678910";
  initState.loggedIn = true;
  initState.userID = "123123123123";

  render(
    <GlobalProvider testing={initState}>
      <App />
    </GlobalProvider>
  );
  const user1 = screen.getByText("tester");
  expect(user1).toBeInTheDocument();
});
