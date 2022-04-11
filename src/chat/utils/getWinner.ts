export const getWinner = (firstPlayer: string[], secondPlayer: string[]): { status: string, winner?: string } => {
  const [firstPlayerId, firstPlayerMove] = firstPlayer;
  const [secondPlayerId, secondPlayerMove] = secondPlayer;

  if (firstPlayerMove === 'scissors' && secondPlayerMove === 'paper') {
    return { status: 'win', winner: firstPlayerId };
  } else if (firstPlayerMove === 'paper' && secondPlayerMove === 'rock') {
    return { status: 'win', winner: firstPlayerId };
  } else if (firstPlayerMove === 'rock' && secondPlayerMove === 'scissors') {
    return { status: 'win', winner: firstPlayerId };
  } else if (firstPlayerMove === secondPlayerMove) {
    return { status: 'draw' };
  } else {
    return { status: 'win', winner: secondPlayerId };
  }
}