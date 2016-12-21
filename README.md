# C64Style

## What is it?
A framework for rendering Commodore 64 style graphics with JavaScript and HTML5 Canvas.

## What isn't it?
C64Style is not an emulator.

## How do I use it?

### Basic Usage

Create a div to hold the screen and its components:

    <div id="content">
    </div>

Then setup your screen:

// get the screen element
var targetDiv = document.getElementById("content");

// empty config = use defaults for everything
var config = {};

// create the screen
screen = new C64Style.Screen(targetDiv, config);

// call initialize on screen
screen.initialize();

// add a layer to draw to
textLayer = screen.createLayer("TextLayer");

// Write some text to the layer
textLayer.writeText("Hello World", 0, 0, C64Style.Color.LIGHTBLUE);

// Start rendering!
screen.render();
