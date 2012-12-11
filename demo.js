var art = require('./ascii-art');

art.font('Demo!', 'Doom', function(rendered){
    console.log(art.style(rendered, 'blue_bg+red+blink+inverse'));
});