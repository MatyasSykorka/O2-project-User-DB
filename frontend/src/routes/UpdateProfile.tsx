import Header from "../components/ui/Header";
import NavBar from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import UpdateWindows from "../components/ui/UpdateWindow";
import { redirect, useLoaderData } from "react-router-dom";
import { User } from "../types/user.dto";
import { decryptUser } from "../utils/login";

export const loader = async () => {
    const userString = localStorage.getItem("loggedUser")
    if (!userString) return redirect("/login")

    const loggedUser = decryptUser(userString)
    if (!loggedUser) {
        localStorage.removeItem("loggedUser")
        return redirect("/login")
    }

    return loggedUser as User
}

const UpdateProfile = () => {
    const loggedUser = useLoaderData() as User;

    return (
        <>
            <NavBar loggedUser={loggedUser}/>
            <Header nadpis="Úprava profilu" />
            <UpdateWindows 
                UpdateWType="updateProfile" 
                loggedUser={loggedUser}
            />
            <Footer />
        </>
    );
}

export default UpdateProfile;