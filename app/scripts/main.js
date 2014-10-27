
$(function() {
	'use strict';


	// These are the only boards available. No random ones, yet.
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

	// Wire up events.
	sudoku
		.on('cellchanged', function(row, column, value){
			$('div.cell[data-row='+row+'][data-column='+column+']').text(value);
		})
		.on('solved', function(){
			solvedOverlay.css('visibility', 'visible');
		});



	var solvedOverlay = $([
						'<div class="solved-overlay">',
							'Solved!',
						'</div>'
						].join(''));

	// var undoButton = $([
	// 					'<div class="undo-button">',
	// 						'Undo',
	// 					'</div>'
	// 					].join(''));
	//
	// var redoButton = $([
	// 					'<div class="undo-button">',
	// 						'Redo',
	// 					'</div>'
	// 					].join(''));




	// Set up undo/redo functionality.
	var commandManager = new CommandManager();
	var sudokuCommandManager = new SudokuCommandManager(sudoku, commandManager);






	// TODO: Make the selector a parameter?
	var container = $('div.sudoku');

	// Let's not create this function in a loop.
	var cellClickCallback = function(){
		var cellRow = parseInt($(this).attr('data-row'),10);
		var cellColumn = parseInt($(this).attr('data-column'),10);
		var currentValue = sudoku.getCell(cellRow, cellColumn);
		sudokuCommandManager.setCell( cellRow, cellColumn, currentValue === ' ' ? 1 : (currentValue % 9) + 1);
	};

	// Assemble the fragments.
	var boardFragment = $('<div class="board"></div');

	// Make a row.
	for (var row = 0; row < sudoku.getBoardSize(); row++) {
		var boardRow = $('<div class="row"></div>');

		// Make a column, and wire a click/touch event to it.
		for (var column = 0; column < sudoku.getBoardSize(); column++) {
			var val = sudoku.getCell(row,column);
			var cell = $('<div class="cell" data-row="'+row+'" data-column="'+column+'">'+(/\s/.test(val) === true ? '&nbsp;' : val )+'</div>');

			cell.on('click touch', cellClickCallback);

			cell.appendTo(boardRow);
		}

		boardRow.appendTo(boardFragment);
	}

	// Attach fragments.
	// undoButton.appendTo(container);
	boardFragment.appendTo(container);
	solvedOverlay.appendTo(container);
	// redoButton.appendTo(container);


});
