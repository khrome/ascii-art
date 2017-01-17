#!/usr/bin/env node
var art = require('./ascii-art');

/*art.font('Demo!', 'Doom', function(rendered){
    console.log(art.style(rendered, 'blue_bg+red+blink+inverse'));
}); //*/
/*
art.image({
    filepath :'/Volumes/Sparrows/Abbey/Professional/Project\ Resources/Stock\ photos/earth_in_space.jpg',
    alphabet : 'ultra-wide'
}).overlay(
    '******'+"\n"+
    '******'+"\n"+
    '******'
    ,{
        x: 0,
        y: 0,
        style: 'red'
    }, function(rendered){
    console.log(rendered);
}); //*/

function colorInBonesShirt(rendered){
    return rendered
        .replace('|   ||                 |   |', '|&&&||&&&&&&&&&&&&&&&&&|&&&|')
        .replace('|   ||                 |   |', '|&&&||&&&&&&&&&&&&&&&&&|&&&|')
        .replace('|      (', '|&&&&&&(').replace('/   |', '/&&&|').replace('/   |', '/&&&|')
        .replace('|  |', '|&&|').replace('| |', '|&|').replace('| |', '|&|')
        .replace('-         \\', '-&&&&&&&&&\\').replace('_   ..   _', '_&&&..&&&_')
        .replace('/      \\', '/&&&&&&\\').replace('/ ^  ^ \\', '/&^&&^&\\').replace('/                \\', '/&&&&&&&&&&&&&&&&\\')
        .replace('| \\  @  @  / |', '|&\\&&@&&@&&/&|').replace('|  He\'s dead, Jim! |', '|&&He\'s&dead,&Jim!&|')
        .replace(')   \\', ')&&&\\').replace('| ////// |', '|&//////&|').replace('_  _', '_&&_');
}

//*
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
                filepath :'/Users/khrome/Desktop/vintage_starburst_texture_13_darkred_red_preview.jpg',
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
}); //*/

/*art.table({
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
                filepath :'/Users/khrome/Desktop/Unknown.jpeg',
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
});*/

/*
art.artwork({
    artwork:'textfiles.com/art/st-char.asc'
}).lines(31, 45, function(rendered){
    //cleanup non-unix terminators
    rendered = rendered.replace(/\r/g, '');
    rendered = colorInBonesShirt(rendered);
    art.image({
        filepath :'/Volumes/Sparrows/Abbey/Professional/Project\ Resources/Stock\ photos/earth_in_space.jpg',
        alphabet : 'ultra-wide'
    }).overlay(rendered, {
        x: 0,
        y: -1,
        style: 'red+blink',
        transparent: '&'
    }, function(final){
        console.log(final);
    });
}); //*/
