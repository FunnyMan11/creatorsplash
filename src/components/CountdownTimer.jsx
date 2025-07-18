import { useEffect, useState } from "react";
import "../assets/css/CountdownTimer.css";

const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = +new Date(targetDate) - +new Date();
        return {
            dias: Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24))),
            horas: Math.max(0, Math.floor((difference / (1000 * 60 * 60)) % 24)),
            min: Math.max(0, Math.floor((difference / (1000 * 60)) % 60)),
            seg: Math.max(0, Math.floor((difference / 1000) % 60)),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDigits = (number) => {
        return String(number).padStart(2, "0").split(""); // Garante dois dígitos e separa cada número
    };

    return (
        <div className="countdown-container">
            <div className="countdown-upside">
                {Object.entries(timeLeft).map(([label, value]) => (
                    <div className="countdown-item" key={label}>
                        <div className="countdown-numbers">
                            {formatDigits(value).map((digit, index) => (
                                <div className="countdown-digit" key={index}>
                                    {digit}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="countdown-labels">
                {Object.keys(timeLeft).map((label) => (
                    <div
                        className={`countdown-label ${
                            label === "dias"
                                ? "countdown-days"
                                : label === "horas"
                                    ? "countdown-hours"
                                    : label === "min"
                                        ? "countdown-minutes"
                                        : label === "seg"
                                            ? "countdown-seconds"
                                            : ""
                        }`}
                        key={label}
                    >
                        {label.toUpperCase()}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CountdownTimer;