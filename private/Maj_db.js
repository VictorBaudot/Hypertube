const Popcorn = require('../Model/Popcorn.js');
const Yify = require('../Model/Yify.js');
const Imdb = require('../Model/Imdb.js');
const Api = require('../Model/Api.js');
const Thepiratebay = require('../Model/Thepiratebay.js');
const SQL = require('../Model/SQL.class.js');

function getAllInfo(films, films_db, model)
{
	let Tbp = new Thepiratebay;
	let imdb = new Imdb;
	let api = new Api;
	var new_films = [];
	let	i = 0;

	return new Promise((resolve, reject) => {
		films.forEach((film, index) => {
			var found = films_db.find((elem) => {
			  return elem.imdb_id == film.imdb_id;
			});
			if (found == undefined && model == "popcorn") {
				imdb.getById(film.imdb_id).then((res) => {
					res.magnet = film.torrents.en['720p'].url
					api.post(res).then((log) => {
						console.log(log);
					});
					resolve(new_films)
				}).catch((err) => {console.log(err);});
			} else if (found == undefined && model == "yify") {
				imdb.getById(film.imdb_code).then((res) => {
					// Tbp.getFilm(film.title).then((tbpFilm) => {
						// if (tbpFilm && tbpFilm[0] && tbpFilm[0].magnetLink)
						// 	res.magnet = tbpFilm[0].magnetLink;
						// else
						// 	reject(new_films);
						res.magnet = "magnet:?xt=urn:btih:" + film.torrents[0].hash;
						api.post(res).then((log) => {});
						resolve(new_films)
					// }).catch((e) => {console.log(e);})
				}).catch((err) => {console.log(err);});
			}
		});
	});
}

async function maj_db(i)
{
	return new Promise((resolve, reject) => {
		let sql = new SQL;
		let pop = new Popcorn;
		let popcorn = pop.getOnePage(i);
		let getter;

		sql.select('*', 'films').then((films_db) => {
			popcorn.then((films) => {
				getAllInfo(films, films_db, "popcorn").then((new_films) => {
					resolve(new_films);
				}).catch((err) => { console.log(err); reject(err);});
			}).catch((err) => { console.log(err); reject(err);});
		}).catch((err) => {console.log(err); reject(err);});


		let yif = new Yify;
		let yify = yif.getOnePage(i);

		sql.select('*', 'films').then((films_db) => {
			yify.then((films) => {
				getAllInfo(films, films_db, "yify").then((new_films) => {
					resolve(new_films);
				}).catch((err) => { console.log(err); reject(err);});
			}).catch((err) => { console.log(err); reject(err);});
		}).catch((err) => {console.log(err); reject(err);});

	})
}

async function main_as() {
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
