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

		/**
		 * Adds a command.
		 * @param {command} command The command to add.
		 */
		add: function ( command ) {
			this.pastCommands.push( command );
		},

		/**
		 * Undoes last command.
		 * @return {null}
		 */
		undo: function () {
			if ( this.pastCommands.length === 0 ) {
				return;
			}

			var command = this.pastCommands.pop();
			command.unexecute.func.apply( command.context, command.unexecute.args );
			this.undoneCommands.push( command );
		},

		/**
		 * Redoes last undone command.
		 * @return {null}
		 */
		redo: function () {
			if ( this.undoneCommands.length === 0 ) {
				return;
			}

			var command = this.undoneCommands.pop();
			command.execute.func.apply( command.context, command.execute.args );
			this.pastCommands.push( command );
		},

		/**
		 * Clears the command stacks.
		 * @return {null}
		 */
		clear: function () {
			this.pastCommands = [];
			this.undoneCommands = [];
		}
	};

}(this) );
