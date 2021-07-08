import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./components/App";
import "./App.css";
import { createStore } from "redux";
import reducer from "./redux/reducers";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { ruRU } from "@material-ui/core/locale";
import "@fontsource/roboto";

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const theme = createMuiTheme(
  {
    palette: {
      //primary: { main: '#e0e0e0' },
    },
    typography: {
      fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      variantMapping: {
        div: "h2",
      },
    },
  },
  ruRU
);

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </ThemeProvider>,
  document.getElementById("root")
);