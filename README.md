	                   _  _                       _   
	                  (_)(_)                     | |  
	  __ _  ___   ___  _  _  ______   __ _  _ __ | |_ 
	 / _` |/ __| / __|| || ||______| / _` || '__|| __|
	| (_| |\__ \| (__ | || |        | (_| || |   | |_ 
	 \__,_||___/ \___||_||_|         \__,_||_|    \__|
	 
###ascii-art.js

[![NPM version](https://img.shields.io/npm/v/ascii-art.svg)]()
[![npm](https://img.shields.io/npm/dt/ascii-art.svg)]()
[![Travis](https://img.shields.io/travis/khrome/ascii-art.svg)]()
[![GitHub stars](https://img.shields.io/github/stars/khrome/ascii-art.svg?style=social&label=Star)](https://github.com/khrome/ascii-art)

Images, fonts and terminal styles in Node.js & the browser. 100% JS.

In the beginning there was [colors.js](https://github.com/Marak/colors.js) but in the fine tradition of vendors calling out a problem they have the solution to, [chalk](https://github.com/yeoman/yo/issues/68) was introduced. In that same vein, I offer `ascii-art` as an update, expansion and generalization of [MooAsciiArt](http://mootools.net/forge/p/mooasciiart) and at the same time it can replace your existing ansi colors library. 

It features support for [Images](docs/Images.md), [Styles](docs/Styles.md) and [Figlet Fonts](docs/Figlet.md) as well as handling multi-line joining automatically. 

Why would I use this instead of X?
----------------------------------
- **zero dependencies** - while the CL utility and test have dependencies, we will never call out to a module for what is supposed to be this lib's core competancy.
- **color profiles** support - other libraries assume you are running x11
- **no prototype manipulation** - No `String.prototype` usage. No `__proto__` usage. No BS.
- handles the ugly [intersection of **multiline text and ansi codes**](docs/Multiline.md) for you.
- runs in the **browser and Node.js** (CommonJS, AMD, globals or webpack)
- **JS + Canvas** Ascii image generation utilities in node don't actually touch any pixels, but usually call out to a binary, we do 100% of our transform in JS, which allows us plug into averaging, distance and other logic dynamically, in powerful ways.
- It **works like a package manager** for figlet fonts.
- The other libraries out there do too little and focus on logging above other domains.
- **Supports your existing API** We allow you to use the colors.js/chalk API *or* our own (where we reserve chaining for utility rather than code aesthetics).
- **Loads nothing that isn't used** (Images, Fonts, Image Logic, etc.)

	
On the Command Line
------------------

	npm install -g ascii-art
	
Look at a list of fonts from the maintainers of Figlet:

	ascii-art list all
	
Preview your font in a browser:

	ascii-art preview doom
	
Now, install a figlet font (globally)

	ascii-art install doom -g
	
Render some text

	ascii-art text -s green -F doom "some text"
	
or render an image (use `npm run sample` to generate and view a gallery)

	ascii-art image -f path/to/my/file.jpg
	
In your Code
------------
The font method also allows you to optionally pass styles and supports chaining, so if I want two strings rendered together:

    art.font('Prompt', 'Basic', 'red').font('v1', 'Doom', 'magenta', function(rendered){
        console.log(rendered);
    });
    
There is also an `image()` call in the chain, that requires `canvas` in Node.js and shims in the browser's `Canvas` object (but only when image is used, so that dependency is optional):

    art.image({
    	width : 40,
    	filepath : parentDir+'/Images/initech.png',
    	alphabet : 'wide'
    }).font('INITECH', 'Doom', 'cyan', function(ascii){
		console.log(ascii);
    });
    
Which produces (from [this](Images/initech.png) and [this](Fonts/doom.flf)):

![Mixed Content Example](http://patternweaver.com/Github/Ascii/docs/initech.png)

    
| **Color Table**  | `color`       | bright_`color`  | `color`_bg|
| -----------------|---------------|-----------------|-----------|
| black   |![color](Images/c/black.png)|![color](Images/c/light_black.png)|![color](Images/c/black.png)|
| red     |![color](Images/c/red.png)|![color](Images/c/light_red.png)|![color](Images/c/red.png)|
| green   |![color](Images/c/green.png)|![color](Images/c/light_green.png)| ![color](Images/c/green.png)|
| yellow  |![color](Images/c/yellow.png)|![color](Images/c/light_yellow.png)|![color](Images/c/yellow.png)|
| blue    |![color](Images/c/blue.png)|![color](Images/c/light_blue.png)|![color](Images/c/blue.png) |
| cyan    |![color](Images/c/cyan.png)|![color](Images/c/light_cyan.png)|![color](Images/c/cyan.png) |
| magenta |![color](Images/c/magenta.png)|![color](Images/c/light_magenta.png)|![color](Images/c/magenta.png)|
| white   |![color](Images/c/gray.png)|![color](Images/c/light_gray.png)|![color](Images/c/gray.png)|

Styles are: *italic*, **bold**, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: underline overline">|framed|</span>, <span style="text-decoration: underline overline">|encircled|</span>, <span style="text-decoration: overline">overline</span>, <span style="text-decoration: blink">blink</span> and <span style="display:inline-block; background-color:#777777; color: white">&nbsp;inverse&nbsp;</span>. 

For example: if I wanted underlined blue text on a white background, my style would be `underlined+blue+white_bg`. Check out the detailed [style docs](docs/Styles.md) for more information.


Compatibility
-------------
If you're a [chalk](https://www.npmjs.com/package/chalk) user, just use `var chalk = require('ascii-art/kaolin');` in place of your existing `chalk` references (Much of color.js, too... since chalk is a subset of colors.js). No migration needed, keep using the wacky syntax you are used to(In this mode, refer to their docs, not mine).

I may support the other [colors](https://www.npmjs.com/package/colors) stuff (extras & themes) eventually, but it's currently a low priority.

	
Upcoming Features
-----------------
- A wider set of color profiles for color accuracy
- 256 color support
- true color (hex) support
- HTML .style() output
- HTML tag support
- More built-in averagers

Non Goals
---------

- ascii videos: 
- 


Testing
-------
In the root directory run:

	npm run test
	
which runs the test suite directly. In order to test it in Chrome try:

	npm run browser-test
	
In order to run the chalk test, use:

	npm run chalk-test
	
Please make sure to run the tests before submitting a patch and report any rough edges. Thanks!

Enjoy,

-Abbey Hawk Sparrow