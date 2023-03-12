/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */


const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])



/* makeBoard: create in-JS board structure:
 * board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard(board) {

    for(let i = 0; i < HEIGHT; i++)
	board.push([]);

    for(let arr in board)
	for(let i = 0; i < WIDTH; i++)
	    board[arr].push([]);

    return board;
}


/* makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {

    /* select the table element. create a row labeled column-top
       and append it to the table. create eventlistener that is triggerd
       by any click in that row. creat WIDTH number of td elements
       and append to that row.
    */

    let htmlBoard = document.querySelector('#board');
    let top = document.createElement("tr");

    top.setAttribute("id", "column-top");
    top.addEventListener("click", handleClick);

    for (let x = 0; x < WIDTH; x++) {
	let headCell = document.createElement("td");
	headCell.setAttribute("id", x);
	top.append(headCell);
    }

    htmlBoard.append(top);


    /* create a row element then create and append WIDTH number of
    *  td elements to that row, then append the row to the table.
    *  do this for HEIGHT number of rows. 
    */
    
    for (let y = 0; y < HEIGHT; y++) {
	const row = document.createElement("tr");
	for (let x = 0; x < WIDTH; x++) {
	    const cell = document.createElement("td");
	    cell.setAttribute("id", `${y}-${x}`);
	    row.append(cell);
	}
	htmlBoard.append(row);
    }
}

/* findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {

    for (let i = 0; i < HEIGHT; i++)
	if (board[i][x].length == 0)
	    return  i;
    return NULL;
}

/* placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
    let player = `p${currPlayer}`;
    let newPiece = document.createElement("div");
    newPiece.setAttribute("class",player + " piece");
    let location = document.getElementById(`${y}-${x}`);
    location.append(newPiece);
}

/* endGame: announce game end */
function endGame(msg) {
    alert(msg,'Congratulations Game Over');
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {

  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
    let y = findSpotForCol(x);
    if (y === null) {
	return;
  }

    // place piece in board and add to HTML table

    placeInTable(HEIGHT - 1 - y,  x);
    board[y][x] = currPlayer;

    // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

    // check for tie
    let count = HEIGHT * WIDTH;
    for(let i = 0; i < HEIGHT; i++)
	for(let j = 0; j < WIDTH; j++)
	    if (board[i][j].length == 0)
		count--;

    if (count === (HEIGHT * WIDTH))
	endGame("IT IS A TIE");
	
    
  // switch players
    (currPlayer === 1) ? currPlayer = 2 : currPlayer = 1;
     
}

/* checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer


      /*
	Because you are enumerating every possiblity form every location
	some cells may be off the board. These checks make sure that
	all cells in the win are on the board and they all are the same
	player
	*/
    return cells.every(([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&  //once you are above row HEIGHT-4 you can't win vertically 
        x >= 0 &&   
        x < WIDTH &&  //once you are to the right of WIDTH-4 you cant win horizonntally
        board[y][x] === currPlayer
    );
  }

    /*
      start on 0-0 cell and check if there are 4 in the row horizontally to the right
      vertically up, diagonoally up to the right, and diagnolly up to the left.
    */

    for (var y = 0; y < HEIGHT; y++) {
	for (var x = 0; x < WIDTH; x++) {
	    var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; 
	    var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];  
	    var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
	    var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

	    if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
		return true;
	    }
	}
    }
}

makeBoard(board);
makeHtmlBoard();
