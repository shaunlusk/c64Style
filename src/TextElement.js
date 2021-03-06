import GfxElement from 'slgfx/src/GfxElement';
import {CELLHEIGHT,CELLWIDTH} from './Constants';
import {Color} from './Color';
import CharacterRenderer from './CharacterRenderer';

/** Element that draws a text string or a text symbol to a canvas.<br />
* <b>Extends</b> [GfxElement]{@link https://shaunlusk.github.io/slgfx/docs/GfxElement.html}
* @constructor
* @param {Object} props Properties
* @param {Screen} props.screenContext The target screen.
* @param {int} [props.scaleX=1] Horizontal scale of this element.  Independent of screen scale.
* @param {int} [props.scaleY=1] Vertical scale of this element.  Independent of screen scale.
* @param {boolean} [props.hidden=false] Whether to hide this element.
* @param {number} [props.x=0] The X coordinate for this element.
* @param {number} [props.y=0] The Y coordinate for this element.
* @param {boolean} [props.horizontalFlip=false] Whether to flip the element horizontally.
* @param {boolean} [props.verticalFlip=false] Whether to flip the element vertically.
* @param {number} [props.zIndex=-1] The z-index; elements with higher zIndex values will be drawn later than those with lower values (drawn on top of those with lower values).
* @param {string} props.text The text for this element. A text string or a symbol name is required for TextElement.
* @param {string} props.symbolName The symbolName for this element.  A text string or a symbol name is required for TextElement.  Refer to symbol names in {@link CharacterMap}.
* @param {Color} [props.color=Color.LIGHTBLUE] The color for the text.
* @param {Color} [props.backgroundColor=none] The backgroundColor for the text.
* @param {CharacterRenderer} [props.characterRenderer=new CharacterRenderer] The renderer to use to draw text.
*     This can be shared with a renderer for drawing text elements.  If a renderer is not provided,
*     This TextElement will create a {@link CharacterRenderer}.
*/
function TextElement(props) {
  props = props || {};
  GfxElement.call(this, props);
  this._width = 0;
  this._height = CELLHEIGHT;
  this._color = props.color || Color.LIGHTBLUE;
  this._backgroundColor = props.backgroundColor;
  this._text = props.text;
  this._symbolName = props.symbolName;
  this._characterRenderer = props.characterRenderer || new CharacterRenderer();

  this._setWidth();
};

TextElement.prototype = new GfxElement();
TextElement.prototype.constructor = TextElement;

/** Returns the CharacterRenderer for this element.
* @returns {CharacterRenderer}
*/
TextElement.prototype.getCharacterRenderer = function() {return this._characterRenderer;};

/**
* Return this element's width.
* @return {number}
*/
TextElement.prototype.getWidth = function() {return this._width;};

/**
* Return this element's width during the previous render cycle.
* @return {number}
*/
TextElement.prototype.getLastWidth = function() {return this._lastWidth || this._width;};

/**
* Return this element's height.
* @return {number}
*/
TextElement.prototype.getHeight = function() {return this._height;};

/**
* Return this element's text.
* @return {string}
*/
TextElement.prototype.getText = function() {return this._text;};

/**
* Set this element's text.
* @param {string} text
*/
TextElement.prototype.setText = function(text) {
  this._text = text;
  this._symbolName = null;
  this._setWidth();
  this.setDirty(true);
};

/**
* Return this element's symbolName.
* @return {string}
*/
TextElement.prototype.getSymbolName = function() {return this._symbolName;};

/**
* Set this element's symbolName.
* @param {string} symbolName
*/
TextElement.prototype.setSymbolName = function(symbolName) {
  this._symbolName = symbolName;
  this._text = null;
  this._setWidth();
  this.setDirty(true);
};

/**
* Return this element's color.
* @return {Color}
*/
TextElement.prototype.getColor = function() {return this._color;};

/**
* Set this element's color.
* @param {Color}
*/
TextElement.prototype.setColor = function(color) {
  this._color = color;
  this.setDirty(true);
};

/**
* Return this element's backgroundColor.
* @return {Color}
*/
TextElement.prototype.getBackgroundColor = function() {return this._backgroundColor;};

/**
* Set this element's backgroundColor.
* @param {Color}
*/
TextElement.prototype.setBackgroundColor = function(color) {
  this._backgroundColor = color;
  this.setDirty(true);
};

/** @private */
TextElement.prototype._setWidth = function() {
  this._lastWidth = this._width;
  this._width = CELLWIDTH * (this._text ? this._text.length : 1);
};

/** Clear this element.
* In case the width of the text changed, clear based on last width
* @param {number} time The current time, in milliseconds.
* @param {number} diff The difference between the previous time and the current time, in milliseconds.
* @override
*/
TextElement.prototype.clear = function(canvasContext, time, diff) {
  canvasContext.clearRect(
    this.getLastX() * this.getScreenScaleX() - 1,
    this.getLastY() * this.getScreenScaleY() - 1,
    this.getLastWidth() * this.getTotalScaleX() + 2,
    this.getHeight() * this.getTotalScaleY() + 2 );
  this._lastWidth = null;
};

/* Render this element.
* @param {number} time The current time, in milliseconds.
* @param {number} diff The difference between the previous time and the current time, in milliseconds.
* @override
*/
/** @private */
TextElement.prototype.render = function(canvasContext, time,diff) {
  if (!this.isHidden() && this.isDirty()) {
    if (this._text) {
      this._characterRenderer.renderString(
        canvasContext,
        this._text,
        this.getX() * this.getScreenScaleX(),
        this.getY() * this.getScreenScaleY(),
        this._color,
        this._backgroundColor,
        this.getTotalScaleX(),
        this.getTotalScaleY()
      );
    } else {
      this._characterRenderer.renderSymbol(
        canvasContext,
        this._symbolName,
        this.getX() * this.getScreenScaleX(),
        this.getY() * this.getScreenScaleY(),
        this._color,
        this._backgroundColor,
        this.getTotalScaleX(),
        this.getTotalScaleY()
      );
    }
  }
};

TextElement.prototype.getLength = function() {
  return this._text ? this._text.length : 1;
};

export default TextElement;
