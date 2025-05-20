import { User } from "../types/user.dto";
import styles from "../styles/modal/modal.module.css"
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

// parameters for interface function
interface ModalProps {
    opened: boolean,
    close: () => void,
    userToGive? : User,
    where: string
}

// modal function with paramaters from interface
const GiveModal: React.FC<ModalProps> = ({opened, close, userToGive, where}) => {
    const navigate = useNavigate()
 
    const GiveAdminPermission = async (): Promise<void> => {
        try {
            // console.log(userToGive?.id)
            // requesting database to find route and run
            const response = await axios.put("http://localhost:5000/giveAdmin", undefined, {
                params: {
                    id: userToGive?.id,
                    role: userToGive?.role,
                    username: userToGive?.username
                }
            });
            
            /*
            console.log(response.data);
            const status = response.data.status;
            console.log(status);
            */
            
            toast.success(
                "Úprava uživatelských práv bylo úspěšné!", 
                { icon: '✔' }
            );

            close();
            return navigate("/users");
        }
        catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                toast.error(
                    "Úprava uživatelských práv bylo neúspěšné!", 
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
                    "Úprava uživatelských práv bylo neúspěšné!", 
                    { icon: '❗' }
                );
                return console.error(
                    "The request was made but no response was received!"
                );
            } 
            else {
                toast.error(
                    "Úprava uživatelských práv bylo neúspěšné!", 
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

    const GiveAdminPermissionII = async (): Promise<void> => {
        try {
            console.log(
                `
                ${userToGive?.id} ${userToGive?.role} ${userToGive?.username}
                `
            );
            const response = await axios.put("http://localhost:5000/giveAdmin", undefined, {
                params: {
                    id: userToGive?.id,
                    role: userToGive?.role,
                    username: userToGive?.username
                }
            });
            /*
            console.log(response.data);
            const status = response.data.status;
            console.log(status);
            */
            toast.success(
                "Úprava uživatelských práv bylo úspěšné!", 
                { icon: '✔' }
            );

            close();
            return navigate("/tickets");
        }
        catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                toast.error(
                    "Úprava uživatelských práv bylo neúspěšné!", 
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
                    "Úprava uživatelských práv bylo neúspěšné!", 
                    { icon: '❗' }
                );
                return console.error(
                    "The request was made but no response was received!"
                );
            } 
            else {
                toast.error(
                    "Úprava uživatelských práv bylo neúspěšné!", 
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

    // output of give permission modal
    return (
        <div className={`${styles.modal} ${opened ? `${styles.opened}`:"" }`}>
            <div className={styles.box}>
                <h2>
                    {`
                    Opravdu chcete změnit práva uživateli ${userToGive?.username} ?
                    `}
                </h2>
                <button 
                    className={styles.givebttn} 
                    onClick={where == "database"? GiveAdminPermission : GiveAdminPermissionII}
                >
                    Ano
                </button>
                <button 
                    className={styles.cancel} 
                    onClick={close}
                >
                    Zrušit
                </button>
            </div>
        </div>
    )
}

export default GiveModal;