import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store.ts";
import { CssBaseline } from "@mui/material";
import "./styles/styles.css";
import { AuthWrapper } from "./components/AuthWrapper.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthWrapper>
        <CssBaseline />
        <App />
      </AuthWrapper>
    </Provider>
  </StrictMode>
);
