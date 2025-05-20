import { User } from "../types/user.dto";
import styles from "../styles/modal/modal.module.css"
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

interface ModalProps {
    opened: boolean,
    close: () => void,
    userToDelete? : User,
    where: string
}

const DeleteModal: React.FC<ModalProps> = ({opened, close, userToDelete, where}) => {
    const navigate = useNavigate()

    const removeAction = async (): Promise<void> => {
        try {
            const response = await axios.delete("http://localhost:5000/user",{
                params:{
                    id:userToDelete?.id
                }
            });

            /*
            console.log(response.data);
            const status = response.data.status;
            console.log(status);
            */

            toast.success(
                "Smazání bylo úspěšné!", 
                { icon: '✔' }
            );
            close();
            navigate("/users");
        }
        catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                toast.error(
                    "Smazání uživatele bylo neúspěšné!", 
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
                    "Smazání uživatele bylo neúspěšné!", 
                    { icon: '❗' }
                );
                return console.error(
                    "The request was made but no response was received!"
                );
            }
            else {
                toast.error(
                    "Smazání uživatele bylo neúspěšné!", 
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

    const removeActionII = async (): Promise<void> => {
        try {
            const response = await axios.delete("http://localhost:5000/update-profile",{
                params:{
                    id:userToDelete?.id
                }
            });

            /*
            console.log(response.data);
            const status = response.data.status;
            console.log(status);
            */
            
            toast.success(
                "Smazání uživatele bylo neúspěšné!", 
                { icon: '✔' }
            );
            close();
            localStorage.removeItem("loggedUser");
            navigate("/login");
        }
        catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                toast.error(
                    "Smazání uživatele bylo neúspěšné!", 
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
                    "Smazání uživatele bylo neúspěšné!", 
                    { icon: '❗' }
                );
                return console.error(
                    "The request was made but no response was received!"
                );
            }
            else {
                toast.error(
                    "Něco se pokazilo!", 
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

    const removeActionIII = async (): Promise<void> => {
        try {
            const response = await axios.delete("http://localhost:5000/reject-permission",{
                params:{
                    username:userToDelete?.username
                }
            });

            /*
            console.log(response.data);
            const status = response.data.status;
            console.log(status);
            */

            toast.success(
                "Odmítnutí práv bylo úspěšné!", 
                { icon: '✔' }
            );
            close();
            navigate("/tickets");
        }
        catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                toast.error(
                    "Odmítnutí práv bylo neúspěšné!", 
                    { icon: '❗' }
                );
                console.error(
                    `
                    The request was made and the server responded with a status code:
                    ${axiosError.response.status}
                    `
                );
            }
            else if (axiosError.request) {
                toast.error(
                    "Odmítnutí práv bylo neúspěšné!", 
                    { icon: '❗' }
                );
                console.error(
                    "The request was made but no response was received!"
                );
            }
            else {
                toast.error(
                    "Odmítnutí práv bylo neúspěšné!", 
                    { icon: '❗' }
                );
                console.error(
                    `
                    Something happened in setting up the request that triggered an Error: 
                    ${axiosError.message}
                    `
                );
    
            }
        }
    }

    return (
        <div className={`${styles.modal} ${opened ? `${styles.opened}`:"" }`}>
            <div className={styles.box}>
                <h2>
                    {`
                    Opravdu chcete smazat nebo odmítnout změnu práv uživateli ${userToDelete?.username} ?
                    `}
                </h2>
                <button 
                    className={styles.delbttn} 
                    onClick={
                        where == "database"? removeAction : 
                            where == "tickets"? removeActionIII : removeActionII
                    }
                >
                    Smazat
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

export default DeleteModal
