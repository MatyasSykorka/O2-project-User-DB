import { User } from "../../types/user.dto";
import styles from "../../styles/table/table.module.css";
import DeleteModal from "../DeleteModal";
import GiveModal from "../GiveModal";
import { useState } from "react";
import PermissionModal from "../PermissionModal"

interface Props{
    users: User[],
    loggedUser: User
}

const Table: React.FC<Props> = ({users, loggedUser}) => {
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
    
    // modal functions definition
    const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);
    const closeDeleteModal = () => {
        setDeleteModalOpened(false)
        setSelectedUser(undefined)
    };

    // modal functions definition
    const [giveModalOpened, setGiveModalOpened] = useState<boolean>(false);
    const closeGiveModal = () => {
        setGiveModalOpened(false)
        setSelectedUser(undefined)
    }

    // modal functions definition
    const [postModalOpened, setPostModalOpened] = useState<boolean>(false);
    const closePostModal = () => {
        setPostModalOpened(false)
        setSelectedUser(undefined)
    }

    // "building" databse table
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
                            Role
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
                            {
                            loggedUser.username === "A" && 
                                <>
                                    <td>
                                        {user.role_name==="admin"? "admin":"user"}
                                    </td>
                                    <td>
                                        {
                                        user.username === "A" &&
                                            <div>
                                                Main admin :)
                                            </div>
                                        }
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
                                </>
                            }
                            {
                            loggedUser.username !!!= "A" && 
                                <>
                                    <td>
                                        {user.role_name==="admin"? "admin":"user"}
                                    </td>
                                    <td>
                                        {
                                        user.username === "A" &&
                                            <div>
                                                Main admin
                                            </div>
                                        }
                                        {
                                        loggedUser.username === user.username &&
                                            <div>
                                                You're admin :)
                                            </div>
                                        }
                                        {
                                        loggedUser.username !== user.username 
                                        && user.role_name !== "user" 
                                        && user.username !== "A" &&
                                            <div>
                                                Admin
                                            </div>
                                        }
                                        {
                                        user.role_name !!!= "admin" &&
                                            <>
                                                <button 
                                                    type="button" 
                                                    onClick= { 
                                                        async()=> {
                                                            setPostModalOpened(true);
                                                            setSelectedUser(user);
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
                                                            setDeleteModalOpened(true);
                                                            setSelectedUser(user);
                                                        }
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        }
                                    </td>
                                </>
                            }
                        </tr>
                    ))
                    }
                </tbody>
            </table>
            <DeleteModal 
                opened={deleteModalOpened} 
                close={closeDeleteModal} 
                userToDelete={selectedUser} 
                where="database"
            />
            <GiveModal 
                opened={giveModalOpened} 
                close={closeGiveModal} 
                userToGive={selectedUser}
                where="database"
            />
            <PermissionModal 
                opened={postModalOpened}
                close={closePostModal}
                userToPost={selectedUser}
            />
        </>
    );
}

export default Table;