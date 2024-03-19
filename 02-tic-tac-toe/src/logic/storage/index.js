const saveGameToStorage = ({ board, turn }) => {
    window.localStorage.setItem("board", JSON.stringify(board));
    window.localStorage.setItem("turn", turn);
}

const resetGameStorage = () => {
    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
}

export { saveGameToStorage, resetGameStorage };