import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./router";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProgressProvider } from "./configs/ProgressContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ProgressProvider>
          <Router></Router>
          <ToastContainer />
        </ProgressProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
