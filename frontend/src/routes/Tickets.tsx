import Header from "../components/ui/Header";
import NavBar from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import FakeSpace from "../components/ui/fakeSpace";
import { redirect, useLoaderData } from "react-router-dom";
import { User } from "../types/user.dto";
import { decryptUser } from "../utils/login";
import TicketTable from "../components/ui/TicketTable";
import axios from "axios";

export const loader = async (): Promise<{data: User[], loggedUser: User} | Response> => {
    const userString = localStorage.getItem("loggedUser")
    if (!userString) return redirect("/login");

    const loggedUser = decryptUser(userString)
    if (!loggedUser || loggedUser.username != "A") {
        localStorage.removeItem("loggedUser");
        return redirect("/login");
    };

    const response = await axios.get("http://localhost:5000/show_tickets");
    const data = response.data;
    
    return {
        data: data as User[],
        loggedUser: loggedUser
    };
}

const Tickets = () => {
    const {data, loggedUser} = useLoaderData() as {data: User[], loggedUser: User};

    return (
        <>
            <NavBar loggedUser={loggedUser}/>
            <Header nadpis="Žádanky" />
            <TicketTable 
                users={data} 
                loggedUser={loggedUser}
            />
            <FakeSpace />
            <FakeSpace />
            <FakeSpace />
            <Footer />
        </>
    );
}

export default Tickets;