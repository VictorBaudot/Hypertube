const mysql = require('mysql')

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Beauvois41',
	database: 'hypertube',
	port: 3306
});

connection.connect()

module.exports = connection
