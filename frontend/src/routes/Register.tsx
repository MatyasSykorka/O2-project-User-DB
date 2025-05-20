import FakeSpace from "../components/ui/fakeSpace";
import Header from "../components/ui/Header";
import NavBar from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import UWindow from "../components/ui/UWindow";

const Registrace = () => {
    return (
        <>
            <NavBar/>
            <Header nadpis="Registrace" />
            <UWindow WType="register" />
            <FakeSpace />
            <FakeSpace />
            <FakeSpace />
            <Footer />
        </>
    );
}

export default Registrace;