// Generator that will yield all the values within [arrayToFlatten], in a depth first order, including nested arrays.
function* arrayFlattenerGen(arrayToFlatten) {
	for (let value of arrayToFlatten) {
		if (Array.isArray(value)) {
			yield* arrayFlattenerGen(value);
		} else {
			yield value;
		}
	}
}

// Will flatten [arrayToFlatten] if it is of type Array, if it is not an empty Array will be returned and a
// warning will be logged.
export function flattenArray(arrayToFlatten) {
	if (Array.isArray(arrayToFlatten)) {
		return [...arrayFlattenerGen(arrayToFlatten)];
	}

	// If the [arrayToFlatten] parameter is not an array we return an empty array as that is the type the function
	// is meant to return and we log a warning that the function is being called with incorrect data.

	/*eslint-disable no-console*/
	console.warn("arrayFlattener was incorrectly called with a non Array parameter", arrayToFlatten);
	/*eslint-enable no-console*/

	return [];
}
