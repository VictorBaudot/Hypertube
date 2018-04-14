const mysql = require('mysql')

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'hypertube',
	port: 3306
});

connection.connect()

module.exports = connection
