var GoogleSpreadsheet = require('google-spreadsheet');

var creds = require('./client_secret.json');


// Create a document object using the ID of the spreadsheet - obtained from its URL.

var doc = new GoogleSpreadsheet('1AWi6mryVBu59Nx0Z9yszuou6xe9MetXxVZs1Om7FTps');


exports.logData = function (params) {
	doc.useServiceAccountAuth(creds, function (err) {
		doc.addRow(3, params, function () {});
	});
}

exports.getPageStats = function (callback) {
	doc.useServiceAccountAuth(creds, function (err) {
		doc.getRows(4, function (err, rows) {
			callback(rows);

		});

	});
}