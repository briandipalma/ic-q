import {deepStrictEqual} from "assert";

import {property} from "jsverify";
import {it, describe} from "mocha";
import isEqual from "lodash.isequal";

import {flattenArray} from "./array-flattener";

describe("flatten", () => {
	it("should return an empty array when passed in non Array arguments", () => {
		deepStrictEqual(flattenArray(), []);
		deepStrictEqual(flattenArray(null), []);
		deepStrictEqual(flattenArray({}), []);
		deepStrictEqual(flattenArray("test"), []);
	});

	// Use property testing for this simple case.
	property(
		"should return a flat array when given a flat array",
		"array nat",
		(arrayToFlatten) => isEqual(flattenArray(arrayToFlatten), arrayToFlatten)
	);

	it("should return a flat array when passed in one level nested Array arguments", () => {
		deepStrictEqual(flattenArray([1, [2, 3]]), [1, 2, 3]);
	});

	it("should return a flat array when passed in two level nested Array arguments", () => {
		deepStrictEqual(flattenArray([1, [3, [4, 7]]]), [1, 3, 4, 7]);
	});

	it("should return a flat array when passed in three level nested Array arguments", () => {
		deepStrictEqual(flattenArray([1, [3, [4, [9]]]]), [1, 3, 4, 9]);
	});

	it("should return a flat array when passed in empty nested Array arguments", () => {
		deepStrictEqual(flattenArray([1, [3, [4, []]]]), [1, 3, 4]);
	});
});
