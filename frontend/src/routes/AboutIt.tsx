import Header from "../components/ui/Header";
import NavBar from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import FakeSpace from "../components/ui/fakeSpace";
import { User } from "../types/user.dto";
import { decryptUser } from "../utils/login";
import AboutThisWin from "../components/ui/aboutThisWin";
import { useLoaderData } from "react-router-dom";

export const loader = async () => {
    const userString = localStorage.getItem("loggedUser")
    if (!userString) return null;

    const loggedUser = decryptUser(userString)
    if (!loggedUser) {
        return localStorage.removeItem("loggedUser");
    }
    // console.log(loggedUser)

    return loggedUser as User
}

const AboutThis = () => {
    const loggedUser = useLoaderData() as User;

    return (
        <>
            <NavBar loggedUser={loggedUser}/>
            <FakeSpace />
            <Header nadpis="O projektu Správa uživatelů" />
            <FakeSpace />
            <AboutThisWin />
            <Footer />
        </>
    );
}

export default AboutThis;
