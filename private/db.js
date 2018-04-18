const mysql = require('mysql')

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'finley',
	password: 'password',
	database: 'hypertube',
	port: 3306
});
//https://dev.mysql.com/doc/mysql-security-excerpt/5.7/en/adding-users.html
connection.connect()

module.exports = connection
