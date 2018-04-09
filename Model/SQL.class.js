"use strict";

const sql	=	require('mysql');

module.exports = class Sql
{
	constructor ()
	{
		this.sql = sql.createPool({
			host: 'localhost',
			user: 'root',
			password: 'Beauvois41',
			database: 'hypertube',
			port: 3306
		});
	}

	select (quantity, table, condition)
	{
		let request = "SELECT " + quantity + " FROM " + table;
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

	insert ()
	{

	}
};