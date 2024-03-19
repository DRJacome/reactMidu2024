/* INSTALAR:
npm i canvas-confetti -E
*/

import { useState } from "react";
import "./app.css";
import confetti from "canvas-confetti";
import { Square } from "./components/Square";
import { TURNS } from "./constantes";
import { checkEndGame, checkWinnerFrom } from "./logic/board";
import { WinnerModal } from "./components/WinnerModal";
import { Board } from "./components/Board";
import { resetGameStorage, saveGameToStorage } from "./logic/storage/index";

function App() {
    /* Valores iniciales: */
    console.log("Primer render");
    const [board, setBoard] = useState(() => {
        /* Comprueba si hay una partida guardada en el localStorage y la recupera; si no la hay,
         pinta un tablero nuevo. */
        console.log("inicializar el estado del board");
        const boardFromStorage = window.localStorage.getItem("board");
        return boardFromStorage
            ? JSON.parse(boardFromStorage)
            : Array(9).fill(null);
    });
    const [turn, setTurn] = useState(() => {
        const turnFromStorage = window.localStorage.getItem("turn");

        /* ?? -> Operador de fusión nula: comprueba si el primer valor es nulo o indefinido, y si lo es, devuelve el segundo valor. */
        return turnFromStorage ?? TURNS.X;
    });
    const [winner, setWinner] = useState(null); // Null es que no hay ganador, y false es que hay empate.

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setTurn(TURNS.X);
        setWinner(null);
        resetGameStorage();
    };

    const updateBoard = (index) => {
        /* Si ya hay algo en la posición en la que clica el jugador, se finaliza la ejecución (return) sin continuar 
        con el resto de líneas de la función updateBoard() y no se actualiza el estado. */
        if (board[index] || winner) {
            return;
        }

        /* IMPORTANTE: se debe pasar un array u objeto nuevo en un nuevo estado y no modificar directamente el estado original;
        el estado original debe ser inmutable.
        */
        const newBoard = [...board]; // Se actualiza el tablero.
        newBoard[index] = turn; // Los valores de turn pueden ser X u O.
        setBoard(newBoard);
        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X; // Se cambia de turno.
        setTurn(newTurn);

        // Guardar partida.
        saveGameToStorage({
            board: newBoard,
            turn: newTurn,
        });

        // Después de actualizar la posición, revisamos si hay un ganador.
        const newWinner = checkWinnerFrom(newBoard);
        if (newWinner) {
            setWinner(newWinner);
            confetti();
        } else if (checkEndGame(newBoard)) {
            setWinner(false);
        }
    };

    return (
        <main className='board'>
            <h1>Tic tac toe</h1>
            <button onClick={resetGame}>Empezar de nuevo</button>
            <Board board={board} updateBoard={updateBoard} />

            <section className='turn'>
                <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
                <Square isSelected={turn === TURNS.O}> {TURNS.O}</Square>
            </section>

            <WinnerModal winner={winner} resetGame={resetGame} />
        </main>
    );
}

export default App;
