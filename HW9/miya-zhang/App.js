import logo from "./logo.svg";
import "./App.css";

import { Provider } from "react-redux";
import store from "./store";
import ReduxCounter from "./ReduxCounter";

function App() {
  return (
    /*
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello, this is my first React app!</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

*/

    <Provider store={store}>
      <ReduxCounter />
    </Provider>
  );
}

export default App;
