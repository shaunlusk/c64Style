/** @class
* Enforces uniqueness of enqueued elements;
* attempts made to enqueue an element that is
* already in the queue will be ignored.
*
* Elements must implement getKey() method
*/
function UniquePriorityQueue() {
  PriorityQueue.call(this);
  this._entryKeys = {};
}

UniquePriorityQueue.prototype = new PriorityQueue();
UniquePriorityQueue.prototype.constructor = UniquePriorityQueue;

/** @override
*/
UniquePriorityQueue.prototype.insert = function(element) {
  if (this._entryKeys[element.getKey()]) return;
  this._entryKeys[element.getKey()] = true;
  PriorityQueue.prototype.insert.call(this, element);
};

UniquePriorityQueue.prototype.clear = function() {
  this._entryKeys = {};
  PriorityQueue.prototype.clear.call(this);
};

UniquePriorityQueue.prototype.extractMax = function() {
  var element = PriorityQueue.prototype.extractMax.call(this);
  if (this._entryKeys[element.getKey()]) delete this._entryKeys[element.getKey()];
  return element;
};


/** Removes and returns the item at the front of the queue
* @method
* @return {Object} The item at the front of the queue.
*/
UniquePriorityQueue.prototype.pop = UniquePriorityQueue.prototype.extractMax;

/** Removes and returns the item at the front of the queue
* @method
* @return {Object} The item at the front of the queue.
*/
UniquePriorityQueue.prototype.poll = UniquePriorityQueue.prototype.extractMax;

/** Adds a new item to the queue.
* @method
* @param element {IComparable} The item to be added to the queue.  Must implement Comparable.
*/
UniquePriorityQueue.prototype.push = UniquePriorityQueue.prototype.insert;