const mysql = require('mysql')

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'finley',
	password: 'password',
	database: 'hypertube',
	port: 3306
});

connection.connect()

module.exports = connection
