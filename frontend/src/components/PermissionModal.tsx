import { User } from "../types/user.dto";
import styles from "../styles/modal/modal.module.css"
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

interface ModalProps {
    opened: boolean,
    close: () => void,
    userToPost? : User
}

const PermissionModal: React.FC<ModalProps> = ({opened, close, userToPost}) => {
    const navigate = useNavigate()

    const ConsultPermissionModal = async (): Promise<void> => {
        try {
            /*
            console.log(
                `
                ${userToPost?.id} ${userToPost?.name} ${userToPost?.surname} ${userToPost?.username} ${userToPost?.email} ${userToPost?.role_name}
                `
            );
            */
            const response = await axios.put("http://localhost:5000/move_to_tickets", undefined, {
                params: {
                    id: userToPost?.id,
                    name: userToPost?.name,
                    surname: userToPost?.surname,
                    username: userToPost?.username,
                    email: userToPost?.email,
                    role: userToPost?.role
                }
            });
            /*
            console.log(response.data);
            const status = response.data.status;
            console.log(status);
            */ 
            toast.success(
                "Žádanka na změmu práv byla úspěšná!", 
                { icon: '✔' }
            );

            close();
            return navigate("/users");
        }
        catch (error) {
            const axiosError = error as AxiosError;
            
            if (axiosError.response) {
                toast.error(
                    "Vaše žádost byla zamítnuta!", 
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
                    "Vaše žádost byla zamítnuta!", 
                    { icon: '❗' }
                );
                return console.error(
                    "The request was made but no response was received!"
                );
            } 
            else {
                toast.error(
                    "Vaše žádost byla zamítnuta!", 
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

    return (
        <div className={`${styles.modal} ${opened ? `${styles.opened}`:"" }`}>
            <div className={styles.box}>
                <h2>{`Žádáte o změně práv uživatele ${userToPost?.username} ?`}</h2>
                <button 
                    className={styles.givebttn} 
                    onClick={ConsultPermissionModal}
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

export default PermissionModal;