

( function () {
	'use strict';

	describe( 'SudokuCommandManager Test Suite', function () {
		var answerBoard = '123456789' +
			'789123456' +
			'456789123' +
			'234567891' +
			'891234567' +
			'567891234' +
			'345678912' +
			'912345678' +
			'678912345';

		var revealedBoard = '      7 9' +
			' 89      ' +
			'4    9  3' +
			'2       1' +
			'    3    ' +
			'  7      ' +
			'  5  8  2' +
			'9    56  ' +
			'   91  4 ';

		var sudoku = new Sudoku( answerBoard, revealedBoard );
		var commandManager = new CommandManager();

		// Gotta dig dependency injection.
		var sudokuCommandManager = new SudokuCommandManager( sudoku, commandManager );

		describe( 'constructor', function () {
			it( 'should create an instance', function () {
				return expect( sudokuCommandManager )
					.to.exist;
			} );
		} );

		describe( 'setCell', function () {
			it( 'should be able set a sudoku cell', function () {
				sudokuCommandManager.setCell(0,0,2);

				var cellValue = sudoku.getCell(0,0);
				return expect( cellValue ).to.equal(2);
			} );
		} );

		describe( 'undo', function () {
			it( 'should be able to undo last action', function () {
				commandManager.undo();
				var cellValue = sudoku.getCell(0,0);
				return expect( cellValue ).to.equal(' ');
			} );
		} );

		describe( 'redo', function () {
			it( 'should be able to redo last undone action', function () {
				commandManager.redo();
				var cellValue = sudoku.getCell(0,0);
				return expect( cellValue ).to.equal(2);
			} );
		} );

	} );
} )
.call( this );
