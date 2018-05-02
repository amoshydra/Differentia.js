/**
 * BinaryTree - Order-2 Binary Tree, stores nodes by integer weight.
 * @param {Iterable} [iterable=null]  Optional iterable to populate the new BinaryTree.
 */
function BinaryTree(iterable = null) {
	this.root = null;
	this.size = 0;
	if (iterable !== null) {
		this.fromIterable(iterable);
	}
};
BinaryTree.prototype[Symbol.iterator] = function* (bfs = false, startElement = null) {
	const targets = [startElement !== null ? startElement : this.root];
	var getMethod = bfs ? "shift" : "pop";
	var element;
	while (this.size > 0 && targets.length > 0) {
		element = targets[getMethod]();
		yield element;
		if (element.right !== null) {
			targets.push(element.right);
		}
		if (element.left !== null) {
			targets.push(element.left);
		}
	}
};
/**
 * values - Depth-First Search iterator.
 * @returns {GeneratorObject}  Returns a `TreeElement` for every call to `next()`.
 */
BinaryTree.values = function* () {
	for (var element in this[Symbol.iterator]()) {
		yield element.payload;
	}
};
/**
* bfs - Breadth-First Search Iterator.
* @returns {GeneratorObject}  Returns a `TreeElement` for every call to `next()`.
*/
BinaryTree.prototype.bfs = function (startElement = null) {
	return this[Symbol.iterator](true, startElement);
};
/**
* dfs - Depth-First Search Iterator.
* @returns {GeneratorObject}  Returns a `TreeElement` for every call to `next()`.
*/
BinaryTree.prototype.dfs = function (startElement = null) {
	return this[Symbol.iterator](false, startElement);
};
/**
* forEach - Simple IOC wrapper for LinkedList.values
* @callback callback  A callback function to run for every TreeElement.
	* @param {TreeElement}  element
*/
BinaryTree.prototype.forEach = function (callback) {
	for (const element of this.values()) {
		callback(element);
	}
};
/**
 * clear - Removes all elements from the BinaryTree.
 */
BinaryTree.prototype.clear = function () {
	this.constructor();
};
/**
 * TreeElement - BinaryTree Element
 * @param {any} payload       Optional data payload for the element; if an integer, will be assigned to weight.
 * @param {any} [left=null]   The the lefthand child of the TreeElement.
 * @param {any} [right=null]  The the righthand child of the TreeElement.
 * @param {any} [prev=null]   The previous element in the BinaryTree.
 */
BinaryTree.prototype.TreeElement = function (payload = null, parent = null, left = null, right = null) {
	this.payload = payload;
	if ((typeof payload) === "number") {
		this.weight = payload;
	} else {
		this.weight = 0;
	}
	this.parent = parent;
	this.left = left;
	this.right = right;
};
/**
 * coerceElement - Creates a new TreeElement using `value` if `value` it is not already a TreeElement.
 * @param {any} value  A TreeElement, or a value to create a new TreeElement with.
 * @returns {TreeElement}  The new TreeElement, or `value` if it is already a TreeElement.
 */
BinaryTree.prototype.coerceElement = function (value) {
	return (value instanceof this.TreeElement ? value : new this.TreeElement(value));
};
/**
* fromIterable - Populates the BinaryTree from an iterable.
* Values which are integers will also be used as the weights for their TreeElements.
* @param {Iterable} iterable  The iterable to populate the BinaryTree with.
*/
BinaryTree.prototype.fromIterable = function (iterable) {
	if (iterable === null) return;
	assert.argType(Symbol.iterator in iterable, "iterable", 1);
	for (var value of iterable[Symbol.iterator]()) {
		this.add(value);
	}
};
BinaryTree.prototype.findClosestWeight = function (findWeight, startElement = null) {
	if (this.size === 0) {
		return null;
	}
	var element = startElement !== null ? startElement : this.root;
	while (true) {
		if (findWeight === element.weight || element.left === null && element.right === null) {
			return element;
		}
		if (findWeight > element.weight && element.right !== null) {
			element = element.right;
			continue;
		} else if (findWeight < element.weight && element.left !== null) {
			element = element.left;
			continue;
		}
		return element;
	}
};
BinaryTree.prototype.getMax = function (startElement = null) {
	return this.findClosestWeight(Infinity, startElement);
};
BinaryTree.prototype.getMin = function (startElement = null) {
	return this.findClosestWeight(-Infinity, startElement);
};
BinaryTree.prototype.findWeight = function (weight, startElement = null) {
	const foundElement = this.findClosestWeight(weight, startElement);
	if (foundElement !== null && foundElement.weight === weight) {
		return foundElement;
	}
	return null;
};
BinaryTree.prototype.findValue = function (value, startElement = null) {
	for (var element of this.dfs(startElement)) {
		if (value === element.payload) {
			return element;
		}
	}
	return null;
};
BinaryTree.prototype.hasValue = function (value) {
	return this.findValue(value) !== null;
};
BinaryTree.prototype.hasWeight = function (weight) {
	return this.findWeight(value) !== null;
};
BinaryTree.prototype.add = function (element) {
	element = this.coerceElement(element);
	if (this.root === null) {
		this.root = element;
	} else {
		const closestElement = this.findClosestWeight(element.weight);
		element.parent = closestElement;
		if (element.weight >= closestElement.weight) {
			closestElement.right = element;
		} else {
			closestElement.left = element;
		}
	}
	this.size++;
};
BinaryTree.prototype.delete = function (element) {
	if (this.root === null) {
		return null;
	}
	if ((typeof element) === "number") {
		element = this.findWeight(element);
	}
	if (element === null || !(element instanceof this.TreeElement)) {
		return null;
	}
	if (this.size <= 1 && element === this.root) {
		this.root = null;
		return element;
	}
	if (element.left !== null && element.right !== null) {
		var successor = this.getMax(element.left);
		element.payload = successor.payload;
		element.weight = successor.weight;
		this.delete(successor);
	} else if (element.left !== null) {
		if (element.parent.left === element) {
			element.parent.left = element.left;
		} else if (element.parent.right === element) {
			element.parent.right = element.left;
		}
	} else if (element.right !== null) {
		if (element.parent.left === element) {
			element.parent.left = element.right;
		} else if (element.parent.right === element) {
			element.parent.right = element.right;
		}
	} else {
		if (element.parent.left === element) {
			element.parent.left = null;
		} else if (element.parent.right === element) {
			element.parent.right = null;
		}
	}
	return element;
};
BinaryTree.prototype.rotate = function (element, direction) {
	var dir = direction ? "left" : "right";
	var oppDir = direction ? "right" : "left";
	const pivot = element[dir];
	element[dir] = pivot[oppDir];
	if (element[dir] !== null) {
		element[dir].parent = element;
	}
	pivot.parent = element.parent;
	if (element.parent === null) {
		this.root = pivot;
		this.root.red = false;
	} else if (element === element.parent.left) {
		element.parent.left = pivot;
	} else {
		element.parent.right = pivot;
	}
	pivot[dir] = element;
	element.parent = pivot;
};
BinaryTree.prototype.rotateRight = function (element) {
	this.rotate(element, true);
};
BinaryTree.prototype.rotateright = BinaryTree.prototype.rotateRight;
BinaryTree.prototype.rotateLeft = function (element) {
	this.rotate(element, false);
};
BinaryTree.prototype.rotateleft = BinaryTree.prototype.rotateLeft;
function RedBlackTree() {
	BinaryTree.call(this);
};
RedBlackTree.prototype = Object.create(BinaryTree.prototype);
RedBlackTree.prototype.TreeElement = function (...args) {
	BinaryTree.prototype.TreeElement.apply(this, args);
	this.red = true;
};
RedBlackTree.prototype.swapColor = function (element1, element2) {
	const color1 = element1.red;
	const color2 = element2.red;
	element1.red = color2;
	element2.red = color1;
};
RedBlackTree.prototype.validate = function (callbacks) {
	if (this.root === null) {
		return true;
	}
	for (var element of this.bfs()) {
		if (this.root.red && (element.left.red || element.right.red)) {
			return false;
		}
		if ((element.left !== null && element.weight >= this.root.weight)
			|| (element.right !== null && element.weight <= this.root.weight)) {
			return false;
		}
	}
	return true;
};
RedBlackTree.prototype.balance = function (element) {
	if (this.size <= 1) {
		return;
	}
	while (element !== this.root && !element.red && element.parent.red) {
		var parent = element.parent;
		var grandParent = element.parent.parent;
		if (grandParent === null) {
			return;
		}
		const dir = parent === grandParent.left ? "right" : "left";
		const oppDir = dir === "right" ? "left" : "right";
		if (grandParent[dir] !== null && grandParent[dir].red) {
			grandParent.red = true;
			parent.red = false;
			grandParent[dir].red = false;
			element = element.parent;
		} else {
			if (element === parent[dir]) {
				this["rotate" + oppDir](parent);
			}
			this["rotate" + dir](grandParent);
			this.swapColor(parent, grandParent);
			element = parent;
		}
	}
	this.root.red = true;
};
RedBlackTree.prototype.add = function (element) {
	element = this.coerceElement(element);
	BinaryTree.prototype.add.call(this, element);
	if (this.size > 1 && element.parent.red) {
		element.red = false;
	} else {
		element.red = true;
	}
	this.balance(element);
};
RedBlackTree.prototype.delete = function (element) {
	const newRoot = BinaryTree.prototype.delete.call(this, element);
	if (newRoot !== null) {
		this.balance(newRoot);
	}
	return newRoot;
};
module.exports.BinaryTree = BinaryTree;
module.exports.RedBlackTree = RedBlackTree;