var Halma = function(){
	var kBoardWidth = 9;
	var kBoardHeight= 9;
	var kPieceWidth = 25;
	var kPieceHeight= 25;
	var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
	var kPixelHeight= 1 + (kBoardHeight * kPieceHeight);

	var gCanvasElement;
	var gDrawingContext;
	var gPattern;

	var gPieces;
	var gNumPieces;
	var gSelectedPieceIndex;
	var gSelectedPieceHasMoved;
	var gMoveCount;
	var gMoveCountElem;
	var gGameInProgress;

	var Cell = function(row, column) {
		this.row = row;
		this.column = column;
	};

	var getCursorPosition = function(e) {
		/* returns Cell with .row and .column properties */
		var x;
		var y;
		if (e.pageX != undefined && e.pageY != undefined) {
		x = e.pageX;
		y = e.pageY;
		}
		else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		x -= gCanvasElement.offsetLeft;
		y -= gCanvasElement.offsetTop;
		x = Math.min(x, kBoardWidth * kPieceWidth);
		y = Math.min(y, kBoardHeight * kPieceHeight);
		var cell = new Cell(Math.floor(y/kPieceHeight), Math.floor(x/kPieceWidth));
		return cell;
	};

	var getCellInTexCoords = function(coords){
		
		var x = Math.min(coords[0], kBoardWidth * kPieceWidth);
		var y = Math.min(coords[1], kBoardHeight * kPieceHeight);
		var cell = new Cell(Math.floor(y/kPieceHeight), Math.floor(x/kPieceWidth));
		return cell;
	};

	this.halmaOnClick = function(coords) {
		var cell = getCellInTexCoords(coords);;
		for (var i = 0; i < gNumPieces; i++) {
			if ((gPieces[i].row == cell.row) && (gPieces[i].column == cell.column)) {
				clickOnPiece(i);
			return;
			}
		}
		clickOnEmptyCell(cell);
	};

	var clickOnEmptyCell = function(cell) {
		if (gSelectedPieceIndex == -1) { return; }
			var rowDiff = Math.abs(cell.row - gPieces[gSelectedPieceIndex].row);
			var columnDiff = Math.abs(cell.column - gPieces[gSelectedPieceIndex].column);
			if ((rowDiff <= 1) && (columnDiff <= 1)) {
				/* we already know that this click was on an empty square,
				so that must mean this was a valid single-square move */
				gPieces[gSelectedPieceIndex].row = cell.row;
				gPieces[gSelectedPieceIndex].column = cell.column;
				gMoveCount += 1;
				gSelectedPieceIndex = -1;
				gSelectedPieceHasMoved = false;
				drawBoard();
				return;
			}
			if ((((rowDiff == 2) && (columnDiff == 0)) || ((rowDiff == 0) && (columnDiff == 2)) ||
				((rowDiff == 2) && (columnDiff == 2))) && 
				isThereAPieceBetween(gPieces[gSelectedPieceIndex], cell)) {
					/* this was a valid jump */
					if (!gSelectedPieceHasMoved) {
						gMoveCount += 1;
					}
					gSelectedPieceHasMoved = true;
					gPieces[gSelectedPieceIndex].row = cell.row;
					gPieces[gSelectedPieceIndex].column = cell.column;
					drawBoard();
					return;
				}
				gSelectedPieceIndex = -1;
				gSelectedPieceHasMoved = false;
				drawBoard();
	};

	var clickOnPiece = function(pieceIndex) {
		if (gSelectedPieceIndex == pieceIndex) { return; }
		gSelectedPieceIndex = pieceIndex;
		gSelectedPieceHasMoved = false;
		drawBoard();
	};

	var isThereAPieceBetween = function(cell1, cell2) {
		/* note: assumes cell1 and cell2 are 2 squares away
		   either vertically, horizontally, or diagonally */
		var rowBetween = (cell1.row + cell2.row) / 2;
		var columnBetween = (cell1.column + cell2.column) / 2;
		for (var i = 0; i < gNumPieces; i++) {
		if ((gPieces[i].row == rowBetween) &&
			(gPieces[i].column == columnBetween)) {
			return true;
		}
		}
		return false;
	};

	var isTheGameOver = function() {
		for (var i = 0; i < gNumPieces; i++) {
		if (gPieces[i].row > 2) {
			return false;
		}
		if (gPieces[i].column < (kBoardWidth - 3)) {
			return false;
		}
		}
		return true;
	};

	var drawBoard = function() {
		if (gGameInProgress && isTheGameOver()) {
		endGame();
		}
		
		gDrawingContext.fillStyle = "#fff";
		gDrawingContext.fillRect(0, 0, kPixelWidth, kPixelHeight);

		gDrawingContext.beginPath();
		
		/* vertical lines */
		for (var x = 0; x <= kPixelWidth; x += kPieceWidth) {
		gDrawingContext.moveTo(0.5 + x, 0);
		gDrawingContext.lineTo(0.5 + x, kPixelHeight);
		}
		
		/* horizontal lines */
		for (var y = 0; y <= kPixelHeight; y += kPieceHeight) {
		gDrawingContext.moveTo(0, 0.5 + y);
		gDrawingContext.lineTo(kPixelWidth, 0.5 +  y);
		}
		
		/* draw it! */
		gDrawingContext.strokeStyle = "#ccc";
		gDrawingContext.stroke();
		
		for (var i = 0; i < 9; i++) {
		drawPiece(gPieces[i], i == gSelectedPieceIndex);
		}

		//gMoveCountElem.innerHTML = gMoveCount;

		saveGameState();
	};

	var drawPiece = function(p, selected) {
		var column = p.column;
		var row = p.row;
		var x = (column * kPieceWidth) + (kPieceWidth/2);
		var y = (row * kPieceHeight) + (kPieceHeight/2);
		var radius = (kPieceWidth/2) - (kPieceWidth/10);
		gDrawingContext.beginPath();
		gDrawingContext.arc(x, y, radius, 0, Math.PI*2, false);
		gDrawingContext.closePath();
		gDrawingContext.strokeStyle = "#000";
		gDrawingContext.stroke();
		if (selected) {
		gDrawingContext.fillStyle = "#000";
		gDrawingContext.fill();
		}
	};

	if (typeof resumeGame != "function") {
		saveGameState = function() {
			return false;
		};
		resumeGame = function() {
			return false;
		};
	}

	var newGame = function() {
		gPieces = [new Cell(kBoardHeight - 3, 0),
			   new Cell(kBoardHeight - 2, 0),
			   new Cell(kBoardHeight - 1, 0),
			   new Cell(kBoardHeight - 3, 1),
			   new Cell(kBoardHeight - 2, 1),
			   new Cell(kBoardHeight - 1, 1),
			   new Cell(kBoardHeight - 3, 2),
			   new Cell(kBoardHeight - 2, 2),
			   new Cell(kBoardHeight - 1, 2)];
		gNumPieces = gPieces.length;
		gSelectedPieceIndex = -1;
		gSelectedPieceHasMoved = false;
		gMoveCount = 0;
		gGameInProgress = true;
		drawBoard();
	};

	var endGame = function() {
		gSelectedPieceIndex = -1;
		gGameInProgress = false;
	};

	this.initGame = function(canvasElement, moveCountElement) {
		if (!canvasElement) {
			canvasElement = document.createElement("canvas");
			canvasElement.setAttribute("style", "display: none");
		canvasElement.id = "halma_canvas";
		//canvasElement.width = 491;
		//canvasElement.height = 491;
		
		//document.body.appendChild(canvasElement);
		}
		/*
		if (!moveCountElement) {
			moveCountElement = document.createElement("p");
		document.body.appendChild(moveCountElement);
		}
		*/
		gCanvasElement = canvasElement;
		gCanvasElement.width = kPixelWidth;
		gCanvasElement.height = kPixelHeight;
		//gCanvasElement.addEventListener("click", halmaOnClick, false);
		//gMoveCountElem = moveCountElement;
		gDrawingContext = gCanvasElement.getContext("2d");
		if (!resumeGame()) {
		newGame();
		}
	};
	
	this.GetCanvas = function(){
		return gCanvasElement;
	};
	
	this.GetState = function(){
		var state = {
			GameInProgress: gGameInProgress,
			Pieces: gPieces,
			SelectedPiece: gSelectedPieceIndex,
			SelectedPieceHasMoved: gSelectedPieceHasMoved,
			MoveCount: gMoveCount
		};
	
		return state;
	};
	
	this.SetState = function(state){
		gGameInProgress = state.GameInProgress;
		gPieces = state.Pieces;
		gSelectedPieceIndex = state.SelectedPiece;
		gSelectedPieceHasMoved = state.SelectedPieceHasMoved;
		gMoveCount = state.MoveCount;
		
		drawBoard();
	};
	
	var LivelyApp;
	this.SetLivelyApp = function(app){
		LivelyApp = app;
	}
	
	this.StartApp = function(){
		Lively3D.AllowAppStart(LivelyApp);
	}
};

var HalmaInit = function(Halma){
	var halmagame = new Halma();
	halmagame.initGame();
	
	var mouseclickFunc = function(data){
		halmagame.halmaOnClick(data.coord);
	};
	
	halmagame.EventListeners = {"click": mouseclickFunc };
	return halmagame;

};


var app = Lively3D.AddApplication('Halma', Halma, HalmaInit);
app.StartApp();