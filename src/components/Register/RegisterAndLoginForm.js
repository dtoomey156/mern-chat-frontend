import React from "react";
import styles from "./Register.module.css";
import axios from "axios";
import { UserContext } from "../../UserProvider";

function RegisterAndLoginForm() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoginOrRegister, setIsLoginOrRegister] =
        React.useState("register");
    const { setUsername: setLoggedInUsername, setId } =
        React.useContext(UserContext);

    async function handleSubmit(e) {
        e.preventDefault();
        const url = isLoginOrRegister === "register" ? "register" : "login";
        const { data } = await axios.post(url, { username, password });
        // after the user has logged in, sets user context
        setLoggedInUsername(username);
        setId(data.id);
        setUsername("");
        setPassword("");
    }

    return (
        <form onSubmit={handleSubmit} className={styles.registerForm}>
            <input
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                }}
                type="username"
                placeholder="Username"
                required
            ></input>
            <input
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
                type="password"
                placeholder="Password"
                required
            ></input>
            <button className={styles.button}>
                {isLoginOrRegister === "register" ? "Register" : "Login"}
            </button>
            <div>
                {isLoginOrRegister === "register" && (
                    <div>
                        Already a member?
                        <button onClick={() => setIsLoginOrRegister("login")}>
                            Login here
                        </button>
                    </div>
                )}

                {isLoginOrRegister === "login" && (
                    <div>
                        Don't have an account?
                        <button
                            onClick={() => setIsLoginOrRegister("register")}
                        >
                            Register
                        </button>
                    </div>
                )}
            </div>
        </form>
    );
}

export default RegisterAndLoginForm;
