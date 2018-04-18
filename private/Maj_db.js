const Popcorn = require('../Model/Popcorn.js');
const Imdb = require('../Model/Imdb.js');
const Api = require('../Model/Api.js');
const SQL = require('../model/SQL.class.js');

function getAllInfo(films, films_db)
{
	let imdb = new Imdb;
	let api = new Api;
	var new_films = [];
	let	i = 0;

	return new Promise((resolve, reject) => {
		films.forEach((film, index) => {
			var found = films_db.find((elem) => {
			  return elem.imdb_id == film.imdb_id;
			});
			if (found == undefined) {
				imdb.getById(film.imdb_id).then((res) => {
					api.post(res).then((log) => {
						console.log(log);
					});
					// res.rating = film.rating.percentage/10;
					// new_films.push(res);
					// if (new_films.length == films.length)
					resolve(new_films)
				}).catch((err) => {console.log(err);});
			} else {
				resolve(0);
			}
		});
	});
}

async function maj_db(i)
{
	return new Promise((resolve, reject) => {
		let pop = new Popcorn;
		let sql = new SQL;
		let promise = pop.getOnePage(i);
		let getter;
		sql.select('*', 'films').then((films_db) => {
			promise.then((films) => {
				getAllInfo(films, films_db).then((new_films) => {
					// new_films.sort((a, b) => { return b.rating-a.rating; })
					resolve(new_films);
				})
			}).catch((err) => { console.log(err); });

		}).catch((err) => {console.log(err);});
	})
}

async function main_as() {
	// let result = await maj_db(1);
	for (var i = 1; i < 149; i++) {
		try {
			console.log("page number: ", i);
			let result = await maj_db(i);
		} catch (e) {
			console.log(e);
		}
	}
}

main_as();
