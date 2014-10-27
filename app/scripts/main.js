
$(function() {
	'use strict';



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

	sudoku.on('cellchanged', function(row, column, value){
		$('div.cell[data-row='+row+'][data-column='+column+']').text(value);
	});





	var commandManager = new CommandManager();

	var sudokuCommandManager = new SudokuCommandManager(sudoku, commandManager);







	var container = $('div.sudoku');

	var clickCallback = function(){

		var cellRow = parseInt($(this).attr('data-row'),10);
		var cellColumn = parseInt($(this).attr('data-column'),10);
		var currentValue = sudoku.getCell(cellRow, cellColumn);
		sudokuCommandManager.setCell( cellRow, cellColumn, currentValue === ' ' ? 1 : (currentValue % 9) + 1);
	};


	var boardFragment = $('<div class="board"></div');

	for (var row = 0; row < sudoku.getBoardSize(); row++) {
		var boardRow = $('<div class="row"></div>');

		for (var column = 0; column < sudoku.getBoardSize(); column++) {
			var val = sudoku.getCell(row,column);
			var cell = $('<div class="cell" data-row="'+row+'" data-column="'+column+'">'+(/\s/.test(val) === true ? '&nbsp;' : val )+'</div>');

			cell.on('click touch', clickCallback);

			cell.appendTo(boardRow);
		}

		boardRow.appendTo(boardFragment);
	}

	var solvedButton = $([
						'<div class="solvedoverlay">',
							'Solved!',
						'</div>'
						].join(''));

	boardFragment.appendTo(container);
	solvedButton.appendTo(container);


	sudoku.on('solved', function(){
		solvedButton.css('visibility', 'visible');
	});

});
