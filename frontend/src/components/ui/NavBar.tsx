// important lib.
import { useNavigate } from "react-router-dom";
import styles from "../../styles/navbar/navBar.module.css"
import toast from "react-hot-toast";
import { User } from "../../types/user.dto";

// function that must get users data
interface prop{
    loggedUser?: User
}
// creating navigation bar at the top
const NavBar: React.FC<prop> = ({loggedUser}) => {
    const navigate = useNavigate()

    // navigation functions
    const logOut = () => {
        localStorage.removeItem("loggedUser");
        toast.success(
            "Byli jste úspěšně odhlášeni!"
        );
        navigate("/login");
    }
    const LoginPage = () => {
        navigate("/login");
    }

    const Home = () => {
        navigate("/");
    }
    const Register = () => {
        navigate("/register");
    }
    const UpdateProfile = () => {
        navigate("/update-profile");
    }
    const UpdatePW = () => {
        navigate("/update-password");
    }
    const Database = () => {
        navigate("/users");
    }
    const AboutThis = () => {
        navigate("/about");
    }
    const Tickets = () => {
        navigate("/tickets")
    }

    // console.log(loggedUser);

    // output of navigation bar
    return (
        <nav>
            <ul 
                className={styles.up}
            >
                {
                !loggedUser && 
                    <>
                        <li 
                            className={styles.main}
                        >
                            <a 
                                onClick={Register}
                            >
                                Registrovat
                            </a>
                        </li>
                        <li 
                            className={styles.main}
                        >
                            <a
                                onClick={LoginPage}
                            >
                                Přihlásit
                            </a>
                        </li>
                        <li
                            className={styles.main}
                        >
                            <a 
                                onClick={AboutThis}
                            >
                                O projektu
                            </a>
                        </li>
                    </>
                }
                {
                loggedUser &&
                    <>
                        <li 
                            className={styles.main}
                        >
                            <a 
                                onClick={Home}
                            >
                                Domů
                            </a>
                        </li>
                        <li 
                            className={styles.main}
                        >
                            <a 
                                onClick={logOut}
                            >
                                Odhlásit
                            </a>
                        </li>
                        {
                        loggedUser.username !!!= "A" &&
                            <li 
                                className={styles.main}
                            >
                                <a 
                                    onClick={UpdateProfile}
                                >
                                    Úprava profilu
                                </a>
                            </li>
                        }
                        <li 
                            className={styles.main}
                        >
                            <a
                                onClick={UpdatePW}
                            >
                                Změnit heslo
                            </a>
                        </li>
                        {
                        loggedUser.role_name === "admin" &&
                            <li 
                                className={styles.main}
                            >
                                <a 
                                    onClick={Database}
                                >
                                    Databáze
                                </a>
                            </li>
                        }
                        {
                        loggedUser.username === "A" &&
                            <li 
                                className={styles.main}
                            >
                                <a 
                                    onClick={Tickets}
                                >
                                    Žádanky
                                </a>
                            </li>
                        }
                        <li 
                            className={styles.main}
                        >
                            <a 
                                onClick={AboutThis}
                            >
                                O projektu
                            </a>
                        </li>
                        {
                        loggedUser.role_name === "admin" &&
                            <li 
                                className={styles.loggedAdmin}
                            >
                                <a>
                                    {`${loggedUser.name} - ${loggedUser.username}`}
                                </a>
                            </li>
                        }
                        {
                        loggedUser.role_name === "user" &&
                            <li 
                                className={styles.loggedUser}
                            >
                                <a>
                                    {`${loggedUser.name} - ${loggedUser.username}`}
                                </a>
                            </li>
                        }
                    </>
                }
            </ul>
        </nav>
    );
}

export default NavBar;