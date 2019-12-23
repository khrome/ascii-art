	                   _  _                       _
	                  (_)(_)                     | |
	  __ _  ___   ___  _  _  ______   __ _  _ __ | |_
	 / _` |/ __| / __|| || ||______| / _` || '__|| __|
	| (_| |\__ \| (__ | || |        | (_| || |   | |_
	 \__,_||___/ \___||_||_|         \__,_||_|    \__|

ascii-art.js
============

[![NPM version](https://img.shields.io/npm/v/ascii-art.svg)]()
[![npm](https://img.shields.io/npm/dt/ascii-art.svg)]()
[![Travis](https://img.shields.io/travis/khrome/ascii-art.svg)]()
[![GitHub stars](https://img.shields.io/github/stars/khrome/ascii-art.svg?style=social&label=Star)](https://github.com/khrome/ascii-art)

Images, fonts, tables, ansi styles and compositing in Node.js & the browser. 100% JS.  ([What is ASCII-Art?](https://github.com/khrome/ascii-art-docs/blob/master/History.md))

In the beginning there was [colors.js](https://github.com/Marak/colors.js) but in the fine tradition of vendors calling out a problem they have the solution to, [chalk](https://github.com/yeoman/yo/issues/68) was introduced. In that same vein, I offer `ascii-art` as an update, expansion and generalization of [MooAsciiArt](http://mootools.net/forge/p/mooasciiart) and at the same time it can replace your existing ansi colors library.

It features support for [Images](https://www.npmjs.com/package/ascii-art-image), [Styles](https://github.com/khrome/ascii-art-docs/blob/master/Styles.md), [Tables](https://www.npmjs.com/package/ascii-art-table), [Graphs](https://www.npmjs.com/package/ascii-art-graph) and [Figlet Fonts](https://www.npmjs.com/package/ascii-art-font) as well as handling multi-line joining and compositing automatically.

Why would I use this?
----------------------------------
- **modular** - small set of purpose built modules all interacting through a common ansi library.
- **color profiles** support - other libraries assume you are running x11
- **no prototype manipulation** - No `String.prototype` usage. No `__proto__` usage. No BS.
- handles the ugly [intersection of **multiline text and ansi codes**](https://github.com/khrome/ascii-art-docs/blob/master/Multiline.md) for you.
- runs in the **browser and Node.js** (CommonJS, AMD, globals or webpack)
- **JS + Canvas** Ascii image generation utilities in node don't actually touch any pixels, but usually call out to a binary, we do 100% of our transform in JS, which allows us plug into averaging, distance and other logic dynamically, in powerful ways.
- It **works like a package manager** for figlet fonts.
- The **other libraries** out there **do too little**, focus on logging above other domains and often unaware of ANSI controls(for example: style text, then put it in a table).
- **Supports your existing API** We allow you to use the colors.js/chalk API *or* our own (where we reserve chaining for utility rather than code aesthetics).
- **flexible output** Supports 4bit, 8bit and 32bit output


Installation
------------

	npm install ascii-art

If you'd like to use the command-line tool make sure to use `-g`

If you want to use `.image()` or `.Image` you must install [`canvas`](https://www.npmjs.com/package/canvas) and if you want to run the chalk tests... you'll need to to install `require-uncached` as well.


Styles
------

Add ANSI styles to a string and return the result.

| In your code                                    |         In the [Terminal](docs/Terminal.md)                           |
|-------------------------------------------------|---------------------------------------------------|
| `.style(text, style[, close]) > String`          | `ascii-art text -s green "some text"`             |

Styles are: *italic*, **bold**, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: underline overline">|framed|</span>, <span style="text-decoration: underline overline">|encircled|</span>, <span style="text-decoration: overline">overline</span>, <span style="text-decoration: blink">blink</span> and <span style="display:inline-block; background-color:#777777; color: white">&nbsp;inverse&nbsp;</span>. And available colors are:

**Colors**

Color defaults to 8 bit (most compatible), to enable other modes set booleans in the options:
- `is256` : compute the color using 256colors, as defined by ansi256. Note that full color output may need to tune the difference method to obtain optimal results.
- `isTrueColor` : do not constrain color and directly output RGB to the console.

Color Tables may be found in the style [documentation](https://github.com/khrome/ascii-art-docs/blob/master/Styles.md)

Fonts
-----

Render a string using a figlet font and add that to the buffer. There is a batch version of this function which does not chain and takes an array( `.strings()`).

| In your code                                    |         In the [Terminal](docs/Terminal.md)                           |
|-------------------------------------------------|---------------------------------------------------|
| `.font(text, font[, style][, callback])`    | `ascii-art text -F <font> "Demo!"`             |

Outputs

	______                          _
	|  _  \                        | |
	| | | |  ___  _ __ ___    ___  | |
	| | | | / _ \| '_ ` _ \  / _ \ | |
	| |/ / |  __/| | | | | || (_) ||_|
	|___/   \___||_| |_| |_| \___/ (_)

If you use UTF fonts your output looks more like:

![Mucha Lineart](https://github.com/khrome/ascii-art-docs/raw/master/Examples/u-gothic.png)

or

![Mucha Lineart](https://github.com/khrome/ascii-art-docs/raw/master/Examples/u-sansserif.png)

Check out the [documentation](https://www.npmjs.com/package/ascii-art-font) for more examples!

Images
------

Create an image from the passed image and append that to the buffer


|In your code                                     |         In the [Terminal](docs/Terminal.md)       |
|-------------------------------------------------|---------------------------------------------------|
| `.image(options[, callback])`                   | `ascii-art image path/to/my/file.jpg`             |

There are 2 options that are available which are not in the [image core](https://www.npmjs.com/package/ascii-art-image), they are:

- `lineart` : a boolean option which outputs lineart using block characters (which may be colored with `stroke` and customized with `threshold`(0-255))
- `stipple` : a boolean option which outputs lineart using braille characters (which may be colored with `stroke` and customized with `threshold`(0-255))
- `posterize` : use lineart on top of colored backgrounds to retain as much detail as possible

Because of the resolution downsampling, some finer details may be lost. Plan accordingly. Here's an example in 256 color (primarily greyscale):

```bash
ascii-art image -B 8 -C rankedChannel -a blocks node_modules/ascii-art/Images/grendel.jpg
```

![Grendel Compare](http://patternweaver.com/Github/Ascii/Images/grendel-compare.png)

Here's an example of `lineart` output:

![Mucha Stipple](https://github.com/khrome/ascii-art-docs/raw/master/Examples/mucha-lineart.png)

Here's an example of `posterize` output:

![Peewee Lineart](https://github.com/khrome/ascii-art-docs/raw/master/Examples/peewee-posterized.png)

Here's a comparison of various color output modes:

 ![Zero Cool Compare](http://patternweaver.com/Github/Ascii/Images/zero-cool-compare.png)

```bash

	#4bit
	ascii-art image -B 4 -a solid node_modules/ascii-art/Images/zero-cool.jpg

	#8bit
	ascii-art image -B 8 -C closestByIntensity -a solid node_modules/ascii-art/Images/zero-cool.jpg

	#32bit (on supported terminals)
	ascii-art image -B 32 -a solid node_modules/ascii-art/Images/zero-cool.jpg
```

Check out the [documentation](https://www.npmjs.com/package/ascii-art-image) for more examples!

Tables
------

Generate a table from the passed data, with support for many styles and append that to the buffer

| In your code                                    |         In the Terminal                           |
|-------------------------------------------------|---------------------------------------------------|
| `.table(options[, callback])`                   | N/A             |

![Styled Table Example](http://patternweaver.com/Github/Ascii/docs/ansi_table.png)

Check out the [documentation](https://www.npmjs.com/package/ascii-art-table) for more examples!

Graphs
------

Generate a graph from the passed data

| In your code                                    |         In the Terminal                           |
|-------------------------------------------------|---------------------------------------------------|
| `.graph(options[, callback])`                   | N/A                                               |

![Graph Example](https://github.com/khrome/ascii-art-graph/raw/master/simple-braille.png)

Check out the [documentation](https://www.npmjs.com/package/ascii-art-graph) for more examples!

Artwork
-------

fetch a graphic from a remote source and append it to the current buffer.

| In your code                                    |         In the [Terminal](docs/Terminal.md)                           |
|-------------------------------------------------|---------------------------------------------------|
| `.artwork(options[, callback])`                 | ascii-art art [source][/path]            |

Often I use this in conjunction with an image backdrop, for example to superimpose bones on the earth:

![Mixed Content Example](http://patternweaver.com/Github/Ascii/docs/bones_earth.png)


Compositing
-----------

We also support combining all these nifty elements you've made into a single composition, via a few functions available on the chains (`.lines()`, `.overlay()`, `.border()` and `.join()`). Maybe I've got A BBS wall I want to have some dynamic info on.. I could make that with [this](test/scripts/bbs.js)

![Mixed Content Example](http://patternweaver.com/Github/Ascii/Images/serious-business.png)

Check out the [documentation](https://github.com/khrome/ascii-art-docs/blob/master/Compositing.md) for detailed examples!


Promises
--------

Instead of providing a callback, you can also get a from the top level by calling `then` which lazily produces a promise, or you can use the old function, which is deprecated ( `.toPromise()`).

| In your code                                                    |
|-----------------------------------------------------------------|
| `.font(text, font[, style]).then(handler).catch(errHandler)`    |

Compatibility
-------------
If you're a [chalk](https://www.npmjs.com/package/chalk) user, just use `var chalk = require('ascii-art/kaolin');` in place of your existing `chalk` references (Much of color.js, too... since chalk is a subset of colors.js). No migration needed, keep using the wacky syntax you are used to(In this mode, refer to their docs, not mine).

Users of [ascii-table](https://www.npmjs.com/package/ascii-table) will also note that interface is supported via `require('ascii-art').Table`, though our solution is ansi-aware, lazy rendering and better at sizing columns.

I may support the other [colors](https://www.npmjs.com/package/colors) stuff (extras & themes) eventually, but it's currently a low priority.


Roadmap
-------

#### Goals
- Better Docs
- value reversal (light vs dark)
- HTML output
- piping support on the command line
- [ATASCII art](https://en.wikipedia.org/wiki/ATASCII) support
- [ANSI art](https://en.wikipedia.org/wiki/ANSI_art) support
- [PETSCII art](https://en.wikipedia.org/wiki/PETSCII) support
- 2 colors per char with multisampling
- REPL

#### Non Goals

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
