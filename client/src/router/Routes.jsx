import RegisterAndLoginForm from "../pages/Register/RegisterAndLoginForm.jsx";
import {useContext} from "react";
import {UserContext} from "../context/user/UserContext.jsx";
import Chat from "../pages/Chat/Chat.jsx";

export default function Routes() {
  const {username, id} = useContext(UserContext);

  if (username) {
    return <Chat />;
  }

  return (
    <RegisterAndLoginForm />
  );
}