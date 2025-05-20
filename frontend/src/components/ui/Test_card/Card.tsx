import styles from "./card/card.module.css";

const Card = () => {
    return (
        <div className={styles.card}>
            <img src="" alt="Profile picture" className="MyIMG"></img>
            <h2>
                Matyáš Sýkora
            </h2>
            <p>
                He is learning React for the first time.
            </p>
        </div>
    );
}

export default Card;