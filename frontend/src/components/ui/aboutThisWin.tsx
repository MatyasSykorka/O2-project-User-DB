import styles from "../../styles/about/about.module.css";
import { Link } from "react-router-dom";

const AboutThisWin = () => {
    return (
        <>
            <div className={styles.AboutWindow}>
                <p>
                    <strong>
                        Zdravím tě!<br />tato stránka je projektem během praxích ve firmě O2 (rok 2024).
                    </strong>
                </p>
                <p>
                    Tento projekt mě naučil pracovat v aplikacích a nástrojích, které se běžně používají.
                </p>
                <h1>
                    Soupis:
                </h1>
                <h3>
                    VS code
                </h3>
                <h3>
                    Dbeaver
                </h3>
                <h3>
                    Postman
                </h3>
                <h3>
                    Git
                </h3>
                <h4>
                    <Link to="https://github.com/MatyasSykorka/O2-project">
                        Další najdete na Githubu projektu.
                    </Link>
                </h4>
                <br />
                <h5>
                    <i>
                        *Ano najdou se chyby v kódu a praktiky, které jsou špatné v praxi. 
                    </i>
                </h5>
            </div>
        </>
    );
}

export default AboutThisWin;