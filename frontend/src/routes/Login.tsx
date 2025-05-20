import Header from "../components/ui/Header";
import NavBar from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import UWindow from "../components/ui/UWindow";
import { decryptUser } from "../utils/login";
import { redirect } from "react-router-dom";
import toast from "react-hot-toast";

export const loader = async() => {
    const userString = localStorage.getItem("loggedUser")
    
    if (userString){
        const loggedUser = decryptUser(userString)
        if(loggedUser){
            toast.error("Už jsi přihlášený!")
            return redirect("/")
        }
        else{
            return localStorage.removeItem("loggedUser");
        }
    }
    return null
}

const Login = () => {
    
    return (
        <>
            <NavBar />
            <Header nadpis="Přihlásit" />
            <UWindow WType="login" />
            <Footer />
        </>
    );
}

export default Login;