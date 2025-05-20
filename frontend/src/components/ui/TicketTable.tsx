import { User } from "../../types/user.dto";
import styles from "../../styles/table/table.module.css";
import GiveModal from "../GiveModal";
import { useState } from "react";
import DeleteModal from "../DeleteModal";

interface Props{
    users: User[],
    loggedUser: User
}

const TicketTable: React.FC<Props> = ({users, loggedUser}) => {
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

    const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);

    const closeDeleteModal = () => {
        setDeleteModalOpened(false)
        setSelectedUser(undefined)
    };

    const [giveModalOpened, setGiveModalOpened] = useState<boolean>(false);

    const closeGiveModal = () => {
        setGiveModalOpened(false)
        setSelectedUser(undefined)
    }

    {loggedUser.id}

    return (
        <>
            <table className={styles.tabulka}>
                <thead>
                    <tr>
                        <th>
                            ID
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Surname
                        </th>
                        <th>
                            Username
                        </th>
                        <th>
                            Email
                        </th>
                        <th>
                            Actual role
                        </th>
                        <th>
                            Change role
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                    users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                {user.id}
                            </td>
                            <td>
                                {user.name}
                            </td>
                            <td>
                                {user.surname}
                            </td>
                            <td>
                                {user.username}
                            </td>
                            <td>
                                {user.email}
                            </td>
                            <td>
                                {user.role_name==="admin"? "admin":"user"}
                            </td>
                            <td>
                                {
                                user.username !!!= "A" &&
                                    <>
                                        <button 
                                            type="button" 
                                            onClick= { 
                                                async()=> {
                                                    setGiveModalOpened(true)
                                                    setSelectedUser(user)
                                                }
                                            }
                                        >
                                            {user.role_name==="admin"? "user":"admin"}
                                        </button>
                                        <button 
                                            type="button" 
                                            className={styles.del} 
                                            onClick= { 
                                                async()=> {
                                                    setDeleteModalOpened(true)
                                                    setSelectedUser(user)
                                                }
                                            }
                                        >
                                            Delete
                                        </button>
                                    </>
                                }
                            </td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
            <DeleteModal 
                opened={deleteModalOpened} 
                close={closeDeleteModal} 
                userToDelete={selectedUser} 
                where="tickets"
            />
            <GiveModal 
                opened={giveModalOpened} 
                close={closeGiveModal} 
                userToGive={selectedUser}
                where="ticket"
            />
        </>
    );
}


export default TicketTable;