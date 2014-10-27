// The SudokuCommandManager's sole purpose is to provide a means of interoperability
// between Sudoku and CommandManager without coupling them.


(function(exports) {


	// Prevent 'this' coercion, silent errors, implied globals,
	// disallows 'with' keyword, etc.
	'use strict';

	if ( typeof exports.Sudoku === 'undefined' ) {
		throw Error( 'SudokuCommandManager: Dependency Sudoku not found.' );
	}

	if ( typeof exports.CommandManager === 'undefined' ) {
		throw Error( 'SudokuCommandManager: Dependency CommandManager not found.' );
	}







	/**
	* 			Initialization.
	*/

	/**
	 * Bridge/Integrator object that provides a one-stop shop for all functionality that intersects CommandManager and Sudoku, 
	 * which isn't a whole lot, admittedly.
	 * @param {Sudoku} 			sudoku         The sudoku object.
	 * @param {CommandManager} 	commandManager The CommandManager instance to consume.
	 */
	function SudokuCommandManager( sudoku, commandManager ) {
		this.sudoku = sudoku;
		this.commandManager = commandManager;
	}

	exports.SudokuCommandManager = SudokuCommandManager;

	/**
	 * Sets the specified cell, and adds the command to the commandManager.
	 * @param {int} 	row    Row index.
	 * @param {int} 	column Column index.
	 * @param {mixed} 	value  The value to set it to.
	 */
	SudokuCommandManager.prototype.setCell = function( row, column, value )
	{
		var previousValue = this.sudoku.getCell(row, column);

		this.sudoku.setCell( row, column, value );

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
	};


})(this);
