/* global describe, it */

( function () {
	'use strict';
	describe( 'Sudoku Test Suite', function () {
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

		describe( 'constructor', function () {
			it( 'should create an instance', function () {
				return expect( sudoku )
					.to.exist;
			} );
		} );

		// For exposed private methods.
		if ( typeof sudoku.testExports !== 'undefined' ) {

			describe( 'getRow', function () {
				it( 'should get the first row', function () {
					var row = sudoku.testExports.getRow(0);
					return expect( row.map(function(a){ return a.answer;}) ).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
				} );
			} );

			describe( 'getColumn', function () {
				it( 'should get the first column', function () {
					var column = sudoku.testExports.getColumn(0);
					return expect( column.map(function(a){ return a.answer;}) ).to.eql([1, 7, 4, 2, 8, 5, 3, 9, 6]);
				} );
			} );

			describe( 'getBox', function () {
				it( 'should get the first box', function () {
					var box = sudoku.testExports.getBox(0);
					return expect( box.map(function(a){ return a.answer;}) ).to.eql([1, 2, 3, 7, 8, 9, 4, 5, 6]);
				} );
			} );

			describe( 'isValidBoard', function () {
				it( 'should be valid', function () {
					return expect( sudoku.testExports.isValidBoard() ).to.equal(true);
				} );
			} );

			describe( 'isSolved', function () {
				it( 'should not be solved', function () {
					return expect( sudoku.testExports.isSolved() ).to.equal(false);
				} );
			} );

			describe( 'isSolved', function () {
				it( 'should be solved', function () {

					// So we don't evaluate getBoardSize() everytime.
					var boardSize = sudoku.getBoardSize();

					for (var i = 0; i < boardSize; i++) {
						for (var j = 0; j < boardSize; j++) {
							sudoku.setCell(i,j, sudoku.testExports.cells[i][j].answer )
						}
					}
					return expect( sudoku.testExports.isSolved() ).to.equal(true);
				} );
			} );

			describe( 'Event: cellchanged', function () {
				it( 'should trigger \'cellchanged\' event', function () {

					var triggered = false;

					sudoku.on('cellchanged', function(args){triggered=true;});

					sudoku.setCell(0,0,2);

					return expect( triggered ).to.equal(true);
				} );
			} );

			describe( 'Event: cellchanged', function () {
				it( 'should not trigger \'cellchanged\' event', function () {

					var triggered = false;

					sudoku.on('cellchanged', function(args){triggered=true;});

					sudoku.setCell(0,0,2);

					return expect( triggered ).to.equal(false);
				} );
			} );

			describe( 'Event: solved', function () {
				it( 'should trigger \'solved\' event', function () {

					var triggered = false;

					sudoku.on('solved', function(args){triggered=true;});

					sudoku.setCell(0,0,1);

					return expect( triggered ).to.equal(true);
				} );
			} );

			describe( 'Event: solved', function () {
				it( 'should not trigger \'solved\' event', function () {

					var triggered = false;

					sudoku.on('solved', function(args){triggered=true;});

					sudoku.setCell(0,0,2);

					return expect( triggered ).to.equal(false);
				} );
			} );
		}

		describe( 'setCell/getCell', function () {
			it( 'should set the cell at row 5, column 5 to 6', function () {
				sudoku.setCell( 5, 5, 6 );

				return sudoku.getCell( 5, 5 );
			} );
		} );

	} );
} )
.call( this );
