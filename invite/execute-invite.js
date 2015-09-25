var join = require("path").join;

require("babel/register");

var calculateCustomersWithinDistance = require("./customer-invite").calculateCustomersWithinDistance;

// Location of JSON encoded customer data.
var customersFileLocation = join(__dirname, "./customers.json");

// For every customer within [100] kms of specified location print their [name] and [user_id].
calculateCustomersWithinDistance(customersFileLocation, "53.3381985", "-6.2592576", 100)
	.forEach(function(customer) {
		/*eslint-disable no-console*/
		console.log(customer.name, customer.user_id);
		/*eslint-enable no-console*/
	});
