import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./router";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router></Router>
        <ToastContainer />
      </PersistGate>
    </Provider>
  </StrictMode>
);
