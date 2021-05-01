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
- **JS + Canvas** Ascii image generation utilities in node don't actually touch any pixels, but usually call out to a binary, we do 100% of our transform in JS, which allows us plug into averaging, distance and other logic dynamically, in powerful ways (In node this renders in cairo, via a Canvas shim).
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


<table><tr><td colspan="3">
	Change "Some Text" to be formatted with ansi codes for `green` (then have the colors reset at the end of the string)
</td></tr><tr><td valign="top">
<details><summary> JS </summary><p>

```javascript
    art.style("Some Text", 'green', true) //returns String
```

</p></details></td><td valign="top">

<details><summary> CL </summary><p>

```bash
    ascii-art text -s green "Some Text"
```

</p></details></td><td valign="top">

<details><summary> Web </summary><p>

```html
    <ascii-art-style
		style="green"
	>Some Text</ascii-art-style>
```
</p></details></td></tr></table>

Styles are: *italic*, **bold**, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: underline overline">|framed|</span>, <span style="text-decoration: underline overline">|encircled|</span>, <span style="text-decoration: overline">overline</span>, <span style="text-decoration: blink">blink</span> and <span style="display:inline-block; background-color:#777777; color: white">&nbsp;inverse&nbsp;</span>. And available colors are:

**Colors**

Color defaults to 8 bit (most compatible), to enable other modes set booleans in the options:
- `is256` : compute the color using 256colors, as defined by ansi256. Note that full color output may need to tune the difference method to obtain optimal results.
- `isTrueColor` : do not constrain color and directly output RGB to the console.

Color Tables may be found in the style [documentation](https://github.com/khrome/ascii-art-docs/blob/master/Styles.md)

Fonts
-----

Render a string using a figlet font and add that to the buffer. There is a batch version of this function which does not chain and takes an array( `.strings()`).

<table><tr><td colspan="3">
	Change "Some Text" to be formatted using the `doom.flf` font, which it will load from the predefined localtion (defaults to `/Fonts`)
</td></tr><tr><td valign="top">
<details><summary> JS </summary><p>

```javascript
    art.font("Some Text", 'doom', true) //returns String
```

</p></details></td><td valign="top">

<details><summary> CL </summary><p>

```bash
    ascii-art font -F doom "Some Text"
```

</p></details></td><td valign="top">

<details><summary> Web </summary><p>

```html
    <ascii-art-font
		font="doom"
	>Some Text</ascii-art-font>
```
</p></details></td></tr></table>

Outputs

	______                          _
	|  _  \                        | |
	| | | |  ___  _ __ ___    ___  | |
	| | | | / _ \| '_ ` _ \  / _ \ | |
	| |/ / |  __/| | | | | || (_) ||_|
	|___/   \___||_| |_| |_| \___/ (_)

If you use UTF fonts(Which are part of your systm fonts) your output looks more like:

![Gothic UTF font](https://github.com/khrome/ascii-art-docs/raw/master/Examples/u-gothic.png)

or

![Sans Serif UTF font](https://github.com/khrome/ascii-art-docs/raw/master/Examples/u-sansserif.png)

by using `u:<utf font name>` where the font names are: `default`, `script`, `script+bold`, `gothic`, `gothic+bold`, `serif+bold+italic`, `serif+bold`, `serif+italic`, `monospace`, `sansserif`, `sansserif+bold+italic`, `sansserif+bold`, `sansserif+italic`, `doublestrike`

Check out the [documentation](https://www.npmjs.com/package/ascii-art-font) for more examples!

Images
------

Create an image from the passed image and append that to the buffer

<table><tr><td colspan="3">
	This takes `myImage.jpg`, converts the colors to ansi backgrounds and then stipples the details at a threshold of 40 (of 255) using a higher resolution image and then renders that into a braille overlay in black(#000000) on top of the colors.
</td></tr><tr><td valign="top">
<details><summary> JS </summary><p>

```javascript
    art.image({
        src: "myImage.jpg",
        rows:80,
        cols:80,
        stipple:"#000000",
        posterize: true,
        threshold:40
    }, cb)
```

</p></details></td><td valign="top">

<details><summary> CL </summary><p>

```bash
    ascii-art image posterized stippled --rows=80 --cols=80 --stipple="#000000" --threshold=40 "Some Text"
```

</p></details></td><td valign="top">

<details><summary> Web </summary><p>

```html
    <ascii-art-image
        src="myImage.jpg"
        rows="80" cols="80"
        stipple="#000000"
        posterize
        threshold="40"
    ></ascii-art-image>
```
</p></details></td></tr></table>


There are 2 options that are available which are not in the [image core](https://www.npmjs.com/package/ascii-art-image), they are:

- `lineart` : a boolean option which outputs lineart using block characters (which may be colored with `stroke` and customized with `threshold`(0-255))
- `stipple` : a boolean option which outputs lineart using braille characters (which may be colored with `stroke` and customized with `threshold`(0-255))
- `posterize` : use lineart on top of colored backgrounds to retain as much detail as possible

Because of the resolution downsampling, some finer details may be lost. Plan accordingly. Here's an example in 256 color (primarily greyscale):

```bash
ascii-art image -B 8 -C rankedChannel -a blocks node_modules/ascii-art/Images/grendel.jpg
```

![Grendel Compare](https://github.com/khrome/ascii-art-docs/blob/master/Examples/grendel-compare.png?raw=true)

Here's an example of `lineart` output:

![Mucha Stipple](https://github.com/khrome/ascii-art-docs/raw/master/Examples/mucha-lineart.png)

Here's an example of `posterize` output:

![Peewee Lineart](https://github.com/khrome/ascii-art-docs/raw/master/Examples/peewee-posterized.png)

Here's a comparison of various color output modes:

 ![Zero Cool Compare](https://github.com/khrome/ascii-art-docs/blob/master/Examples/zero-cool-compare.png?raw=true)

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

![Styled Table Example](https://github.com/khrome/ascii-art-docs/blob/master/Examples/ansi_table.png?raw=true)

Check out the [documentation](https://www.npmjs.com/package/ascii-art-table) for more examples!

Graphs
------

Generate a graph from the passed data

| In your code                                    |         In the Terminal                           |
|-------------------------------------------------|---------------------------------------------------|
| `.graph(options[, callback])`                   | N/A                                               |

![Graph Example](https://github.com/khrome/ascii-art-graph/raw/master/simple-braille.png)

Check out the [documentation](https://www.npmjs.com/package/ascii-art-graph) for more examples!

Artwork[Non-Functional]
-------

Fetch a graphic from a remote source and append it to the current buffer, which is not enabled by default. You must add a `request` compatible library by either setting the ENV variable `ASCII_ART_REQUEST_MODULE` **or** by setting it manually with `art.setRequest(requestModule)`

| In your code                                    |         In the [Terminal](docs/Terminal.md)                           |
|-------------------------------------------------|---------------------------------------------------|
| `.artwork(options[, callback])`                 | ascii-art art [source][/path]            |

Often I use this in conjunction with an image backdrop, for example to superimpose bones on the earth:

![Mixed Content Example](https://github.com/khrome/ascii-art-docs/blob/master/Examples/bones_earth.png?raw=true)


Compositing
-----------

We also support combining all these nifty elements you've made into a single composition, via a few functions available on the chains (`.lines()`, `.overlay()`, `.border()`, `.strip()` and `.join()`). Maybe I've got A BBS wall I want to have some dynamic info on.. I could make that with [this](test/scripts/bbs.js)

![Mixed Content Example](http://patternweaver.com/Github/Ascii/Images/serious-business.png)

Check out the [documentation](https://github.com/khrome/ascii-art-docs/blob/master/Compositing.md) for detailed examples!


Promises
--------

Instead of providing a callback, you can also get a from the top level by calling `then` which lazily produces a promise.

| In your code(using .font() as an example)                       |
|-----------------------------------------------------------------|
| `art.font(text, font[, style]).then(handler).catch(errHandler)` |

Await
-----

| In your code(using .font() as an example)                       |
|-----------------------------------------------------------------|
| `let rendered = await art.font(text, font[, style]).completed()`|

Compatibility
-------------
If you're a [chalk](https://www.npmjs.com/package/chalk) user, just use `var chalk = require('ascii-art/kaolin');` in place of your existing `chalk` references (Much of color.js, too... since chalk is a subset of colors.js). No migration needed, keep using the wacky syntax you are used to(In this mode, refer to their docs, not mine).

Users of [ascii-table](https://www.npmjs.com/package/ascii-table) will also note that interface is supported via `require('ascii-art').Table`, though our solution is ansi-aware, lazy rendering and better at sizing columns.

I may support the other [colors](https://www.npmjs.com/package/colors) stuff (extras & themes) eventually, but it's currently a low priority.


Roadmap
-------

#### Goals
- Re-enable `.artwork()`
- Bring karma current, deprecate phantomjs
- artwork source standard
- Better Docs
- value reversal (light vs dark)
- HTML output
- piping support on the command line
- [ATASCII art](https://en.wikipedia.org/wiki/ATASCII) support
- [ANSI art](https://en.wikipedia.org/wiki/ANSI_art) support
- [PETSCII art](https://en.wikipedia.org/wiki/PETSCII) support
- 2 colors per char with multisampling
- Graph enhancements
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


Deprecations
------------

- `.artwork()` is currently non-functional while we enable an open-plugin standard, which will arrive shortly. When it does, you'll be able to plug any number of fetch solutions in, which hopefully matches whatever you currently bundle.
- `.toPromise()` is now deprecated in favor of `.completed()` and will be removed when 3.x arrives
- up to this point all files are UMD wrapped and may be used *without modification* in node(even old versions), the browser and via browser build systems. when 3.x arrives, the UMD versions may be part of an independent build process, while the mainline browser and node versions may continue to be uniform. If you have opinions on this, I'd like to hear them.


Development
-----------
**How to dev : the simple version**
- fork `ascii-art`
- `git clone git@github.com:<YOUR GITHUB USERNAME>/ascii-art.git`
- go into the checked out module `cd ascii-art`
- execute `./test/dev_setup.sh` (this will install a number of dependencies in the parent directory)

**How to dev : a better version**
- Fork all the ascii-art-modules(`ascii-art-image`, `ascii-art-ansi`, `ascii-art-braille`, `ascii-art-docs`, `ascii-art-font`, `ascii-art-utf`, `ascii-art-graph`, `ascii-art-table`), along with the root module.
- `git clone git@github.com:<YOUR GITHUB USERNAME>/ascii-art.git`
- go into the checked out module `cd ascii-art`
- `./dev_setup.sh <YOUR GITHUB USERNAME>`
- commit to your own branches master, then submit PRs from that to the master branch of the main repo.

After setup, run `npm test` to make sure everything is working correctly.

Note various modern editions of npm nuke links each time `package-lock.json` is written (which, depending on your settings, may be every new dependency you add). This can be remedied by executing `npx module-auto-link -c 'npm-auto-link'` in the module in question, which will restore it's links.

Please make sure to run the tests before submitting a patch and report any rough edges. Thanks!

Enjoy,

-Abbey Hawk Sparrow
