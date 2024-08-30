import { useState, useEffect, useRef, FormEvent } from 'react';

export default function CountdownTimer() {
    const DEFAULT_TIMEOUT: number = 60;
    const intervalRef = useRef(0);
    const currentTimeout = useRef(DEFAULT_TIMEOUT);
    const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMEOUT);
    const [isActive, setActive] = useState(false);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                if (timeLeft > 0) {
                    setTimeLeft(time => time - 1);
                } else {
                    pauseTimer();
                    clearInterval(intervalRef.current)
                    intervalRef.current = 0;
                }
            }, 1000)
        }

        return () => {
            clearInterval(intervalRef.current);
            intervalRef.current = 0;
        }
    }, [isActive, timeLeft])

    function startTimer() {
        setActive(true);
    }

    function pauseTimer() {
        setActive(false);
    }

    function reset() {
        pauseTimer();
        setTimeLeft(() => currentTimeout.current);
    }

    function handleNewTimeout(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        currentTimeout.current = Number.parseInt(data.get("newTimeout") as string);
        reset();
    }

    return (
        <div>
            <h1>Nedräkningstimer</h1>
            <h2>{timeLeft} sekunder kvar{timeLeft === 0 ? ", tiden är slut!" : ""}</h2>
            <button onClick={startTimer} disabled={isActive || !timeLeft}>Starta</button>
            <button onClick={pauseTimer} disabled={!isActive || !timeLeft}>Pausa</button>
            <button onClick={reset}>Återställ</button>
            <h2>Ändra starttid</h2>
            <form method="post" onSubmit={handleNewTimeout}>
            <label>
                Starttid
                <input type="number" name="newTimeout" min={0} defaultValue={DEFAULT_TIMEOUT}></input>
            </label>
            <button type="submit">Ny starttid</button>
            <button type="reset">Återställ</button>
            </form>
        </div>
    );
}
