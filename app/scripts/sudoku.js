( function ( exports ) {

	// Prevent 'this' coercion, silent errors, implied globals,
	// disallows 'with' keyword, etc.
	'use strict';

	// We need EventEmitter to raise events. We'll use very basic dependency management here,
	// since requireJS, AMD, etc are a tad more involved and time is limited.
	if ( typeof exports.EventEmitter === 'undefined' ) {
		console.error( 'Sudoku: Dependency EventEmitter not found.' );
		return;
	}







	/**
	 *  		Private members.
	 */

	// The Sudoku cells themselves. Each element should be an object with
	// { value: ([1-9]{1}|null) answer: [1-9] }
	var cells = [
		[]
	];

	// Typically, sudoku is arranged on a 9x9 board, but let's not hard-code it.
	// TODO: Support varying board sizes.
	var boardSize = 9;
	var boxWidth = 3;
	var boxHeight = 3;
	var boxesPerRow = 3;
	var boxesPerColumn = 3;








	/**
	 * 			Private methods.
	 */

	function initializeBoard( answerBoard, revealedBoard ) {

		// TODO: Support varying board sizes.
		if ( typeof answerBoard !== 'string' || answerBoard.length !== boardSize * boardSize ) {
			console.error( 'Board size incorrect: Expected ' + boardSize + 'x' +
				boardSize + ', but instead got ' + answerBoard.length );
			return;
		}

		// Convert strings to an array of ints.
		answerBoard = answerBoard.split( '' )
			.map( function ( a ) {
				return parseInt(a,10);
			} );

		revealedBoard = revealedBoard.split( '' )
			.map( function ( a ) {
				return parseInt(a,10);
			} );

		// Place into cells.
		for ( var row = 0; row < boardSize; row++ ) {
			cells[ row ] = [];
			for ( var col = 0; col < boardSize; col++ ) {
				cells[ row ][ col ] = {
					value: revealedBoard[ ( boardSize * row ) + col ],
					answer: answerBoard[ ( boardSize * row ) + col ]
				};
			}
		}

		// It's possible that the board supplied has some errors.
		// Do some sanity checks.
		if( isValidBoard( ) !== true )
		{
			console.error('Supplied board is invalid.');
			return;
		}
	}

	// Validating and verifying the solution is simpler if box, row, and column
	// arrays are flattened and grouped.
	function getCellGroups()
	{
		var groups = [];

		for ( var row = 0; row < cells.length; row++ ) {
			groups.push( getRow( row ) );
		}

		for ( var column = 0; column < cells[ 0 ].length; column++ ) {
			groups.push( getColumn( column ) );
		}

		for ( var box = 0; box < 9; box++ ) {
			groups.push( getBox( box ) );
		}

		return groups;
	}
	function isValidBoard(  ) {

		var groups = getCellGroups();

		// Could use for loops for performance gains here, but for the sake of readability,
		// we'll use built-in forEach methods.
		groups.forEach(function(group){

			group.forEach(function(cell){

					// Not necessary to use a hashtable here, since we have the indexes already.
					var usedNumbers = [];

					// If the cell is empty, or not an acceptable number, or the number already appeared,
					// then the board is not valid.
					if ( cell.answer === null || /[1-9]+/.test( cell.answer ) === false || typeof usedNumbers[ cell.answer ] !== 'undefined' )
					{
						return false;
					}

					// Mark the number as used.
					usedNumbers[ cell.answer ] = true;
			});
		});

		return true;
	}

	function isSolved(  ) {

		var groups = getCellGroups();

		// Could use for loops for performance gains here, but for the sake of readability,
		// we'll use built-in forEach methods.
		groups.forEach(function(group){

			group.forEach(function(cell){

					// Not necessary to use a hashtable here, since we have the indexes already.
					var usedNumbers = [];

					// At this point, the board should already be valid, so
					// we just need to check to see if the input is the same as the answer.
					if ( cell.value !== cell.answer )
					{
						return false;
					}

					// Mark the number as used.
					usedNumbers[ cell.value ] = true;
			});
		});

		return true;
	}

	function getBox( box ) {
		var boxCells = [];

		var boxRowStart = Math.floor(box / boxesPerRow) * boxHeight;
		var boxColumnStart = Math.floor(box % boxesPerColumn);

		// Iterate over every row in the box.
		for ( var row = boxRowStart; row < boxRowStart + boxHeight; row++ ) {
			// Select the columns on this row.
			boxCells = boxCells.concat( cells[ row ].slice( boxColumnStart, boxColumnStart + boxWidth ) );
		}

		return boxCells;
	}

	function getRow( row ) {
		return cells[ row ];
	}

	function getColumn( column ) {
		var columnCells = [];

		for ( var row = 0; row < cells.length; row++ ) {
			columnCells.push( cells[ row ][ column ] );
		}

		return columnCells;
	}







	/**
	 * 			Initialization.
	 */

	function Sudoku( board, revealedBoard ) {
		initializeBoard( board, revealedBoard );
	}

	exports.Sudoku = Sudoku;

	// Add EventEmitter properties to the Sudoku model. Necessary to raise events.
	Sudoku.prototype = Object.create( exports.EventEmitter.prototype );








	/**
	 * 			Public methods.
	 */

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
		cells[ row - 1 ][ column - 1 ].value = value;

		// Inform our subscribers.
		this.emit( 'cellchanged', args.concat( previousValue ) );

		// // State change.
		// commandManager.add( {
		// 	context: this,
		// 	execute: {
		// 		func: this.setCell,
		// 		args: arguments
		// 	},
		// 	unexecute: {
		// 		func: this.setCell,
		// 		args: [row, column, previousValue]
		// 	}
		// } );
	};

	Sudoku.prototype.getCell = function ( row, column ) {
		return cells[ row  ][ column  ].value;
	};

	return this;

}( this ) );
