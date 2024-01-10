import { UserContext } from "./UserProvider";
import RegisterAndLoginForm from "./components/Register/RegisterAndLoginForm";
import { useContext } from "react";
import Chat from "./components/Chat/Chat";

export function Routes() {
    const { username, id } = useContext(UserContext);

    if (username) {
        // return `logged in ${username}`;
        return <Chat />;
    } else {
        return <RegisterAndLoginForm />;
    }
}
