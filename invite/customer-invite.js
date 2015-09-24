import {readFileSync} from "fs";

// Try to read the customer line data in [fileName] if an error occurs return an empty array.
// If data is found it will return an array of the customer data parsed into object literals.
export function readCustomerFile(fileName) {
	try {
		const fileData = readFileSync(fileName, "utf8");

		// [fileData] is "\n" delimited and can have a "\n" at the end of the file because editors can automatically
		// insert one, filter out empty strings to deal with that case.
		return fileData
			.split("\n")
			.filter(line => line !== "")
			.map(line => JSON.parse(line));
	} catch (error) {
		/*eslint-disable no-console*/
		console.error("Error accessing customer file", fileName, error);
		/*eslint-enable no-console*/

		return [];
	}
}

const EARTH_RADIUS = 6371; // km
const DD_DIVISOR = Math.PI / 180;

// Converts [decimalDegrees] to radians.
export function toRadians(decimalDegrees) {
	return decimalDegrees * DD_DIVISOR;
}

// Given the [latitude1] [latitude2] and [longitude1] [longitude2] in decimal degrees of two GPS positions
// calculate the distance in km.
export function distanceBetweenTwoLocations(latitude1, longitude1, latitude2, longitude2) {
	const lat1 = toRadians(latitude1);
	const lat2 = toRadians(latitude2);
	const dLat = toRadians(latitude2 - latitude1);
	const dLon = toRadians(longitude2 - longitude1);

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return EARTH_RADIUS * c;
}

// If any of [latitude], [user_id], [name] or [longitude] are undefined, null or the incorrect type false will
// be returned, else true.
export function isCustomerValid({latitude, user_id, name, longitude}) {
	if (typeof latitude === "string" && typeof user_id === "number"
		&& typeof name === "string" && typeof longitude === "string") {
		return true;
	}

	return false;
}

// Returns a function that when called with a customer will return a boolean indicating if the customer
// is within [distance] kms of [locationLatitude] and [locationLongitude].
export function isCustomerWithinDistanceOfLocation(locationLatitude, locationLongitude, distance) {
	return ({latitude, longitude}) =>
		distanceBetweenTwoLocations(locationLatitude, locationLongitude, latitude, longitude) <= distance;
}

// Will return a number below 0 if [firstCustomer] has a lower [user_id] than [secondCustomer] else
// a number above 0 will be returned.
export function sortByUserID(firstCustomer, secondCustomer) {
	return firstCustomer.user_id - secondCustomer.user_id;
}

// Returns an array of customers sorted in ascending [user_id] that are within [distance] of [locationLatitude]
// and [locationLongitude].
export function calculateCustomersWithinDistance(customersFile, locationLatitude, locationLongitude, distance) {
	return readCustomerFile(customersFile)
		.filter(isCustomerValid)
		.filter(isCustomerWithinDistanceOfLocation(locationLatitude, locationLongitude, distance))
		.sort(sortByUserID);
}
