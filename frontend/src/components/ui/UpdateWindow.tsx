import axios, { AxiosError } from "axios";
import styles from "../../styles/uWindow/uWin.module.css";
import { Form, redirect } from "react-router-dom";
import toast, { /*CheckmarkIcon*/ } from "react-hot-toast";
import { User } from "../../types/user.dto";
import FakeSpace from "./fakeSpace";
import { useState } from "react";
import DeleteModal from "../DeleteModal";

interface prop {
    UpdateWType: string,
    loggedUser: User
};

export const UpdateProfileAction = async ({request} : {request: Request}) => {
    const formData = await request.formData()
    const name = formData.get("fname");
    const surname = formData.get("lname");
    const email = formData.get("newemail");
    const id = formData.get("userid");

    try {
        const body = {
            id: id,
            name: name,
            surname: surname,
            email: email
        };

        axios.post("http://localhost:5000/update_user", body, {
            headers: {
                "Content-Type": "application/json"
            },
        });

        toast.success(
            "Aktualizace profilu byla úspěšná!", 
            { icon: '✔' }
        );
        return redirect("/");
    }
    catch (error) {
		const axiosError = error as AxiosError;
		if (axiosError.response) {
            toast.error(
                "Aktualizace profilu byla neúspěšná!", 
                { icon: '❗' }
            );
            return console.error(
                `
                The request was made and the server responded with a status code: 
                ${axiosError.response.status}
                `
            );
		}
        else if (axiosError.request) {
            toast.error(
                "Aktualizace profilu byla neúspěšná!", 
                { icon: '❗' }
            );
            return console.error(
                `The request was made but no response was received!`
            );
		}
        else {
            toast.error(
                "Aktualizace profilu byla neúspěšná!", 
                { icon: '❗' }
            );
            return console.error(
                `
                Something happened in setting up the request that triggered an Error: 
                ${axiosError.message}
                `
            );
		}
	}
}


export const UpdatePWAction = async ({request} : {request : Request}) => {
    const formData = await request.formData();
    const username = formData.get("uname");
    const old_PW = formData.get("pw");
    const new_PW = formData.get("newpw");
    const sec_new_PW = formData.get("secnewpw");
    
    if (sec_new_PW != new_PW) {
        return toast.error(
            "Zkontrolujte si správnost nového hesela!", 
            { icon: '❗' }
        );
    }

    if (new_PW == old_PW) {
        return toast.error(
            "Staré heslo a nové heslo se shodují!",
            { icon: '❗' }
        );
    }

    try {
        const body = {
            username: username,
            old_password: old_PW,
            new_password: new_PW,
            sec_new_password: sec_new_PW
        }

        const response = await axios.post("http://localhost:5000/update_password", body, {
            headers: {
                "Content-Type": "application/json"
            },
        });


        if (response.status !== 200) {
            console.log(response.status); 
            return toast.error(
                "Žáddná shodnost hesla!", 
                { icon: '❗' }
            );
        }

        toast.success(
            "Aktualizace hesla byla úspěšná!", 
            { icon: '✔' }
        );
        return redirect("/");
    }
    catch (error) {
		const axiosError = error as AxiosError;
		if (axiosError.response) {
            toast.error(
                "Aktualizace hesla byla neúspěšná!", 
                { icon: '❗' }
            );
            return console.error(
                `
                The request was made and the server responded with a status code:
                ${axiosError.response.status}
                `
            );
		}
        else if (axiosError.request) {
            toast.error(
                "Aktualizace hesla byla neúspěšná!",
                { icon: '❗' }
            );
            return console.error(
                `The request was made but no response was received!`
            );
		}
        else {
            toast.error(
                "Aktualizace hesla byla neúspěšná!",
                { icon: '❗' }
            );
            return console.error(
                `
                Something happened in setting up the request that triggered an Error:
                ${axiosError.message}
                `
            );
		}
	}
}



const UpdateWindow: React.FC<prop> = ({UpdateWType, loggedUser}) => {
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined)

    const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false)

    const closeDeleteModal = () => {
        setDeleteModalOpened(false)
        setSelectedUser(undefined)
    }

    const [password, setPassword] = useState<string>("");
    const [passwordII, setPasswordII] = useState<string>("");
    const [passwordIII, setPasswordIII] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);


    if (UpdateWType === "updateProfile") {
        return (
            <>
                <Form
                    method="POST"
                    className={styles.UserForm}
                >
                    <label 
                        htmlFor="newfname" 
                        className={styles.TinForm}
                    >
                        Změnit jméno:
                    </label>
                    <input 
                        type="text" 
                        className={styles.inForm} 
                        id="newfname" 
                        name="fname" 
                        required
                    />
                    <label 
                        htmlFor="newlname" 
                        className={styles.TinForm}
                    >
                        Změnit příjmení:
                    </label>
                    <input 
                        type="text" 
                        className={styles.inForm} 
                        id="newlname" 
                        name="lname" 
                        required 
                    />
                    <label 
                        htmlFor="newemail" 
                        className={styles.TinForm}
                    >
                        Změnit email:
                    </label>
                    <input 
                        type="text" 
                        className={styles.inForm} 
                        id="newemail" 
                        name="newemail" 
                    />
                    <input 
                        type="hidden" 
                        value={loggedUser.id} 
                        name="userid"
                    />
                    <button 
                        type="submit" 
                        className={styles.bttn}
                    >
                        Uplatnit změny
                    </button>
                </Form>
                <FakeSpace />
                    <Form
                        className={styles.UserForm}
                    >
                        <label 
                            htmlFor="delprofile" 
                            className={styles.TinForm}
                        >
                            Smazat profil?
                        </label>
                        <button 
                            type="submit" 
                            className={styles.bttn} 
                            onClick={
                                async() => {
                                    setDeleteModalOpened(true)
                                    setSelectedUser(loggedUser)
                                }
                            }
                        >
                            Smazat
                        </button>
                    </Form>
                <DeleteModal 
                    opened={deleteModalOpened} 
                    close={closeDeleteModal} 
                    userToDelete={selectedUser} 
                    where="profile"
                />
            </>
        );
    }
    if (UpdateWType === "updatePW") {
        return (
            <>
                <Form
                    method="POST"
                    className={styles.UserForm}
                >
                    <input 
                        type="hidden" 
                        className={styles.inForm} 
                        id="uname" 
                        name="uname" 
                        value={loggedUser.username}
                    />
                    <label 
                        htmlFor="pw" 
                        className={styles.TinForm}
                    >
                        Heslo:
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => setPasswordIII(e.target.value)}
                        value={passwordIII}
                        className={styles.inForm}
                        name="pw"
                        id="pw"
                        required
                    />
                    <label 
                        htmlFor="newpw" 
                        className={styles.TinForm}
                    >
                        Nové heslo:
                    </label>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        onChange={(e) => setPasswordII(e.target.value)} 
                        value={passwordII}
                        className={styles.inForm} 
                        id="newpw" 
                        name="newpw" 
                        required 
                    />
                    <label 
                        htmlFor="secnewps" 
                        className={styles.TinForm}
                    >
                        Znova nové heslo:
                    </label>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password}
                        className={styles.inForm} 
                        id="secnewpw" 
                        name="secnewpw" 
                        required
                    />
                    <p 
                        className={styles.shadowText}
                    >
                        Chcete zobrazit hesla?
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
                        Uplatnit změny
                    </button>
                </Form>
                {/*
                basic example of show password/text from AI + 
                <div>
                    <label htmlFor="pass">Enter password: </label>
                    <input
                        id="pass"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    <label htmlFor="check">Show Password</label>
                    <input
                        id="check"
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword((prev) => !prev)}
                    />
                </div>
                */}
                <FakeSpace />
            </>
        );
    }
}

export default UpdateWindow;