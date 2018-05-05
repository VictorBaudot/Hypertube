const mysql = require('mysql')

const connection = mysql.createConnection({
	host: '',
	user: '',
	password: '',
	database: '',
	port: ''
});
connection.connect()

module.exports = connection
