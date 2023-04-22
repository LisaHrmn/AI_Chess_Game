/// <reference path="knight.ts" />

class GameAI {
    // let the AI choose a move, and update both the
    // knight and the gamestate
    
    public static moveKnight(king: King, knights: Knight[], gameState: GameState) {

        let t0 = performance.now();

        let bestMoves:any = [];
        let scores = [];

        let gameStateCopy = gameState.copy();

        //how many moves to search
        let depth:number = 6;
        let depthCheck:number = 6;

        //loop knights and minimax 
        for (let cKnight = 0; cKnight < knights.length; cKnight++) {
            console.log('looping knights')
            minimax(depth, true, king, knights[cKnight], cKnight);
        }
        
        // Loop through all the best moves and push it in scores
        for (let i = 0; i < bestMoves.length; i++)
        {
            scores.push(bestMoves[i][0])
        }

        //find the best move
        let maxScore = Math.min(...scores);
        let indexMax = scores.indexOf(maxScore);
        let bestMove = bestMoves[indexMax]

        console.log(bestMove);
        //console.log(king); // only to avoid error: 'king' is declared but its value is never read.

        //Set the knight position with the best outcome on the board and set this in the real gamestate (so not the copied one)
        if(bestMove !== undefined)
        {
            knights[bestMove[2]].setPosition(bestMove[1]);
            gameState.knightPositions[bestMove[2]] = bestMove[1]
        }

        let t1 = performance.now();

        console.log("AI move took " + (t1 - t0) + " milliseconds.");


        function minimax(depth:number, maxPlayer:boolean, king: King, knight: Knight, cKnight: number)
        {
            // check if there are no moves te search or game is over, return value of the board
            if (depth === 0 || gameStateCopy.getScore()[0] == 100 || gameStateCopy.getScore()[0] == -100)
            {
                return [gameStateCopy.getScore()[0]];
            }

            // we want to find the best score we can get from current maxPlayer position
            if (maxPlayer)
            {
                let minEvaluation: any = +Infinity;

                // get the legal moves 
                const legalMoves = knight.getMoves(gameStateCopy.knightPositions[cKnight]);
                let oldPos = gameStateCopy.knightPositions[cKnight]

                // loop through all children of current position (all possible moves)
                for (const currentMove of legalMoves)
                {
                    gameStateCopy.knightPositions[cKnight] = currentMove;

                    //recursive call to minimax to find currentEvaluation score of each child
                    let currentEvaluation:any = minimax(depth - 1, false, king, knight, cKnight)

                    // find best score, it should be whichever is lower between currentEvaluation en minEvaluation
                    minEvaluation = Math.min(minEvaluation, currentEvaluation)

                    if(depth == depthCheck)
                    {
                        bestMoves.push([minEvaluation, currentMove, cKnight])
                    }
                    gameStateCopy.knightPositions[cKnight] = oldPos;
                }
                // return the minEvaluation
                return minEvaluation;
            } 
            //do ^ for the minimizing player too
            else
            {
                let maxEvaluation: any = -Infinity;

                const legalMoves = king.getMoves(gameState.kingPos);

                for (const currentMove of legalMoves)
                {
                    let oldPos = gameStateCopy.kingPos;
                    gameStateCopy.kingPos = currentMove;

                    let currentEvaluation:any = minimax(depth - 1, true, king, knight, cKnight);
                    
                    maxEvaluation = Math.max(maxEvaluation, currentEvaluation);

                    gameStateCopy.kingPos = oldPos;
                }
                return maxEvaluation;
            }
        }
    }
}



