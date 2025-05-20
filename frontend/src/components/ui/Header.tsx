import styles from "../../styles/header/header.module.css";

interface prop {
    nadpis: string;
}

const Header: React.FC<prop> = ({nadpis}) => {
    return(
        <header>
            <h1 
                className={styles.nadpis}
            >
                {nadpis}
            </h1>
        </header>
    );
}

export default Header;