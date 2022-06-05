export default function HistoryNavigator(props){
    const moves = props.history.squares.map((step, move) => {
        const desc = move ? 'Go to move #' + move : 'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => props.onClick(move)}>{desc}</button>
            </li>
        )
    });

    return moves;
}