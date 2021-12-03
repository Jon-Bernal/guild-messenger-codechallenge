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

  render(
    <GlobalContext.Provider value={{ globalState: initState }}>
      <App />
    </GlobalContext.Provider>
  );
  const user1 = screen.getByText("tester");
  expect(user1).toBeInTheDocument();
});
