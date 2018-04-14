"use strict";

const sql	=	require('mysql');

module.exports = class Sql
{
	constructor ()
	{
		this.sql = sql.createPool({
			host: 'localhost',
			user: 'root',
			password: 'root',
			database: 'hypertube',
			port: 3306
		});
	}

	select (columns, table, condition)
	{
		let request = "SELECT " + columns + " FROM " + table;
		if (Object.keys(condition).length > 0)
		{
			request += " WHERE ";
			for (let i in condition)
			{
				if (Array.isArray(condition[i]))
				{
					request += " ( ";
					for (let j in condition[i])
						request += i + " = '" + condition[i][j] + "' OR ";
					request = request.substr(0, request.length - 4);
					request += " ) AND ";
				}
				else
					request += i + " = '" + condition[i] + "' AND ";
			}
			request = request.substr(0, request.length - 5);
		}
		return new Promise((resolve, reject) => {
			this.sql.query(request, (err, result, fields) => {
				if (err) throw err;
				resolve(result);
			});
		});
	}

	insert (table, value)
	{
		let request = "INSERT INTO " + table + " SET ?";
		let params = {};

		for (let i in value)
			params[i] = value[i];
		return (new Promise((resolve, reject) => {
			this.sql.query(request, params, (err, result, fields) => {
				if (err) throw err;
				resolve(result);
			});
		}));
	}

	update (table, idcol, id, values)
	{

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
};
