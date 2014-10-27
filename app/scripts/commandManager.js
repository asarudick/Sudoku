/**
 * Command pattern module that provides a means undo/redo functionality.
 */

( function (exports) {
	'use strict';


	function CommandManager() {

		// Stack containing previously executed commands.
		this.pastCommands = [];

		// Stack containing the commands that have been undone.
		this.undoneCommands = [];
	}

	exports.CommandManager = CommandManager;

	CommandManager.prototype = {
		add: function ( command ) {
			this.pastCommands.push( command );
			console.log(this.pastCommands);
		},
		undo: function () {
			if ( this.pastCommands.length === 0 ) {
				return;
			}

			var command = this.pastCommands.pop();
			command.unexecute.func.apply( command.context, command.unexecute.args );
			this.undoneCommands.push( command );
		},
		redo: function () {
			if ( this.undoneCommands.length === 0 ) {
				return;
			}

			var command = this.undoneCommands.pop();
			command.execute.func.apply( command.context, command.execute.args );
			this.pastCommands.push( command );
		},
		clear: function () {
			this.pastCommands = [];
			this.undoneCommands = [];
		}
	};

}(this) );
