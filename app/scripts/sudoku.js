( function ( exports ) {

	// Prevent 'this' coercion, silent errors, implied globals,
	// disallows 'with' keyword, etc.
	'use strict';

	// We need EventEmitter to raise events. We'll use very basic dependency management here,
	// since requireJS, AMD, etc are a tad more involved and time is limited.
	if ( typeof exports.EventEmitter === 'undefined' ) {
		throw Error( 'Sudoku: Dependency EventEmitter not found.' );
		return;
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
	Sudoku.prototype.initializeBoard = function ( answerBoard, revealedBoard ) {

		// TODO: Support varying board sizes.
		if ( typeof answerBoard !== 'string' || answerBoard.length !== boardSize *
			boardSize ) {
			throw Error( 'Board size incorrect: Expected ' + boardSize + 'x' +
				boardSize + ', but instead got ' + answerBoard.length );
			return;
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
			return;
		}
	}

	// Validating and verifying the solution is simpler if box, row, and column
	// arrays are flattened and grouped.
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
	}

	Sudoku.prototype.isValidBoard = function () {

		var groups = this.getCellGroups();


		for ( var group = 0; group < groups.length; group++ ) {
			for ( var cell = 0; cell < groups[ group ].length; cell++ ) {

				// For readability.
				var cell = groups[ group ][ cell ];

				// Not necessary to use a hashtable here, since we have the indexes already.
				var usedNumbers = [];

				// If the cell is empty, or not an acceptable number, or the number already appeared,
				// then the board is not valid.
				if ( cell.answer === null || /[1-9]+/.test( cell.answer ) === false ||
					typeof usedNumbers[ cell.answer ] !== 'undefined' ) {
					return false;
				}

				// Mark the number as used.
				usedNumbers[ cell.answer ] = true;
			}
		}

		return true;
	}

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
	}

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
	}

	Sudoku.prototype.getRow = function ( row ) {
		return this.cells[ row ];
	}

	Sudoku.prototype.getColumn = function ( column ) {
		var columnCells = [];

		for ( var row = 0; row < this.cells.length; row++ ) {
			columnCells.push( this.cells[ row ][ column ] );
		}

		return columnCells;

	}

	// Revealing module pattern/module pattern typically does NOT attach to the
	// object's prototype, however, there could potentially be multiple instances of
	// Sudoku, so for performance reasons we'll do exactly that.
	Sudoku.prototype.setCell = function ( row, column, value ) {
		var previousValue = this.getCell( row, column );

		// No change? Why bother doing anything?
		if ( previousValue === value ) {
			return;
		}

		// Your run of the mill i-need-arguments-with-array-functionality.
		var args = Array.prototype.slice.call( arguments, 0 );

		// This is where the magic happens.
		this.cells[ row ][ column ].value = value;

		// Inform our subscribers.
		this.emit( 'cellchanged', args.concat( previousValue ) );

		if ( this.isSolved() ) {
			this.emit( 'solved', null );
		}
	};

	Sudoku.prototype.getCell = function ( row, column ) {
		return this.cells[ row ][ column ].value;
	};

	Sudoku.prototype.getBoardSize = function () {
		return boardSize;
	};

	return this;

}( this ) );
