import axios, { AxiosError } from "axios";
import styles from "../../styles/uWindow/uWin.module.css";
import { Form, redirect } from "react-router-dom";
import toast, { /*CheckmarkIcon*/ } from "react-hot-toast";
import { User } from "../../types/user.dto";
import { encryptUser } from "../../utils/login";
import FakeSpace from "./fakeSpace";
import { useState } from "react";

interface prop {
    WType: string;
}

export const loginAction = async ({request} : {request: Request}) => {
    const formData = await request.formData();
    const username = formData.get("uname");
    const password = formData.get("pw");

    try {
        let response = await axios.post("http://localhost:5000/login",{
            username: username,
            password: password
        });
        const status = response.data.status

        if (status !== "OK"){
            toast.error(
                "Nesprávné přihlašovací údaje!"
            );
            return null;
        }

        response = await axios.get("http://localhost:5000/get_user",{
            params:{
                username: username
            }
        })

        const loggedUser: User = response.data
        const encryptedUser = encryptUser(loggedUser)
        localStorage.setItem("loggedUser", encryptedUser)

        toast.success(
            "Přihlášení bylo úspěšné!", { icon: '✔' }
        );
        return redirect("/");
    } 
    catch (error) {
		const axiosError = error as AxiosError;
		if (axiosError.response) {
            toast.error(
                "Přihlášení bylo úspěšné!", { icon: '🚫' }
            );
            console.error(
                `The request was made and the server responded with a status code: ${axiosError.response.status}`
            );
            return null;
		}
        else if (axiosError.request) {
            toast.error(
                "Přihlášení bylo úspěšné!", { icon: '🚫' }
            );
            /* 
            throw new Error(
                `The request was made but no response was received!`
            );
            */
            console.error(
                "The request was made but no response was received!"
            );
            return null;
		}
        else {
            toast.error(
                "Přihlášení bylo úspěšné!", { icon: '🚫' }
            );
            console.error(
                `Something happened in setting up the request that triggered an Error: ${axiosError.message}`
            );
            return null;
		}
    }
}


export const registerAction = async ({request} : {request: Request}) => {
    const formData = await request.formData()
    const name = formData.get("fname");
    const surname = formData.get("lname");
    const username = formData.get("uname");
    const email = formData.get("email");
    const password = formData.get("pw");
    const passwordSec = formData.get("rpw");
    
    // checking if passwords are the same
    if (password != passwordSec) {
        toast.error(
            "Hesla se neshodují!",
            { icon: '❗' }
        );
        return null;
    }

    // This username is already taken by main admin
    if (username == "A") {
        console.error(
            "This username isn't allowed!"
        );
        return null;
    }

    // trying to compare data from the database
    try {
        // putting the data into the body for backend
        const body = {
            name: name,
            surname: surname,
            username: username,
            email: email,
            password: password
        };

        // console.log(body);

        // sanding the data to the backend
        await axios.post("http://localhost:5000/register", body, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        /*
        console.log(response.data);
        const status = response.data.status
        console.log(status)
        */

        toast.success(
            "Registrace byla úspěšná!", { icon: '✔' }
        );
        return redirect("/");
    }
    catch (error) {
		const axiosError = error as AxiosError;
		if (axiosError.response) {
            toast.error(
                "Registrace byla neúspěšná!", { icon: '❗' }
            );
            console.error(
                `The request was made and the server responded with a status code: ${axiosError.response.status}`
            );

            return null;
		}
        else if (axiosError.request) {
            toast.error(
                "Registrace byla neúspěšná!", { icon: '❗' }
            );
			/*
            throw new Error(
                `The request was made but no response was received!`
            );
            */
            console.error(
                `The request was made but no response was received!`
            );
            return null;
		}
        else {
            toast.error(
                "Registrace byla neúspěšná!", { icon: '❗' }
            );
            console.error(
                `Something happened in setting up the request that triggered an Error: ${axiosError.message}`
            );
            return null;
		}
	}
}

// This is the main component for the login and register window
const UWindow: React.FC<prop> = ({WType}) => {
    const [password, setPassword] = useState<string>("");
    const [passwordII, setPasswordII] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    
    // when user clicks on the login button
    if (WType === "login") {
        return (
            // login form
            <Form 
                method="POST"
                className={styles.UserForm}
            >
                <label 
                    htmlFor="uname" 
                    className={styles.TinForm}
                >
                    Uživatelské jméno:
                </label>
                <input 
                    type="text" 
                    className={styles.inForm} 
                    id="uname" 
                    name="uname" 
                    required
                />
                <label
                    htmlFor="pw" 
                    className={styles.TinForm}
                >
                    Heslo:
                </label>
                <input 
                    type={showPassword ? "text" : "password"} 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} 
                    className={styles.inForm} 
                    id="pw" 
                    name="pw" 
                    required
                />
                <input
                    className={styles.checkb}
                    id="check"
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword((prev) => !prev)}
                />
                <button
                    type="submit"
                    className={styles.bttn}
                >
                    Přihlásit
                </button>
            </Form>
        );
    }

    // when user clicks on the register button
    if (WType === "register") {
        return (
            // register form
            <>
                <Form
                    method="POST"
                    className={styles.UserForm}
                >
                    <label 
                        htmlFor="fname" 
                        className={styles.TinForm}
                    >
                        Jméno:
                    </label>
                    <input
                        type="text" 
                        className={styles.inForm} 
                        id="fname" 
                        name="fname" 
                        required
                    />
                    <label 
                        htmlFor="lname" 
                        className={styles.TinForm}
                    >
                        Příjmení:
                    </label>
                    <input 
                        type="text" 
                        className={styles.inForm} 
                        id="lname" 
                        name="lname" 
                        required
                    />
                    <label 
                        htmlFor="uname" 
                        className={styles.TinForm}
                    >
                        Uživatelské jméno:
                    </label>
                    <input 
                        type="text" 
                        className={styles.inForm} 
                        id="uname" 
                        name="uname" 
                        required
                    />
                    <label 
                        htmlFor="email" 
                        className={styles.TinForm}
                    >
                        Email:
                    </label>
                    <input
                        type="text" 
                        className={styles.inForm} 
                        id="email" 
                        name="email"
                    />
                    <label
                        htmlFor="pw" 
                        className={styles.TinForm}
                    >
                        Heslo:
                    </label>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        onChange={(e) => setPasswordII(e.target.value)} 
                        value={passwordII}
                        className={styles.inForm} 
                        name="pw" 
                        id="pw" 
                        required
                    />
                    <label 
                        htmlFor="rpw" 
                        className={styles.TinForm}
                    >
                        Znovu heslo:
                    </label>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password}
                        className={styles.inForm} 
                        id="rpw" 
                        name="rpw" 
                        required
                    />
                    <p 
                        className={styles.shadowText}
                    >
                        *Heslo musí obsahovat speciální znak, <br />
                        velké písmeno, číslo a mít víc jak 8 znaků.
                        <br/><br/>
                        Pro zobrazení hesla můžeš kliknout na sem.
                    </p>
                    <input
                        className={styles.checkb}
                        id="check"
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword((prev) => !prev)}
                    />
                    <button 
                        type="submit" 
                        className={styles.bttn}
                    >
                        Registrovat
                    </button>
                </Form>
                <FakeSpace />
            </>
        );
    }
}

export default UWindow;