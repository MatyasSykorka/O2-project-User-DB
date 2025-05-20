// the important libreries
import Header from "../components/ui/Header";
import NavBar from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import FakeSpace from "../components/ui/fakeSpace";
import { redirect, useLoaderData } from "react-router-dom";
import { User } from "../types/user.dto";
import { decryptUser } from "../utils/login";

// creating loader to getting user from local storage if thera aren't user data, log out from website
export const loader = async () => {
    const userString = localStorage.getItem("loggedUser")
    if (!userString) return redirect("/login");

    const loggedUser = decryptUser(userString)
    if (!loggedUser) {
        localStorage.removeItem("loggedUser");
        return redirect("/login");
    }
    // console.log(loggedUser)

    return loggedUser as User;
}

// "building" web page
const Home = () => {
    const loggedUser = useLoaderData() as User;

    return (
        <>
            <NavBar loggedUser={loggedUser}/>
            <FakeSpace />
            <Header nadpis="Správa uživatelů"/>
            <Footer />
        </>
    );
}

// exporting to routes in main.tsx
export default Home;