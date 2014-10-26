/**
 * Command pattern module that provides a means undo/redo functionality.
 */

( function (exports) {
	'use strict';

	// Stack containing previously executed commands.
	var pastCommands = [];

	// Stack containing the commands that have been undone.
	var undoneCommands = [];

	function CommandManager() {}

	exports.CommandManager = CommandManager;

	CommandManager.prototype = {
		add: function ( command ) {
			pastCommands.push( command );
		},
		undo: function () {
			if ( pastCommands.length === 0 ) {
				return;
			}

			var command = pastCommands.pop();
			command.unexecute.func.apply( command.context, command.unexecute.args );
			undoneCommands.push( command );
		},
		redo: function () {
			if ( undoneCommands.length === 0 ) {
				return;
			}

			var command = undoneCommands.pop();
			command.execute.func.apply( command.context, command.execute.args );
			pastCommands.push( command );
		},
		clear: function () {
			pastCommands = [];
			undoneCommands = [];
		}
	};

	return this;
}(this) );
