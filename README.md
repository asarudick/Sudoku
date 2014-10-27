Sudoku
======


Core Technologies
---

**Grunt**: Simple to use npm task module that can do just about anything.

**Sass**: When CSS collides with variables, partials, and nesting, you get sass. This wasn't leveraged as much as it could be, since 
projects such as these don't have an extensive amount of css rules to merit separating them all into respective categories such as
typography, grid, layout, color scheme, reset, shame, etc. 

**Jade**: One of Node's templating engines. Didn't get much use here, since it's a simple interface, but theres a build task in place for future endeavors.

**Yeoman**: Much credit to Addy Osmani and the Google team for this one. Yeoman is a project scaffolding tool that will perform all the initial
setup to get you started. For this particular exercise, generator-webapp was used over generator-gulp-webapp simply due to familiarity and 
the fact that gulp has some minor ground to cover in respect to the available build tasks.

**Bower**: Package manager for the web. Very much akin to node's npm, but intended to manage javascript libraries such as jquery, zepto, underscore, etc. for
your web app.

**Mocha/Chai**: TDD/BDD Test framework. Quite a few bugs were exposed thanks to Mocha. 

Structure
---

Overall, the most structured portion of the app itself is certainly the javascript. 

**Sudoku.js**:  Decoupled from everything except EventEmitter, which essential adds what is considered native to most programming languages: Events. 

**CommandManager.js**: Implements the Command Pattern.

**SudokuCommandManager.js**:  As the name implies, manages the integration of functionality between CommandManager.js and Sudoku.js. 

**main.js**: Integrates the above into the interface/view.


On the Horizon
---

Unfortunately, there wasn't enough time to implement more than basic functionality. 

If there were more hours in the day:
- The undo/redo buttons would be in there(The functionality is actually already there, just not wired to any button.)
- CDN sources would be preferred over self-hosted libraries.
- Boards could be randomly generated.
- Pressing particular elements would generate visual feedback(e.g. Buttons would appear pressed.)
- The implementation of detecting a solved board would be rewritten to ones with more than one solution.
- Users would be able to get a hint to get unstuck in the midst of the game.
- Marking/annotating capabilities would be implemented for users with screens large enough.
- It would have a more pleasing color scheme/aesthetic.
- There would be a better means of user input. Too many taps/clicks are involved.
- Allow for varying sized boards, and differing difficulty levels.
- Multi-ball!



To Run: npm/bower install, "grunt serve", or simply go here -> http://shabonkerz.github.io/ 
