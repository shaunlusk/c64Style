describe("Screen", function() {
  var c64scrn, targetDiv, fpsElem, config, calledRequestAnimationFrame,
    windowEventListeners = {};

  requestAnimationFrame = function() {calledRequestAnimationFrame = true;};
  beforeEach(function() {
    // blanket.js weirdness means we have to reset document link each time
    C64Style.Screen.document = {
      addEventListener : function(event, listener) {
        if (!windowEventListeners[event]) windowEventListeners[event] = [];
        windowEventListeners[event].push(listener);
      }
    };
    windowEventListeners = {};
    calledRequestAnimationFrame = false;
    targetDiv = {
      style : {},
      eventListeners : {},
      addEventListener : function(type, callback, bool) {
        this.eventListeners[type] = callback;
      },
      appendChild : function() {},
      offsetLeft : 0,
      offsetTop : 0
    };
    fpsElem = {};
    config = {};
    c64scrn = new C64Style.Screen(targetDiv, fpsElem, config);
  });

  describe("#initialize()", function() {
    it("should call _prepareDiv and _setupEventListeners", function(done) {
      var calledPrepareDiv, calledSetupEventListeners;
      c64scrn._prepareDiv = function() {calledPrepareDiv = true;};
      c64scrn._setupEventListeners = function() {calledSetupEventListeners = true;};

      c64scrn.initialize();

      assert(calledPrepareDiv === true, "should have called _prepareDiv");
      assert(calledSetupEventListeners === true, "should have called _setupEventListeners");
      done();
    });
  });
  describe("#_prepareDiv()", function() {
    it("should set div styles", function(done) {
      c64scrn._prepareDiv();

      assert(targetDiv.style.width === c64scrn._width, "should have set width");
      assert(targetDiv.style.height === c64scrn._height, "should have set heights");
      assert(targetDiv.style.backgroundColor === c64scrn._backgroundColor, "should have set backgroundColor");
      assert(targetDiv.style.border === c64scrn._borderSize + "px solid " + c64scrn._borderColor, "should have set border");
      done();
    });
  });
  describe("#_setupEventListeners()", function() {
    it("should setup event listeners", function(done) {
      c64scrn._setupEventListeners();

      assert(targetDiv.eventListeners.mouseup, "should have set mouseup handler");
      assert(targetDiv.eventListeners.mousedown, "should have set mousedown handler");
      assert(targetDiv.eventListeners.mousemove, "should have set mousemove handler");
      assert(windowEventListeners.visibilitychange !== undefined, "should have set visibilitychange handler");
      done();
    });
  });
  describe("#handleVisibilityChange()", function() {
    it("should unpause", function(done) {
      document.hidden = false;
      c64scrn.handleVisibilityChange();

      assert(c64scrn.isPaused() === false, "should have unpaused");
      done();
    });
    it("should not unpause if explicitly paused", function(done) {
      document.hidden = false;
      c64scrn.setPaused(true);
      c64scrn.handleVisibilityChange();

      assert(c64scrn._unpaused === false, "should not have unpaused");
      done();
    });
  });
  describe("#addEventListener()", function() {
    it("should add event listener to document", function(done) {
      c64scrn.addEventListener("dummyEvent", function() {});

      assert(windowEventListeners.dummyEvent !== undefined, "should have added dummy event");
      done();
    });
  });
  describe("#setBackgroundColor()", function() {
    it("should set background color", function(done) {
      var color = C64Style.Color.YELLOW;

      c64scrn.setBackgroundColor(color);

      assert(c64scrn.getBackgroundColor() === color, "should have set background color");
      assert(targetDiv.style.backgroundColor === color, "should have set background color on target div");
      done();
    });
  });
  describe("#setBorderColor()", function() {
    it("should set border color", function(done) {
      var color = C64Style.Color.LIGHTGREEN;

      c64scrn.setBorderColor(color);

      assert(c64scrn.getBorderColor() === color, "should have set border color");
      assert(targetDiv.style.border === c64scrn._borderSize + "px solid " + color, "should have set border color on target div");
      done();
    });
  });
  describe("#setBorderSize()", function() {
    it("should set border size", function(done) {
      var amount = 50;

      c64scrn.setBorderSize(amount);

      assert(c64scrn.getBorderSize() === amount, "should have set border size");
      assert(targetDiv.style.border === amount + "px solid " + c64scrn._borderColor, "should have set border size on target div");
      done();
    });
  });
  describe("#createLayer()", function() {
    it("should add text layer", function(done) {
      c64scrn.createLayer("TextLayer");

      assert(c64scrn.getLayers()[0] instanceof C64Style.TextLayer, "should have added text layer");
      done();
    });
    it("should add text layer", function(done) {
      c64scrn.createLayer("GfxLayer");

      assert(c64scrn.getLayers()[0] instanceof C64Style.GfxLayer, "should have added gfx layer");
      done();
    });
    it("should throw error on Unknown type", function(done) {
      var result = throwsError(c64scrn.createLayer.bind(c64scrn,"BogusLayer"));

      assert(result === true, "should have thrown error");
      done();
    });
  });
  describe("#setPaused()", function() {
    it("should pause", function(done) {
      var eventType = null;
      c64scrn.notify = function(event) {eventType = event.type;};
      c64scrn.setPaused(true);

      assert(c64scrn.isPaused() === true, "should have set paused");
      assert(c64scrn._unpaused === false, "should not have set unpaused true");
      assert(eventType === C64Style.EventType.SCREEN_PAUSED, "should have notified of pause event");
      assert(calledRequestAnimationFrame === false, "should not have called requestAnimationFrame");
      done();
    });
    it("should unpause", function(done) {
      var eventType = null;
      c64scrn.notify = function(event) {eventType = event.type;};
      c64scrn.setPaused(true);
      c64scrn.setPaused(false);

      assert(c64scrn.isPaused() === false, "should have set paused false");
      assert(c64scrn._unpaused === true, "should have set unpaused true");
      assert(eventType === C64Style.EventType.SCREEN_RESUMED, "should have notified of resume event");
      assert(calledRequestAnimationFrame === true, "should have called requestAnimationFrame");
      done();
    });
  });
  describe("#on()", function(){
    it("should add callback to list", function(done) {
      var eventType = "newType";
      c64scrn.on(eventType, function() {
        assert(true);
        done();
      });
      c64scrn._eventListeners[eventType][0]();
    });
  });
  describe("#clearEventHandlers()", function(){
    it("should add callback to list", function(done) {
      var eventType = "newType";
      c64scrn.on(eventType, function() {});

      c64scrn.clearEventHandlers(eventType);

      assert(c64scrn._eventListeners[eventType].length === 0, "should have cleared handler list");
      done();
    });
    it("should throw error", function(done) {
      var eventType = "newType";

      var result = throwsError(c64scrn.clearEventHandlers.bind(c64scrn, eventType));

      assert(result === true, "should have thrown error");
      done();
    });
  });
  describe("#notify()", function() {
    it("should throw error", function(done) {
      var event = {type:"blerg"};

      var result = throwsError(c64scrn.notify.bind(c64scrn,event));

      assert(result === true, "should have thrown error");
      done();
    });
    it("should notify listeners", function(done) {
      var event = {type:"blerg"};
      c64scrn.getScreenContext = function() {
        return {notify:function(){}};
      };
      var result = false;
      c64scrn.on("blerg", function() {
        result = true;
      });

      c64scrn.notify(event);
      assert(result, "should have notified listeners");
      done();
    });
  });
  describe("#render()", function() {
    it("should return if paused or tab not visible", function(done) {
      c64scrn.setPaused(true);
      var calledInternalRender = false;
      c64scrn._render = function() {calledInternalRender = true;};

      c64scrn.render(1);

      assert(calledInternalRender === false, "should have returned.");
      done();
    });
    it("should call handleMouseMoveEvent if mouse moved", function(done) {
      c64scrn._mouseMoved = true;
      var calledIt = false;
      c64scrn._handleMouseMoveEvent = function() {calledIt = true;};

      c64scrn.render(1);

      assert(calledIt === true, "should have called handleMouseMoveEvent.");
      done();
    });
    it("should notify before and after render event", function(done) {
      var eventTypes = [];
      c64scrn.notify = function(event) {eventTypes.push(event.type);};

      c64scrn.render(1);

      assert(eventTypes[0] === C64Style.EventType.BEFORE_RENDER, "should have notified of before render event.");
      assert(eventTypes[1] === C64Style.EventType.AFTER_RENDER, "should have notified of after render event.");
      done();
    });
    it("should call updateFps", function(done) {
      var calledIt = false;
      c64scrn._updateFps = function() {calledIt = true;};

      c64scrn.render(1);

      assert(calledIt === true, "should have called updateFps.");
      done();
    });
    it("should call _update", function(done) {
      var calledIt = false;
      c64scrn._update = function() {calledIt = true;};

      c64scrn.render(1);

      assert(calledIt === true, "should have called _update.");
      done();
    });
    it("should call _render", function(done) {
      var calledIt = false;
      c64scrn._render = function() {calledIt = true;};

      c64scrn.render(1);

      assert(calledIt === true, "should have called _render.");
      done();
    });
    it("should call requestAnimationFrame", function(done) {
      c64scrn.render(1);

      assert(calledRequestAnimationFrame === true, "should have called requestAnimationFrame.");
      done();
    });
    it("should unpause", function(done) {
      var time = 100;
      c64scrn.setPaused(true);
      c64scrn.setPaused(false);
      assert(c64scrn._unpaused === true, "unpaused should be true here");

      c64scrn.render(time);

      assert(c64scrn._unpaused === false, "should have reset unpaused flag.");
      done();
    });
    it("should calculate diff based on unpause", function(done) {
      var time = 100;
      var calledWithDiff = null;
      c64scrn._update = function(time,diff) {calledWithDiff = diff;};
      c64scrn.setPaused(true);
      c64scrn.setPaused(false);

      c64scrn.render(time);

      assert(calledWithDiff === 1, "should calculated diff properly.");
      done();
    });
  });
  describe("#_handleMouseMoveEvent()", function() {
    it("should notify mouse move event", function(done) {
      var eventType = null;
      c64scrn.notify = function(event) {eventType = event.type;};

      c64scrn._handleMouseMoveEvent();

      assert(eventType === C64Style.EventType.MOUSE_MOVE, "should have notified of before mouse move event.");
      done();
    });
    it("should propagate event", function(done) {
      var calledIt = null;
      c64scrn.propagateMouseEventThroughLayers = function() {calledIt = true;};

      c64scrn._handleMouseMoveEvent();

      assert(calledIt === true, "should have propagated event.");
      done();
    });
    it("should reset mouseMoved", function(done) {
      c64scrn._mouseMoved = true;

      c64scrn._handleMouseMoveEvent();

      assert(c64scrn._mouseMoved === false, "should have reset mouseMoved.");
      done();
    });
  });
  describe("#_updateFps()", function() {
    it("should add fps to _fpsMonitorArray", function(done) {
      c64scrn._showFps = true;

      c64scrn._updateFps(100);

      assert(c64scrn._fpsMonitorArray.length === 1, "Should have pushed fps to _fps");
      assert(c64scrn._fpsMonitorArray[0] === 10, "Should have pushed fps to _fps");
      done();
    });
    it("should reset _fpsMonitorIndex", function(done) {
      c64scrn._showFps = true;
      for(var i = 0; i < 29; i++) c64scrn._fpsMonitorArray.push(10);
      c64scrn._fpsMonitorIndex = 29;

      c64scrn._updateFps(100);

      assert(c64scrn._fpsMonitorIndex === 0, "Should have reset _fpsMonitorIndex");
      done();
    });
  });
});
