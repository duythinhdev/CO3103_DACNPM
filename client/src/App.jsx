import axios from "axios";
import {UserContextProvider} from "./context/user/UserContext.jsx";
import Routes from "./router/Routes.jsx";

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_APP_REST_URL;
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}

export default App
