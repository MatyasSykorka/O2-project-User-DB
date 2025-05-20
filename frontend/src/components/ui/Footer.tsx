import { Link } from "react-router-dom";
import styles from "../../styles/footer/footer.module.css";

const Footer = () => {
    return (
        <footer 
            className={styles.footer}
        >
            <p 
                className={styles.copy}
            >
                &copy; {new Date().getFullYear()} Správa uživatelů
            </p>
            <p 
                className={styles.serviceName}
            >
                Stránky vytvořil:
                <br />
                <Link to="https://github.com/MatyasSykorka">
                    Matyáš Sýkora
                </Link>
            </p>
        </footer>
    );
}

export default Footer;