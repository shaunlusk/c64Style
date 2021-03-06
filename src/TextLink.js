import TextElement from './TextElement';
import Utils from 'slgfx/src/Utils';

const _window = Utils.getWindow();


/** TextElement that draws a text string or a text symbol to a canvas and provides a Hyperlink to another location.<br />
* @constructor
* @augments TextElement
* @param {Object} props Properties.
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
* @param {Color} [props.mouseOverColor=props.color] The text color to display when the mouse is over this element.
* @param {Color} [props.mouseOverBackgroundColor=props.backgroundColor] The text backgroundColor to display when the mouse is over this element.
* @param {function} [props.onClick] An optional function to call when the link is clicked.
* @param {string} [props.href] The location to navigate to when the link is clicked.
* @param {boolean} [props.newWindow] Whether to open the new location in a new window or not.
*/
function TextLink(props) {
  props = props || {};
  TextElement.call(this, props);
  this._mouseOverColor = props.mouseOverColor || this._color;
  this._mouseOverBackgroundColor = props.mouseOverBackgroundColor || this._backgroundColor;
  this._onClick = props.onClick;
  this._href = props.href;
  this._newWindow = props.newWindow;
  this._baseColor = this._color;
  this._baseBackgroundColor = this._backgroundColor;
  this._windowOpen = props.windowOpen || (_window.open ? _window.open.bind(_window) : ()=>{});
  this._setDocumentLocation = props.setDocumentLocation || ((location) => {document.location = location});
  this.on("MOUSE_UP_ON_ELEMENT", this._click.bind(this));
  this.on("MOUSE_ENTER_ELEMENT", this._enter.bind(this));
  this.on("MOUSE_EXIT_ELEMENT", this._exit.bind(this));
};

TextLink.prototype = new TextElement({characterRenderer:{}});
TextLink.prototype.constructor = TextLink;

/** @private */
TextLink.prototype._enter = function() {
  this._setActive(true);
};

/** @private */
TextLink.prototype._exit = function() {
  this._setActive(false);
};

/** @private */
TextLink.prototype._setActive = function(bool) {
  this._mouseIsOver = bool;
  if (bool) {
    this.setColor(this._mouseOverColor);
    this.setBackgroundColor(this._mouseOverBackgroundColor);
  } else {
    this.setColor(this._baseColor);
    this.setBackgroundColor(this._baseBackgroundColor);
  }
  this.setDirty(true);
};

/** @private */
TextLink.prototype._click = function(event) {
  if (Utils.isFunction(this._onClick)) {
    var result = this._onClick(event);
    if (result !== undefined && !result) return;
  }
  if (this._href) {
    if (this._newWindow) {
      this._windowOpen(this._href, "_blank");
    } else {
      this._setDocumentLocation(this._href);
    }
  }
};

export default TextLink;
