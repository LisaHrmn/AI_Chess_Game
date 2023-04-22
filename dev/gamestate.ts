class GameState {
    public kingPos: [number, number];               // position of the king in the game in board coordinates
    public knightPositions: [number, number][];     // position of the knights in the game in board coordinates

    constructor(kingPos: [number, number], knightPositions: [number, number][]) {
        this.kingPos = kingPos;
        this.knightPositions = knightPositions;
    }

    // return the value of the state and if the state is terminal (game over)
    // higher value is better gamestate for the king (100 is win, -100 is lose)
    public getScore() : [number, boolean] {
        // game over
        for (let z of this.knightPositions) {
            if (Board.samePosition(z, this.kingPos)) {
                return [-100, true];
            }
        }

        // win
        if (this.kingPos[1] == 0) {
            return[100, true];
        }

        // not over yet, return an evaluation of the gamestate
        // higher number is better for king, lower better for the knights
        let distance:number = 0

        this.knightPositions.forEach((knight)=>{
            distance += this.getDistance(knight[0], knight[1], this.kingPos[0], this.kingPos[1]);
        })

        let score = (distance / this.knightPositions.length) * 20 - 100;

        // Hint: use the position of the king stored in this.kingPos
        return [score, false]

        //more accurate this ^ till its close 
    }

    public getDistance(xA:number, yA:number, xB:number, yB:number) {
        let xDiff:number = xA - xB;
        let yDiff:number = yA - yB;

        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    // create a copy of the gamestate (needed by AI to look into the future)
    // needs positions of king and knights
    public copy() : GameState {
        const knightPosCopy  = Object.assign([], this.knightPositions);
        
        return new GameState(this.kingPos, knightPosCopy)
    }
}