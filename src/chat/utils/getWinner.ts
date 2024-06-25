export const getWinner = (
  firstPlayer: any,
  secondPlayer: any,
): { status: string; winner?: string, loser?: string } => {
  const [firstPlayerId, firstPlayerData] = firstPlayer;
  const [secondPlayerId, secondPlayerData] = secondPlayer;
  const firstPlayerMove = firstPlayerData.move;
  const secondPlayerMove = secondPlayerData.move;

  if (firstPlayerMove === 'scissors' && secondPlayerMove === 'paper') {
    return { status: 'win', winner: firstPlayerId, loser: secondPlayerId };
  } else if (firstPlayerMove === 'paper' && secondPlayerMove === 'rock') {
    return { status: 'win', winner: firstPlayerId, loser: secondPlayerId };
  } else if (firstPlayerMove === 'rock' && secondPlayerMove === 'scissors') {
    return { status: 'win', winner: firstPlayerId, loser: secondPlayerId };
  } else if (firstPlayerMove === secondPlayerMove) {
    return { status: 'draw' };
  } else {
    return { status: 'win', winner: secondPlayerId, loser: firstPlayerId };
  }
};
