import { readFileLines, reducers } from "./utils";
enum RPS {
  Rock,
  Paper,
  Scissors,
}

enum RoundOutcome {
  Win,
  Lose,
  Draw,
}
const RoundOutcomeScore: Record<RoundOutcome, number> = {
  [RoundOutcome.Win]: 6,
  [RoundOutcome.Lose]: 0,
  [RoundOutcome.Draw]: 3,
};
export const RPSScore: Record<RPS, number> = {
  [RPS.Rock]: 1,
  [RPS.Paper]: 2,
  [RPS.Scissors]: 3,
};

export const stringToRpsMap: Record<string, RPS> = {
  A: RPS.Rock,
  B: RPS.Paper,
  C: RPS.Scissors,
  X: RPS.Rock,
  Y: RPS.Paper,
  Z: RPS.Scissors,
};

export const computeOutcome = (player1: RPS, player2: RPS): RoundOutcome => {
  if (player1 === player2) {
    return RoundOutcome.Draw;
  } else {
    switch (player1) {
      case RPS.Rock:
        return player2 === RPS.Scissors ? RoundOutcome.Win : RoundOutcome.Lose;
      case RPS.Paper:
        return player2 === RPS.Rock ? RoundOutcome.Win : RoundOutcome.Lose;
      case RPS.Scissors:
        return player2 === RPS.Paper ? RoundOutcome.Win : RoundOutcome.Lose;
    }
  }
};

export const player2ToRpsStep1 = (player1: RPS, player2: string): RPS => {
  return stringToRpsMap[player2];
};

export const player2ToRpsStep2 = (player1: RPS, player2: string): RPS => {
  const neededOutcome =
    player2 === "X"
      ? RoundOutcome.Lose
      : player2 === "Y"
      ? RoundOutcome.Draw
      : RoundOutcome.Win;
  return [RPS.Paper, RPS.Rock, RPS.Scissors].find(
    (rps) => computeOutcome(rps, player1) === neededOutcome
  )!;
};

export const gameToResult = (
  game: string,
  player2ToRps: (p1: RPS, p2: string) => RPS
): number => {
  const [player1, player2] = game.split(" ");
  const player1RPS = stringToRpsMap[player1];
  const player2RPS = player2ToRps(player1RPS, player2);
  const outcome = computeOutcome(player2RPS, player1RPS);
  const scoreFromOutcome = RoundOutcomeScore[outcome];
  const scoreFromChosenRPS = RPSScore[player2RPS];
  return scoreFromOutcome + scoreFromChosenRPS;
};

const main = () => {
  const guide = readFileLines("input.txt");
  console.log(guide);

  const result = guide
    .map((game) => gameToResult(game, player2ToRpsStep1))
    .reduce(reducers.sumNum);
  console.log(result);
  const result2 = guide
    .map((game) => gameToResult(game, player2ToRpsStep2))
    .reduce(reducers.sumNum);
  console.log(result2);
};

main();
