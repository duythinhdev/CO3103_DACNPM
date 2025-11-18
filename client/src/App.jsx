import axios from "axios";
import {UserContextProvider} from "./context/user/UserContext.jsx";
import Routes from "./router/Routes.jsx";

function App() {
  axios.defaults.baseURL = 'http://localhost:7777';
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}

export default App
