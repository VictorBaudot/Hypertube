"use strict";

const sql = require('mysql');

module.exports = class Sql {
	constructor() {
		this.sql = sql.createPool({
			host: 'localhost',
			user: 'finley',
			password: 'password',
			database: 'hypertube',
			port: 3306
		});
	}

	select(columns, table, innerjoin, condition, orderby, more = "", between = "") {
		let request = "SELECT " + columns + " FROM " + table;
		if (innerjoin && Object.keys(innerjoin).length > 0) {
			request += " INNER JOIN " + innerjoin.table + " ON " + innerjoin.column1 + " = " + innerjoin.column2;
		}
		if (condition && Object.keys(condition).length > 0) {
			request += " WHERE ";
			for (let i in condition) {
				if (Array.isArray(condition[i])) {
					request += " ( ";
					for (let j in condition[i])
						request += i + " = ? OR ";
					request = request.substr(0, request.length - 4);
					request += " ) AND ";
				}
				else
					request += i + " = ? AND ";
			}
			request = request.substr(0, request.length - 5);
			request += between;
		} else if (between && between.length > 0) request += " WHERE " + between.substr(5, between.length);


		if (orderby && Object.keys(orderby).length > 0) {
			request += " ORDER BY " + orderby.col;
			if (orderby.order) request += " " + orderby.order;
		}

		let params = []
		if (condition) {
			for (const key in condition) {
				params.push(condition[key])
			}
		}

		request += more;

		return new Promise((resolve, reject) => {
			this.sql.getConnection(function(error, connection) {
				connection.query(request, params, (err, result, fields) => {
					connection.release();
					if (err) throw console.log(err);
					resolve(result);
				});
			});
		});
	}

	insert(table, value) {

		let request = "INSERT INTO " + table + " SET ?";
		let params = {};

		for (let i in value)
			params[i] = value[i];
		return (new Promise((resolve, reject) => {
			this.sql.getConnection(function(error, connection) {
				connection.query(request, params, (err, result, fields) => {
					connection.release();
					if (err) throw console.log(err);
					resolve(result);
				});
			});
		}));
	}

	update(table, idcol, id, values) {

		let keys = Object.keys(values);

		//   console.log(keys)
		let cols = keys.map(k => `${k} = ?`).join(', ');
		//   console.log(cols)

		let request = `UPDATE ${table} SET ${cols} WHERE ${idcol} = ?`;
		// console.log(request)
		let params = keys.map(k => values[k]).concat(id);

		// console.log(params)

		return (new Promise((resolve, reject) => {
			this.sql.query(request, params, (err, result, fields) => {
				if (err) throw err;
				resolve(result);
			});
		}));
	}

	delete(table, col, params) {

		let request = `DELETE FROM ${table} WHERE ${col} = ?`;

		return (new Promise((resolve, reject) => {
			this.sql.query(request, params, (err, result, fields) => {
				if (err) throw err;
				resolve(result);
			});
		}));
	}
};
