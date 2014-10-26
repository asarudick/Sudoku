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

		describe( 'setCell', function () {
			it( 'should set the cell at row 5, column 5 to 6', function () {
				sudoku.setCell( 5, 5, 6 );

				return sudoku.getCell( 5, 5 );
			} );
		} );

	} );
} )
.call( this );
