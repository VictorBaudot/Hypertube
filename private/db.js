const mysql = require('mysql')

const connection = mysql.createConnection({
	host: '',
	user: '',
	password: '',
	database: '',
	port: ''
});
//https://dev.mysql.com/doc/mysql-security-excerpt/5.7/en/adding-users.html
connection.connect()

module.exports = connection
