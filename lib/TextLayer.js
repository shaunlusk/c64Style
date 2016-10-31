var C64Style = C64Style || {};

C64Style.TextLayer = function(screenContext, canvas, props) {
  props = props || {};
  C64Style.Layer.call(this, screenContext, canvas, props);
  this._cx = 0;
  this._cy = 0;
  this._color = C64Style.Color.LIGHTBLUE;
  this._backgroundColor = C64Style.Color.BLUE;
  this._characterRenderer = props.characterRenderer || new C64Style.CharacterRenderer(screenContext.getScaleX(), screenContext.getScaleY());
  this._textPrompt = props.textPrompt || new C64Style.TextPrompt(screenContext, this);
  this._pendingTextStrings = new RArray();
  this._scaledCellWidth = C64Style.CELLWIDTH * screenContext.getScaleX();
  this._scaledCellHeight = C64Style.CELLHEIGHT * screenContext.getScaleY();
};

C64Style.TextLayer.prototype = new C64Style.Layer();
C64Style.TextLayer.prototype.constructor = C64Style.TextLayer;

C64Style.TextLayer.prototype.update = function(time,diff) {
  this._textPrompt.update(time,diff);
};

/**
* @override
*/
C64Style.TextLayer.prototype.render = function() {
  var i, pendingString;

  this._textPrompt.render();

  // Clear pending string bounding boxes
  for (i = 0; i < this._pendingTextStrings.length; i++) {
    pendingString = this._pendingTextStrings.get(i);

    if (pendingString.string) {
      this.clearLength(pendingString.cellX, pendingString.cellY, pendingString.string.length);
    } else {
      this.clearLength(pendingString.cellX, pendingString.cellY);
    }
  }

  // write pending strings
  for (i = 0; i < this._pendingTextStrings.length; i++) {
    pendingString = this._pendingTextStrings.get(i);
    if (pendingString.string !== undefined && pendingString.string !== null) {
      this._characterRenderer.renderString(
        this._canvasContext,
        pendingString.string,
        pendingString.cellX * this._scaledCellWidth,
        pendingString.cellY * this._scaledCellHeight,
        pendingString.color,
        pendingString.backgroundColor
      );
    } else {
      this._characterRenderer.renderSymbol(
        this._canvasContext,
        pendingString.pixMapId,
        pendingString.cellX * this._scaledCellWidth,
        pendingString.cellY * this._scaledCellHeight,
        pendingString.color,
        pendingString.backgroundColor
      );
    }
  }

  this._pendingTextStrings.clear();
};

C64Style.TextLayer.prototype.clearLength = function(cellX, cellY, length) {
  this._characterRenderer.clearRect(
    this._canvasContext,
    cellX * this._scaledCellWidth,
    cellY * this._scaledCellHeight,
    length || 1
  );
};

C64Style.TextLayer.prototype.writeText = function(string, cellX, cellY, color, backgroundColor) {
  this._pendingTextStrings.push({
    string:string,
    cellX:cellX,
    cellY:cellY,
    color:color,
    backgroundColor:backgroundColor
  });
};

C64Style.TextLayer.prototype.drawSymbol = function(pixMapId, cellX, cellY, color, backgroundColor) {
  this._pendingTextStrings.push({
    pixMapId:pixMapId,
    cellX:cellX,
    cellY:cellY,
    color:color,
    backgroundColor:backgroundColor
  });
};

C64Style.TextLayer.prototype.getTextPrompt = function() {return this._textPrompt;};

C64Style.TextLayer.prototype.prompt = function(prompt, x, y, color, maxLength, callback) {
  return this._textPrompt.prompt(prompt,x,y,color,maxLength,callback);
};