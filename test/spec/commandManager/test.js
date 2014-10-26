/* global describe, it */

( function () {
	'use strict';
	describe( 'CommandManager Test Suite', function () {
		var commandManager = new CommandManager();
		var arr = [];


		var command = {
			context: this,
			execute: {
				func: function ( a ) {
					arr.push( a );
				},
				args: [ 1 ]
			},
			unexecute: {
				func: function () {
					arr.pop();
				},
				args: []
			}
		};

		describe( 'constructor', function () {
			it( 'should create an instance', function () {
				return expect( commandManager )
					.to.exist;
			} );
		} );

		describe( 'add and undo', function () {
			it( 'should add command and then undo', function () {
				command.execute.func.apply( this, command.execute.args );
				commandManager.add( command );
				commandManager.undo();

				return expect( arr )
					.to.have.length( 0 );

			} );
		} );

        describe( 'add, undo, redo', function () {
            it( 'should add command, undo, and then redo', function () {

                commandManager.redo();

                return expect( arr ).to.have.length( 1 );

            } );
        } );

        describe( 'add, undo, redo, and undo', function () {
            it( 'should add command, undo, redo, and then undo', function () {
                commandManager.undo();

                return expect( arr ).to.have.length( 0 );

            } );
        } );
	} );
} )
.call( this );
