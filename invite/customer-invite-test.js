import {join} from "path";
import {deepStrictEqual} from "assert";

import {it, describe} from "mocha";

import {
	toRadians,
	sortByUserID,
	isCustomerValid,
	readCustomerFile,
	distanceBetweenTwoLocations,
	calculateCustomersWithinDistance,
	isCustomerWithinDistanceOfLocation
} from "./customer-invite";

describe("customer inviter", () => {
	// Location of real customers file.
	const customersFileLocation = join(__dirname, "./customers.json");
	// Function that will reduce a array of customers ordered by [user_id] to the last customer object. If the
	// array being reduced does not have customers in the correct order it will return undefined.
	const orderedCustomersReducer = (previousCustomer, currentCustomer) => {
		if (previousCustomer.user_id < currentCustomer.user_id) {
			return currentCustomer;
		}
	};
	// Some customers.
	const customerLA = {
		"latitude": "53.0033946",
		"user_id": 39,
		"name": "Lisa Ahearn",
		"longitude": "-6.3877505"
	};
	const customerCM = {
		"latitude": "52.986375",
		"user_id": 12,
		"name": "Christina McArdle",
		"longitude": "-6.043701"
	};
	const customerAB = {
		"latitude": "53.1489345",
		"user_id": 31,
		"name": "Alan Behan",
		"longitude": "-6.8422408"
	};

	it("readCustomerFile should return the parsed array of customers.", () => {
		// when
		const customers = readCustomerFile(customersFileLocation);

		// then
		deepStrictEqual(customers.length, 32);
		deepStrictEqual(customers[0], customerCM);
		deepStrictEqual(customers[15], customerAB);
	});

	it("readCustomerFile should return an empty array of customers if customers file cannot be found.", () => {
		// when
		const customers = readCustomerFile("./non-existant-file.json");

		// then
		deepStrictEqual(customers, []);
	});

	it("sortByUserID should sort an array of customers on user_id.", () => {
		// given
		const customers = readCustomerFile(customersFileLocation);

		// when
		customers.sort(sortByUserID);

		// then
		const lastCustomerIfCustomersInUserIDOrder = customers.reduce(orderedCustomersReducer);
		deepStrictEqual(customers.length, 32);
		deepStrictEqual(lastCustomerIfCustomersInUserIDOrder, customers[31]);
		deepStrictEqual(customers[31], customerLA);
	});

	it("toRadians should convert degrees to radians.", () => {
		// then
		deepStrictEqual(toRadians("52.986375"), 0.9247867024464105);
		deepStrictEqual(toRadians("-6.043701"), -0.10548248145607382);
		deepStrictEqual(toRadians("51.999447"), 0.9075615593662879);
	});

	it("distanceBetweenTwoLocations should calculate location distances.", () => {
		// then
		deepStrictEqual(
			distanceBetweenTwoLocations("52.986375", "-6.043701", "51.92893", "-10.27699"),
			309.9365659534391
		);
		deepStrictEqual(
			distanceBetweenTwoLocations("53.3381985", "-6.2592576", "53.4692815", "-9.436036"),
			211.07911237537635
		);
		deepStrictEqual(
			distanceBetweenTwoLocations("53.3381985", "-6.2592576", "53.1489345", "-6.8422408"),
			44.13286096134978
		);
	});

	it("isCustomerWithinDistanceOfLocation should calculate if location is within distance.", () => {
		// given
		const customerOutside = {
			"latitude": "51.999447",
			"user_id": 14,
			"name": "Helen Cahill",
			"longitude": "-9.742744"
		};

		// when
		const customerIsWithin = isCustomerWithinDistanceOfLocation("53.3381985", "-6.2592576", 100)(customerLA);
		const customerIsOutside = isCustomerWithinDistanceOfLocation("53.3381985", "-6.2592576", 100)(customerOutside);

		// then
		deepStrictEqual(customerIsWithin, true);
		deepStrictEqual(customerIsOutside, false);
	});

	it("calculateCustomersWithinDistance finds all customers within specified distance.", () => {
		// when
		const eligibleCustomers = calculateCustomersWithinDistance(
			customersFileLocation, "53.3381985", "-6.2592576", 100
		);

		// then
		const lastCustomerIfCustomersInUserIDOrder = eligibleCustomers.reduce(orderedCustomersReducer);
		deepStrictEqual(eligibleCustomers.length, 16);
		deepStrictEqual(lastCustomerIfCustomersInUserIDOrder, eligibleCustomers[15]);
		deepStrictEqual(eligibleCustomers[15], customerLA);
		deepStrictEqual(eligibleCustomers[5], customerCM);
		deepStrictEqual(eligibleCustomers[14], customerAB);
	});

	it("isCustomerValid filters out null and undefined customer properties.", () => {
		// when
		const missingLatitude = isCustomerValid({"user_id": 31, "name": "Alan Behan", "longitude": "-6.8422408"});
		const nullName = isCustomerValid({"latitude": "51", "user_id": 31, "name": null, "longitude": "-6.8422408"});
		const missingLongitude = isCustomerValid({"latitude": "51", "user_id": 31, "name": "AB"});
		const nullUserID = isCustomerValid({"latitude": "51", "user_id": null, "name": "AB", "longitude": "7"});

		// then
		deepStrictEqual(missingLatitude, false);
		deepStrictEqual(nullName, false);
		deepStrictEqual(missingLongitude, false);
		deepStrictEqual(nullUserID, false);
	});
});
