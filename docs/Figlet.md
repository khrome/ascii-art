Figlet fonts
------------
A slight mod of [Figlet.js](https://github.com/scottgonzalez/figlet-js) which I hope will make it to NPM in pure js form someday, rather than requiring a command line dependency.

Figlet fonts are an ASCII art font standard, widely used for terminal output.

It looks something like this:

    ______                          _ 
    |  _  \                        | |
    | | | |  ___  _ __ ___    ___  | |
    | | | | / _ \| '_ ` _ \  / _ \ | |
    | |/ / |  __/| | | | | || (_) ||_|
    |___/   \___||_| |_| |_| \___/ (_)

To set the directory of the fonts:

    art.Figlet.fontPath = 'Fonts';
        
Then to render some text:

    art.font('my text', 'Doom', function(rendered){
        //do stuff here
    });