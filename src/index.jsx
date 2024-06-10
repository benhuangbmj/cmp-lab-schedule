import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";

const logError = (error, info) => {
  console.log(error, info);
};

function fallbackRender({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <ErrorBoundary fallbackRender={fallbackRender} onError={logError}>
        <App />
      </ErrorBoundary>
    </Provider>
  </BrowserRouter>,
);
