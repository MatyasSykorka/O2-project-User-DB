import FakeSpace from "../components/ui/fakeSpace";
import NavBar from "../components/ui/NavBar";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import Table from "../components/ui/Table";
import { redirect, useLoaderData } from "react-router-dom";
import axios from "axios";
import { User } from "../types/user.dto";
import { decryptUser } from "../utils/login"

// loader similar as in NavBar.tsx
export const loader = async (): Promise<{data: User[], loggedUser: User} | Response> => {
    const userString = localStorage.getItem("loggedUser");
    if (!userString) return redirect("/login");

    const loggedUser = decryptUser(userString);
    if (!loggedUser) {
        localStorage.removeItem("loggedUser");
        return redirect("/login");
    }

    // request to get all data from DB
    const response = await axios.get("http://localhost:5000/users");
    const data = response.data;

    return {
        data: data as User[],
        loggedUser: loggedUser
    }
}

// constructing database table
const Database = () => {
    const {data, loggedUser} = useLoaderData() as {data: User[], loggedUser: User}

    return (
        <>
            <NavBar loggedUser={loggedUser}/>
            <Header nadpis="Databáze" />
            <Table users={data} loggedUser={loggedUser}/>
            <FakeSpace />
            <FakeSpace />
            <FakeSpace />
            <Footer />
        </>
    );
}

export default Database;