( function ( exports ) {

	// Prevent 'this' coercion, silent errors, implied globals,
	// disallows 'with' keyword, etc.
	'use strict';

	// We need EventEmitter to raise events. We'll use very basic dependency management here,
	// since requireJS, AMD, etc are a tad more involved and time is limited.
	if ( typeof exports.EventEmitter === 'undefined' ) {
		throw Error( 'Sudoku: Dependency EventEmitter not found.' );
	}







	/**
	 *  		Private members.
	 */


	// Typically, sudoku is arranged on a 9x9 board, but let's not completely hard-code it.
	// TODO: Support varying board sizes.
	var boardSize = 9;
	var boxWidth = 3;
	var boxHeight = 3;
	var boxesPerRow = 3;
	var boxesPerColumn = 3;











	/**
	 * 			Initialization.
	 */
	
	 /**
	  * Constructor for the Sudoku object.
	  * @param {string} board         String representing the board with the answers.
	  * @param {string} revealedBoard String representing the revealed portion of the board.
	  */
	function Sudoku( board, revealedBoard ) {

		// The Sudoku cells themselves. Each element should be an object with
		// { value: ([1-9]{1}|null) answer: [1-9] }
		this.cells = [
			[]
		];

		this.initializeBoard( board, revealedBoard );
	}

	exports.Sudoku = Sudoku;

	// Add EventEmitter properties to the Sudoku model. Necessary to raise events.
	Sudoku.prototype = Object.create( exports.EventEmitter.prototype );






	/**
	* 			Public methods.
	*/


	/**
	 * Initializes the sudoku board, and verifies that it is worth initializing.
	 * @param  {Array} answerBoard   The board with ALL the answers.
	 * @param  {Array} revealedBoard The board with only some of the answers.
	 */
	Sudoku.prototype.initializeBoard = function ( answerBoard, revealedBoard ) {

		// TODO: Support varying board sizes.
		if ( typeof answerBoard !== 'string' || answerBoard.length !== boardSize *
			boardSize ) {
			throw Error( 'Board size incorrect: Expected ' + boardSize + 'x' +
				boardSize + ', but instead got ' + answerBoard.length );
		}

		// Convert strings to an array of ints.
		answerBoard = answerBoard.split( '' )
			.map( function ( a ) {
				return parseInt( a, 10 );
			} );

		revealedBoard = revealedBoard.split( '' )
			.map( function ( a ) {
				return ( /[1-9]+/.test( a ) === true ) ? parseInt( a, 10 ) : a;
			} );

		// Place into this.cells.
		for ( var row = 0; row < boardSize; row++ ) {
			this.cells[ row ] = [];
			for ( var col = 0; col < boardSize; col++ ) {
				this.cells[ row ][ col ] = {
					value: revealedBoard[ ( boardSize * row ) + col ],
					answer: answerBoard[ ( boardSize * row ) + col ]
				};
			}
		}

		// It's possible that the board supplied has some errors.
		// Do some sanity checks.
		if ( this.isValidBoard() !== true ) {
			throw Error( 'Supplied board is invalid.' );
		}
	};

	// Validating and verifying the solution is simpler if box, row, and column
	// arrays are flattened and grouped.
	
	/**
	 * Retrieves all the rows, columns, and boxes.
	 * @return {Array} All the rows, columns, and boxes.
	 */
	Sudoku.prototype.getCellGroups = function () {
		var groups = [];

		for ( var row = 0; row < this.cells.length; row++ ) {
			groups.push( this.getRow( row ) );
		}

		for ( var column = 0; column < this.cells[ 0 ].length; column++ ) {
			groups.push( this.getColumn( column ) );
		}

		for ( var box = 0; box < 9; box++ ) {
			groups.push( this.getBox( box ) );
		}

		return groups;
	};

	/**
	 * Determines whether or not the current board is valid.
	 * @return {Boolean} Indication of validity.
	 */
	Sudoku.prototype.isValidBoard = function () {

		var groups = this.getCellGroups();


		for ( var group = 0; group < groups.length; group++ ) {
			for ( var cell = 0; cell < groups[ group ].length; cell++ ) {

				// For readability.
				var a = groups[ group ][ cell ];

				// Not necessary to use a hashtable here, since we have the indexes already.
				var usedNumbers = [];

				// If the cell is empty, or not an acceptable number, or the number already appeared,
				// then the board is not valid.
				if ( a.answer === null || /[1-9]+/.test( a.answer ) === false ||
					typeof usedNumbers[ a.answer ] !== 'undefined' ) {
					return false;
				}

				// Mark the number as used.
				usedNumbers[ a.answer ] = true;
			}
		}

		return true;
	};

	/**
	 * Determines whether or not the board has been solved.
	 * @return {Boolean} Returns true if solved.
	 */
	Sudoku.prototype.isSolved = function () {

		var groups = this.getCellGroups();


		for ( var group = 0; group < groups.length; group++ ) {
			for ( var cell = 0; cell < groups[ group ].length; cell++ ) {

				// At this point, the board should already be valid, so
				// we just need to check to see if the input is the same as the answer.
				if ( groups[ group ][ cell ].value !== groups[ group ][ cell ].answer ) {
					return false;
				}
			}
		}

		return true;
	};

	/**
	 * Retrieves a sudoku box/square.
	 * @param  {int} 	box 	The index of the box. Ranges from 0-8.
	 * @return {Array}     		The cells within the box.
	 */
	Sudoku.prototype.getBox = function ( box ) {
		var boxCells = [];

		var boxRowStart = Math.floor( box / boxesPerRow ) * boxHeight;
		var boxColumnStart = Math.floor( box % boxesPerColumn );

		// Iterate over every row in the box.
		for ( var row = boxRowStart; row < boxRowStart + boxHeight; row++ ) {
			// Select the columns on this row.
			boxCells = boxCells.concat( this.cells[ row ].slice( boxColumnStart,
				boxColumnStart + boxWidth ) );
		}

		return boxCells;
	};

	/**
	 * Retrieves a row on the board.
	 * @param  {int} 	row 	Row index.
	 * @return {Array}     		The cells in the row.
	 */
	Sudoku.prototype.getRow = function ( row ) {
		return this.cells[ row ];
	};

	/**
	 * Retrieves the column on the board.
	 * @param  {int} 	column 	Column index.
	 * @return {Array}        	The cells within the column.
	 */
	Sudoku.prototype.getColumn = function ( column ) {
		var columnCells = [];

		for ( var row = 0; row < this.cells.length; row++ ) {
			columnCells.push( this.cells[ row ][ column ] );
		}

		return columnCells;

	};

	// Revealing module pattern/module pattern typically does NOT attach to the
	// object's prototype, however, there could potentially be multiple instances of
	// Sudoku, so for performance reasons we'll do exactly that.
	
	/**
	 * Sets the specified cell to the specified value.
	 * @param {int} 	row    Row index.
	 * @param {column} 	column Column index.
	 * @param {mixed} 	value  The value to set the cell to.
	 */
	Sudoku.prototype.setCell = function ( row, column, value ) {
		var previousValue = this.getCell( row, column );

		// No change? Why bother doing anything?
		if ( previousValue === value ) {
			return;
		}

		// This is where the magic happens.
		this.cells[ row ][ column ].value = value;

		// Inform our subscribers.
		this.emit( 'cellchanged', row, column, value, previousValue );

		if ( this.isSolved() ) {
			this.emit( 'solved', null );
		}
	};

	/**
	 * Retrieves the current value in the cell.
	 * @param  {int} 	row    	Row index.
	 * @param  {int} 	column 	Column index.
	 * @return {mixed}        	Cell value.
	 */
	Sudoku.prototype.getCell = function ( row, column ) {
		return this.cells[ row ][ column ].value;
	};

	/**
	 * Retrieves the current board size. (It's width and height.)
	 * @return {int} The board's height or width.
	 */
	Sudoku.prototype.getBoardSize = function () {
		return boardSize;
	};

	return this;

}( this ) );
