function createTestObject() {
  return [
    {
      "id": 1,
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz",
      "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": 92998,
        "geo": {
          "lat": -37.3159,
          "lng": 81.1496
        }
      },
      "website": null,
      "company": {
        "active": false,
        "name": "Romaguera-Crona",
        "catchPhrase": "Multi-layered client-server neural-net",
        "bs": "harness real-time e-markets"
      }
    },
    {
      "id": 2,
      "name": "Ervin Howell",
      "username": "Antonette",
      "email": "Shanna@melissa.tv",
      "address": {
        "street": "Victor Plains",
        "suite": "Suite 879",
        "city": "Wisokyburgh",
        "zipcode": 90566,
        "geo": {
          "lat": -43.9509,
          "lng": -34.4618
        }
      },
      "website": null,
      "company": {
        "active": true,
        "name": "Deckow-Crist",
        "catchPhrase": "Proactive didactic contingency",
        "bs": "synergize scalable supply-chains"
      }
    }
  ];
}
var testObjects = {};
testObjects["Multidimensional Acyclic"] = createTestObject();
testObjects["Linear Acyclic"] = ["one", "two", "three"];
// Fourth element is a cycle
testObjects["Linear Cyclic"] = ["one", "two", "three"];
testObjects["Linear Cyclic"][3] = testObjects["Linear Cyclic"];
// `otherUser` properties are a cycle
testObjects["Multidimensional Cyclic"] = createTestObject();
testObjects["Multidimensional Cyclic"][0].otherUser = testObjects["Multidimensional Cyclic"][1];
testObjects["Multidimensional Cyclic"][1].otherUser = testObjects["Multidimensional Cyclic"][0];

function createKeyCounter() {
  var testObject = testObjects["Multidimensional Cyclic"];
  var keyCounts = {};
  for (var key in testObject) {
    keyCounts[key] = 0;
  }
  for (var key in testObject[0]) {
    keyCounts[key] = 0;
  }
  for (var key in testObject[0]["address"]) {
    keyCounts[key] = 0;
  }
  for (var key in testObject[0]["address"]["geo"]) {
    keyCounts[key] = 0;
  }
  for (var key in testObject[0]["company"]) {
    keyCounts[key] = 0;
  }
  return keyCounts;
}

function testLength(obj) {
  if (Array.isArray(obj)) {
    return obj.legth;
  }
  if (typeof obj === "object") {
    return Object.keys(obj).length;
  }
  throw new TypeError("The given parameter must be an Object or Array");
}

function diff(subject, compare) {
  var map = new Map();
  for (var accessor in subject) {
    if (testDiff(subject, compare, accessor, map)) {
      return true;
    }
  }
  return false;
}

function testDiff(subject, compare, accessor, map) {
  if (!(accessor in compare)) {
    return true;
  }
  if (map.has(subject[accessor])) {
    return;
  }
  var subjectProp = subject[accessor];
  var compareProp = compare[accessor];
  if (typeof subjectProp === "object") {
    map.set(subjectProp, compareProp);
  }
  if ((Array.isArray(subjectProp) && Array.isArray(compareProp))
    || (typeof subjectProp === "object" && typeof subjectProp === "object")) {
    // Object type does not match.
    if (testLength(subjectProp) !== testLength(subjectProp)) {
      // Object index/property count does not match, they are different.
      return true;
    }
    for (var accessor in subjectProp) {
      return testDiff(subjectProp, compareProp, accessor, map);
    }
  } else if (subjectProp !== compareProp) {
    return true;
  }
}

describe("isContainer", function () {
  var array = [];
  var object = {};
  it("should return true if the input is an Object or Array", function () {
    expect(differentia.isContainer(array)).toBe(true);
    expect(differentia.isContainer(object)).toBe(true);
  });
  it("should return false if the input is not an Object or Array", function () {
    expect(differentia.isContainer(12345)).toBe(false);
    expect(differentia.isContainer("Hello World")).toBe(false);
    expect(differentia.isContainer(true)).toBe(false);
    expect(differentia.isContainer(false)).toBe(false);
  });
});

describe("getContainerLength", function () {
  var array = [1, 2, 3, 4, 5];
  var object = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
  it("should count 5 items in each container", function () {
    expect(differentia.getContainerLength(array)).toBe(5);
    expect(differentia.getContainerLength(object)).toBe(5);
  });
});

describe("Iterative Deepening Depth-First Search", function () {
  it("should throw a TypeError when no arguments are given", function () {
    expect(() => differentia.iddfs().next()).toThrow(new TypeError("Argument 1 must be an Object or Array"));
  });
  it("should throw a TypeError when argument 2 is not given", function () {
    expect(() => differentia.iddfs({}).next()).toThrow(new TypeError("Argument 2 must be a non-empty Object or Array"));
  });
  it("should throw a TypeError when any arguments are the wrong type", function () {
    expect(() => differentia.iddfs(123).next()).toThrow(new TypeError("Argument 1 must be an Object or Array"));
    expect(() => differentia.iddfs("test").next()).toThrow(new TypeError("Argument 1 must be an Object or Array"));
    expect(() => differentia.iddfs({}, 123).next()).toThrow(new TypeError("Argument 2 must be a non-empty Object or Array"));
    expect(() => differentia.iddfs({}, "test").next()).toThrow(new TypeError("Argument 2 must be a non-empty Object or Array"));
  });
  it("should iterate all nodes and properties", function () {
    var keyCounts = createKeyCounter();
    var testObject = testObjects["Multidimensional Cyclic"];
    var iterator = differentia.iddfs(testObject, testObject);
    var iteration = iterator.next();
    while (!iteration.done) {
      keyCounts[iteration.value.accessor]++;
      iteration = iterator.next();
    }
    console.group("IDDFS Traversal & Iteration Results:");
    for (var accessor in keyCounts) {
      console.info("Accessor \"" + accessor + "\" was visited " + keyCounts[accessor] + " time(s).");
      expect(keyCounts[accessor] > 0).toBe(true);
    }
    console.groupEnd();
  });
});

describe("forEach", function () {
  it("should iterate all nodes and properties", function () {
    var keyCounts = createKeyCounter();
    var testObject = testObjects["Multidimensional Cyclic"];
    differentia.forEach(testObject, function (value, accessor, object) {
      keyCounts[accessor]++;
    });
    console.group("forEach Traversal & Iteration Results:");
    for (var accessor in keyCounts) {
      console.info("Accessor \"" + accessor + "\" was visited " + keyCounts[accessor] + " time(s).");
      expect(keyCounts[accessor] > 0).toBe(true);
    }
    console.groupEnd();
  });
});

describe("Diff", function () {
  it("should return true when two objects differ", function () {
    expect(differentia.diff(testObjects["Linear Acyclic"], testObjects["Linear Cyclic"])).toBe(true);
    expect(differentia.diff(testObjects["Multidimensional Cyclic"], testObjects["Multidimensional Acyclic"])).toBe(true);
    expect(differentia.diff(testObjects["Linear Cyclic"], testObjects["Multidimensional Acyclic"])).toBe(true);
  });
  it("should return false when two objects are the same", function () {
    expect(differentia.diff(testObjects["Linear Acyclic"], testObjects["Linear Acyclic"])).toBe(false);
    expect(differentia.diff(testObjects["Linear Cyclic"], testObjects["Linear Cyclic"])).toBe(false);
    expect(differentia.diff(testObjects["Multidimensional Acyclic"], testObjects["Multidimensional Acyclic"])).toBe(false);
    expect(differentia.diff(testObjects["Multidimensional Cyclic"], testObjects["Multidimensional Cyclic"])).toBe(false);
  });
  it("should return true when two objects differ using the search index", function () {
    expect(differentia.diff(testObjects["Linear Acyclic"], testObjects["Linear Cyclic"], { 3: null })).toBe(true);
  });
  it("should return false when two objects are the same using the search index", function () {
    expect(differentia.diff(testObjects["Linear Acyclic"], testObjects["Linear Cyclic"], { 1: null })).toBe(false);
  });
});

describe("Clone", function () {
  it("should make an exact copy of the subject", function () {
    var clone = differentia.clone(testObjects["Linear Acyclic"]);
    expect(diff(clone, testObjects["Linear Acyclic"])).toBe(false);
    clone = differentia.clone(testObjects["Linear Cyclic"]);
    expect(diff(clone, testObjects["Linear Cyclic"])).toBe(false);
    clone = differentia.clone(testObjects["Multidimensional Cyclic"]);
    expect(diff(clone, testObjects["Multidimensional Cyclic"])).toBe(false);
  });
  it("should clone properties using the search index", function () {
    var clone = differentia.clone(testObjects["Linear Acyclic"], { 2: null });
    var search = { 2: Number };
    expect(diff(clone, testObjects["Linear Acyclic"], search)).toBe(false);
    search = [{
      address: {
        geo: {
          lat: null
        }
      }
    }];
    clone = differentia.clone(testObjects["Multidimensional Cyclic"], search);
    expect(diff(clone, testObjects["Multidimensional Cyclic"], search)).toBe(false);
  });
});

describe("Diff Clone", function () {
  var subject = { "hello": "world", "how": "are you?", "have a": "good day" };
  var compare = { "hello": "world", "whats": "up?", "have a": "good night" };
  it("should clone properties that differ", function () {
    var clone = differentia.diffClone(subject, compare);
    expect(diff(clone, { "how": "are you?", "have a": "good day" })).toBe(false);
  });
  it("should clone properties that differ using the search index", function () {
    var clone = differentia.diffClone(subject, compare, { "how": null });
    expect(diff(clone, { "how": "are you?" })).toBe(false);
  });
});

describe("find", function () {
  it("should return a value if it passes the test", function () {
    expect(differentia.find(testObjects["Multidimensional Cyclic"], function (value, accessor, object) {
      return value === -37.3159;
    })).toBe(-37.3159);
  });
  it("should return undefined if no values pass the test", function () {
    expect(differentia.find(testObjects["Multidimensional Cyclic"], function (value, accessor, object) {
      return value === "This string does not exist in the test object!";
    })).toBeUndefined();
  });
});

describe("every", function () {
  var testObject = [10, 11, 12, 13, 14, 15];
  it("should return true if all values pass the test", function () {
    expect(differentia.every(testObject, function (value, accessor, object) {
      return typeof value === "number" && value >= 10;
    })).toBe(true);
  });
  it("should return false if one value fails the test", function () {
    expect(differentia.every(testObject, function (value, accessor, object) {
      return typeof value === "number" && value < 13;
    })).toBe(false);
  });
});

describe("some", function () {
  var testObject = [10, 11, 12, 13, 14, 15];
  it("should return true if one value passes the test", function () {
    expect(differentia.some(testObject, function (value, accessor, object) {
      return typeof value === "number" && value === 13;
    })).toBe(true);
  });
  it("should return false if no values pass the test", function () {
    expect(differentia.some(testObject, function (value, accessor, object) {
      return typeof value === "number" && value < 10;
    })).toBe(false);
  });
});

describe("deepFreeze", function () {
  it("should freeze all nodes and properties", function () {
    var frozenObject = differentia.deepFreeze(differentia.clone(testObjects["Multidimensional Cyclic"]));
    expect(differentia.every(frozenObject, function (value, accessor, object) {
      return Object.isFrozen(object) && differentia.isContainer(value) ? Object.isFrozen(value) : true;
    })).toBe(true);
  });
});

describe("deepSeal", function () {
  it("should seal all nodes and properties", function () {
    var sealedObject = differentia.deepSeal(differentia.clone(testObjects["Multidimensional Cyclic"]));
    expect(differentia.every(sealedObject, function (value, accessor, object) {
      return Object.isSealed(object) && differentia.isContainer(value) ? Object.isSealed(value) : true;
    })).toBe(true);
  });
});