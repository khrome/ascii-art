ascii-art.js
===========

A bunch of utilities for outputting textual art

Figlet fonts
------------
A slight mod of [Figlet.js](https://github.com/scottgonzalez/figlet-js)

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

Styles
------
ANSI terminals allow us to output style which format the text in the terminal. In order to do this you just need to:

    art.style('my text', 'red+underline');

1. **colors**
Foreground colors for characters are: black, red, green, yellow, blue, magenta, cyan, white and in some terminal environments:  bright_black, bright_red, bright_green, bright_yellow, bright_blue, bright_magenta, bright_cyan, bright_white (These generally default to their non-bright variants on systems without them)
            
2. **background colors**
Background terminal colors available are: black_bg, red_bg, green_bg, yellow_bg, blue_bg, magenta_bg, cyan_bg, white_bg
        
3. **styles**
To style the text you may use: bold, italic, underline, framed, encircled, overline, blink, inverse
        
4. **controls**
Control styles are: off, hidden
    
Images
------
Will be coming soon!
    
Hope that helps, please report any rough edges!

Enjoy,

-Abbey Hawk Sparrow