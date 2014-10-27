// The SudokuCommandManager's sole purpose is to provide a means of interoperability
// between Sudoku and CommandManager without coupling them.


(function(exports) {


	// Prevent 'this' coercion, silent errors, implied globals,
	// disallows 'with' keyword, etc.
	'use strict';

	if ( typeof exports.Sudoku === 'undefined' ) {
		throw Error( 'SudokuCommandManager: Dependency Sudoku not found.' );
		return;
	}

	if ( typeof exports.CommandManager === 'undefined' ) {
		throw Error( 'SudokuCommandManager: Dependency CommandManager not found.' );
		return;
	}

	/**
	* 			Initialization.
	*/

	function SudokuCommandManager( sudoku, commandManager ) {
		this.sudoku = sudoku;
		this.commandManager = commandManager;
	}

	exports.SudokuCommandManager = SudokuCommandManager;

	SudokuCommandManager.prototype.setCell = function( row, column, value )
	{
		var previousValue = this.sudoku.getCell(row, column);

		this.sudoku.setCell.apply(this.sudoku, arguments);

		// State change.
		this.commandManager.add( {
			context: this.sudoku,
			execute: {
				func: this.sudoku.setCell,
				args: arguments
			},
			unexecute: {
				func: this.sudoku.setCell,
				args: [row, column, previousValue]
			}
		} );
	}


})(this);
