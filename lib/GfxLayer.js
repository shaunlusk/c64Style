var C64Style = C64Style || {};

C64Style.GfxLayer = function(engineContext, canvas, config) {
  config = config || {};
  C64Style.Layer.call(this, engineContext, canvas, config);
  this._elements = [];
  this._dirtyElements = new PriorityQueue();
  this._dirtyElements.setInvertPriority(false);
  this._removedElements = {};
};

C64Style.GfxLayer.prototype = new C64Style.Layer();
C64Style.GfxLayer.prototype.constructor = C64Style.GfxLayer;

C64Style.GfxLayer.prototype.addElement = function(element) {
  this._elements.push(element);
};

C64Style.GfxLayer.prototype.removeElementById = function(id) {
  var idx = C64Style.linSearch(this._elements, id, function(element,value){return element.getId() === value;});
  if (idx > -1) {
    this._removedElements[this._elements[idx].getId()] = this._elements[idx];
    var elem = this._elements[idx];
    // ensure it gets cleared
    elem.setDirty(true);
    elem.setHidden(true);
    this._dirtyElements.push(elem.getZIndexComparable());
    return elem;
  }
  return null;
};

C64Style.GfxLayer.prototype.removeElement = function(element) {
  return this.removeElementById(element.getId());
};

C64Style.GfxLayer.prototype.update = function(time,diff) {
  var dirtyElement;
  var i;
  for (i = 0; i < this._elements.length; i++) {
      dirtyElement = this._elements[i].update(time,diff);
      if (dirtyElement) {
        this._dirtyElements.push(this._elements[i].getZIndexComparable());
      }
  }

  this._handleCollisions();
};

C64Style.GfxLayer.prototype._handleCollisions = function() {
  var element1, element2, j;
  for (i = 0; i < this._elements.length; i++) {
    element1 = this._elements[i];
    for (j = 1; j < this._elements.length; j++) {
      if (i===j) continue;
      element2 = this._elements[j];

      this._collisionCheckElementsIfNeeded(element1, element2);
    }

    var removedKeys = Object.keys(this._removedElements);
    for (j = 1; j < removedKeys.length; j++) {
      key = removedKeys[j];
      element2 = this._removedElements[key];

      this._collisionCheckElementsIfNeeded(element1, element2);
    }
  }
};

C64Style.GfxLayer.prototype._collisionCheckElementsIfNeeded = function(element1, element2) {
  if ((element1.isDirty() && element2.isDirty()) ) return;
  if ((element1.isHidden() && element2.isHidden()) ) return;
  if ((element1.hasCollision() && element2.hasCollision()) ) return;

  if (element1.collidesWith(element2)) {
    // TODO event
    this._updateElementOnCollision(element1);
    this._updateElementOnCollision(element2);
  }
};

C64Style.GfxLayer.prototype._updateElementOnCollision = function(element) {
  element.setHasCollision(true);
  if (!element.dirty) {
    element.setDirty(true);
    this._dirtyElements.push(element.getZIndexComparable());
  }
};

C64Style.GfxLayer.prototype.render = function() {
  var i;

  while (this._dirtyElements.peek()) {
    var element = this._dirtyElements.pop().getElement();
    element.clear();
    element.render();
  }

  this._cleanUp();
};

C64Style.GfxLayer.prototype._cleanUp = function() {
  Object.keys(this._removedElements).forEach(function(elementId) {
    var removedElement = this._removedElements[elementId];
    removedElement.finalize();
    var idx = C64Style.linSearch(this._elements, elementId, function(element,value){return element.getId() === value;});
    this._elements.splice(idx,1);
  }.bind(this));
  this._removedElements = {};
  this._dirtyElements.clear();
};

// C64Style.GfxLayer.prototype.handleMouseEvent = function(e,x,y) {
//   var element = null, topElement = null;
//   for (var i = 0; i < this._elements.length; i++) {
//     if ( C64Style.isFunction(this._elements[i].handleMouseEvent) ) {
//       element = this._elements[i].handleMouseEvent(e,x,y);
//       // find element with highest z-index
//       if (element !== null && (topElement === null || element.getZIndex() > topElement.getZIndex())) {
//         topElement = element;
//       }
//     }
//   }
//   return topElement;
// };