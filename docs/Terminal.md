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
