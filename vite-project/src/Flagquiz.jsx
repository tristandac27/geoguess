import { useState, useEffect } from "react";
import "./Flagquiz.css";

function FlagQuiz() {
    const [countries, setCountries] = useState([]);
    const [currentCountry, setCurrentCountry] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    
    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all")
            .then((response) => response.json())
            .then((data) => {
                setCountries(data);
                setRandomCountry(data);
            })
            .catch((error) => console.error("Erreur lors de la récupération des pays:", error));
    }, []);

    const setRandomCountry = (data) => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setCurrentCountry(data[randomIndex]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (
            currentCountry &&
            inputValue.trim().toLowerCase() === currentCountry.name.common.toLowerCase()
        ) {
            setScore(score + 1);
        }
        setAttempts(attempts + 1);
        setInputValue("");
        if (attempts < 9) {
            setRandomCountry(countries);
        }
    };

    const handleRestart = () => {
        setScore(0);
        setAttempts(0);
        setRandomCountry(countries);
    };

    return (
        <div className="flag-quiz">
            <h1 className="flag-quiz-title">Quiz des Drapeaux</h1>
            {attempts < 10 ? (
                currentCountry && (
                    <div className="flag-quiz-content">
                        <img
                            className="flag-quiz-flag"
                            src={currentCountry.flags?.png || ""}
                            alt={`Drapeau de ${currentCountry.name?.common}`}
                            width="200"
                        />
                        <form className="flag-quiz-form" onSubmit={handleSubmit}>
                            <input
                                className="flag-quiz-input"
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Entrez le nom du pays"
                            />
                            <button className="flag-quiz-button" type="submit">Valider</button>
                        </form>
                        <p className="flag-quiz-score">Score: {score}</p>
                    </div>
                )
            ) : (
                <div className="flag-quiz-end">
                    <h2 className="flag-quiz-end-title">Jeu terminé !</h2>
                    <p className="flag-quiz-end-score">Votre score final: {score}/10</p>
                    <button className="flag-quiz-restart-button" onClick={handleRestart}>Rejouer</button>
                </div>
            )}
        </div>
    );
}

export default FlagQuiz;
