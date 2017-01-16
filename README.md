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

Images, fonts, tables, ansi styles and compositing in Node.js & the browser. 100% JS.

In the beginning there was [colors.js](https://github.com/Marak/colors.js) but in the fine tradition of vendors calling out a problem they have the solution to, [chalk](https://github.com/yeoman/yo/issues/68) was introduced. In that same vein, I offer `ascii-art` as an update, expansion and generalization of [MooAsciiArt](http://mootools.net/forge/p/mooasciiart) and at the same time it can replace your existing ansi colors library.

It features support for [Images](docs/Images.md), [Styles](docs/Styles.md), [Tables](docs/Tables.md) and [Figlet Fonts](docs/Figlet.md) as well as handling multi-line joining automatically.

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
- **Loads nothing that isn't used** (Images, Fonts, Tables, Logic, etc.)


Installation
------------

	npm install ascii-art

If you want to use `.image()` or `.Image` you must install [canvas](https://www.npmjs.com/package/canvas) and if you want to run the chalk tests... you'll need to to install `require-uncached` as well.

On the Command Line
-------------------

If you want the gloabally available `ascii-art` you'll need to install with the `global` flag

	npm install -g ascii-art

Otherwise, the binary is available from your project root at `./node_modules/ascii-art/bin/ascii-art`

Look at a list of fonts from the maintainers of Figlet:

	ascii-art list all

Preview your font in a browser:

	ascii-art preview doom

Now, install a figlet font (globally)

	ascii-art install doom -g

Render some text

	ascii-art text -s green -F doom "some text"

list some graphics on `textfiles.com`

	ascii-art art textfiles.com

show a particular graphic from `textfiles.com`

	ascii-art art textfiles.com/art/nasa.vt

or render an image (use `npm run sample` to generate and view a gallery)

	ascii-art image path/to/my/file.jpg

In your Code
------------

####.style(options[, callback]) > String

Add ANSI styles to a string and return the result.


####.font(text, fontName[, style][, callback])

Render a string using a figlet font and add that to the buffer. There is a batch version of this function which does not chain and takes an array( `.strings()`).

####.image(options[, callback])

Create an image from the passed image and append that to the buffer

####.table(options[, callback])

Generate a table from the passed data, with support for many styles and append that to the buffer

####.artwork(options[, callback])

	fetch a graphic from a remote source and append it to the current buffer.

###In-Chain functions

The functions only exist on the chain and not on the root (`art.x().overlay()` not `art.overlay()`).

####.overlay(overlain, options[, callback]);

Inset the passed ascii graphic onto the existing buffer

####.lines(start, stop[, callback]);

subset the lines of the buffer

####.join(text[, callback]);

attach the given multi-line text to the current buffer at it's end.

Examples
--------

`ascii-art` allows you to construct complex ASCII/ANSI compositions easily.

Let's say you want to impress your friends with oblique references to sci-fi but also address the challenges humanity faces in regards to the environment, but to do it with a glib comedic wit. I might try something like:

	art.artwork({
		artwork:'textfiles.com/art/st-char.asc'
	}).lines(31, 45, function(rendered){
		//cleanup non-unix terminators
		rendered = rendered.replace(/\r/g, '');
		rendered = colorInBonesShirt(rendered);
		art.image({
			filepath :'~/Images/earth_in_space.jpg',
			alphabet : 'ultra-wide'
		}).overlay(rendered, {
			x: 0,
			y: -1,
			style: 'red+blink',
			transparent: '&'
		}, function(final){
			console.log(final);
		});
	});

to get:

![Mixed Content Example](http://patternweaver.com/Github/Ascii/docs/bones_earth.png)

Or maybe I've got A BBS wall I want to have some dynamic info on.. I could make that with:

	art.font('Ghost Wire BBS', 'Doom', function(logo){
	    art.font('No place like home', 'rusted', function(subtext){
	        art.table({
	            verticalBar : ' ',
	            horizontalBar : ' ',
	            intersection : ' ',
	            data:[
	                {name: art.style('current users', 'red'), value: '203'},
	                {name: 'operator', value: 'vince.vega'},
	                {name: 'dial-in', value: '(917)555-4202'},
	            ]
	        }).lines(2, function(table){
	            art.image({
	                filepath :'~/Images/starburst_red.jpg',
	                alphabet : 'ultra-wide'
	            }).lines(2, 30).overlay(logo, {
	                x: 0,
	                y: 0,
	                style: 'blue',
	            }).overlay(subtext, {
	                x: 19,
	                y: 8,
	                style: 'yellow',
	            }).overlay(table, {
	                x: -1,
	                y: -1,
	                style: 'green',
	            }, function(final){
	                console.log(final);
	            });
	        });
	    });
	});

![Mixed Content Example](http://patternweaver.com/Github/Ascii/docs/ghostwire.png)


Sometimes we have to create a splash for an intranet app:

    art.image({
    	width : 40,
    	filepath : parentDir+'/Images/initech.png',
    	alphabet : 'wide'
    }).font('INITECH', 'Doom', 'cyan', function(ascii){
		console.log(ascii);
    });

Which produces (from [this](Images/initech.png) and [this](Fonts/Doom.flf)):

![Mixed Content Example](http://patternweaver.com/Github/Ascii/docs/initech.png)

I used to have an apartment in Savannah in the mid 90s where a young artist slapped a (now well known) sticker on the door. I came home to see this sticker everyday for quite a while, so it became an old friend. But when you digitize an image, the text becomes unreadable... so to recreate that image in ascii would take a bunch of tedious hand work, so what would it take to regenerate that?

	art.table({
	    data:[
	        {text: '    .\'ANDRE.    '},
	        {text: '   ..THE.GIANT\'.  '},
	        {text: '.With.Bobby."The.Brain"'},
	        {text: '.Heenan.'}
	    ],
	    verticalBar : ' ',
	    horizontalBar : ' ',
	    intersection : ' '
	}).lines(2, function(table){
	    art.strings([
	        'ANDRE',
	        'the',
	        'GIANT',
	        'POSSE',
	        '7\'4"',
	        '520 LB'
	    ], 'rusted', function(andre, the, giant, posse, height, weight){
	        art.strings([ 'has', 'a'], 'twopoint', function(has, a){
	            art.image({
	                filepath :'/Images/andre_has_a_posse.jpeg',
	                alphabet : 'ultra-wide'
	            }).overlay(andre, {
	                x: 8, y: 4,
	                style: 'white'
	            }).overlay(the, {
	                x: 10, y: 7,
	                style: 'white',
	                transparent : true
	            }).overlay(giant, {
	                x: 8, y: 10,
	                style: 'white',
	                transparent : true
	            }).overlay(has, {
	                x: 10, y: 14,
	                style: 'white'
	            }).overlay(a, {
	                x: 13, y: 17,
	                style: 'white'
	            }).overlay(posse, {
	                x: 5, y: 20,
	                style: 'bright_black',
	                transparent: true
	            }).overlay(height, {
	                x: 59, y: 3,
	                style: 'bright_black',
	                transparent: true
	            }).overlay(weight, {
	                x: 59, y: 8,
	                style: 'bright_black',
	                transparent: true
	            }).overlay(table, {
	                x: 6, y: -6,
	                style: 'bright_black',
	                transparent: true
	            }, function(final){
	                console.log(final);
	            });
	        });
	    });
	});

![Mixed Content Example](http://patternweaver.com/Github/Ascii/docs/andre.png)

Now I can put it on any portal I like!

check out the [documentation](docs/Tables.md) for more examples!

Styles
------

| **Color Table**  | `color`       | bright_`color`  | `color`_bg| bright_`color`_bg|
| -----------------|---------------|-----------------|-----------|------------------|
| black   |![color](Images/c/black.png)|![color](Images/c/light_black.png)|![color](Images/c/black.png)|![color](Images/c/light_black.png)|
| red     |![color](Images/c/red.png)|![color](Images/c/light_red.png)|![color](Images/c/red.png)|![color](Images/c/light_red.png)|
| green   |![color](Images/c/green.png)|![color](Images/c/light_green.png)| ![color](Images/c/green.png)|![color](Images/c/light_green.png)|
| yellow  |![color](Images/c/yellow.png)|![color](Images/c/light_yellow.png)|![color](Images/c/yellow.png)|![color](Images/c/light_yellow.png)|
| blue    |![color](Images/c/blue.png)|![color](Images/c/light_blue.png)|![color](Images/c/blue.png) |![color](Images/c/light_blue.png)|
| cyan    |![color](Images/c/cyan.png)|![color](Images/c/light_cyan.png)|![color](Images/c/cyan.png) |![color](Images/c/light_cyan.png)|
| magenta |![color](Images/c/magenta.png)|![color](Images/c/light_magenta.png)|![color](Images/c/magenta.png)|![color](Images/c/light_magenta.png)|
| white   |![color](Images/c/gray.png)|![color](Images/c/light_gray.png)|![color](Images/c/gray.png)|![color](Images/c/light_gray.png)|

Styles are: *italic*, **bold**, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: underline overline">|framed|</span>, <span style="text-decoration: underline overline">|encircled|</span>, <span style="text-decoration: overline">overline</span>, <span style="text-decoration: blink">blink</span> and <span style="display:inline-block; background-color:#777777; color: white">&nbsp;inverse&nbsp;</span>.

For example: if I wanted underlined blue text on a white background, my style would be `underlined+blue+white_bg`. Check out the detailed [style docs](docs/Styles.md) for more information.


Compatibility
-------------
If you're a [chalk](https://www.npmjs.com/package/chalk) user, just use `var chalk = require('ascii-art/kaolin');` in place of your existing `chalk` references (Much of color.js, too... since chalk is a subset of colors.js). No migration needed, keep using the wacky syntax you are used to(In this mode, refer to their docs, not mine).

Users of [ascii-table](https://www.npmjs.com/package/ascii-table) will also note that interface is supported via `require('ascii-art').Table`, though our solution is ansi-aware, lazy rendering and better at sizing columns.

I may support the other [colors](https://www.npmjs.com/package/colors) stuff (extras & themes) eventually, but it's currently a low priority.


Roadmap
-------

####Goals
- Better Docs
- Color handling/256 color support
- value reversal (light vs dark)
- HTML output
- [ANSI art](https://en.wikipedia.org/wiki/ANSI_art) support
- More stuff!! (averagers, color profiles)
- true color (hex) support
- 2 colors per char (possibly zalgo-painting?)

####Non Goals

- realtime: videos, curses, etc.:
- logging integration


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
