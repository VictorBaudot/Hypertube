"use strict";

const express = require('express');
const router = express.Router();
const SQL = require('../Model/SQL.class.js');
const sql = new SQL();
const htmlspecialchars = require("htmlspecialchars");

router.get('/', (req, res, next) => {
	if (req.isAuthenticated()) {
		let genres = [], directors = [], actors = [], videos = [];
		let filters = {
			score: { l: 0, u: 5.0 },
			year: { l: 1800, u: 2018 },
			genres: [],
			directors: [],
			actors: [],
			sortType: "score",
			sortOrder: "desc",
			videos_viewed: "all"
		}

		function display() {
			res.render("connected/index", { title: 'Accueil', videos, filters, genres, directors, actors, i18n: res })
		}

		function addVideosInfos() {
			let count = 0;
			let total = videos.length;
			videos.forEach(video => {
				// console.log(video)
				let count2 = 0;
				let total2 = 3;
				let tabGenres = [], tabActors = [], director;

				let check = () => {
					if (++count == total) display()
				}

				video.id = htmlspecialchars(video.id)

				sql.select('*', 'actors', { table: 'videos_actors', column1: 'actors.actor', column2: 'videos_actors.actor' }, { video_id: video.id }).then(result => {
					if (Object.keys(result).length > 0) {
						result.forEach(row => {
							tabActors.push(row.actor)
						})
						video.actors = tabActors.join(', ')
					}
					if (++count2 == total2) check()
				});

				sql.select('*', 'genres', { table: 'videos_genres', column1: 'genres.genre', column2: 'videos_genres.genre' }, { video_id: video.id }).then(result => {
					if (Object.keys(result).length > 0) {
						result.forEach(row => {
							tabGenres.push('#' + row.genre)
						})
						video.genres = tabGenres.join(', ')
					}
					if (++count2 == total2) check()
				});

				sql.select('*', 'directors', { table: 'videos_directors', column1: 'directors.director', column2: 'videos_directors.director' }, { video_id: video.id }).then(result => {
					if (Object.keys(result).length > 0) {
						video.director = result[0].director
					}
					if (++count2 == total2) check()
				});
			});

		}

		function getVideos() {
			sql.select('*', 'videos', {}, {}, { col: 'score', order: 'DESC' }).then(result => {
				if (result) {
					videos = result
				}
				addVideosInfos()
			});
		}

		function getInfos() {
			let count = 0;
			let total = 3;
			let data = ['genres', 'directors', 'actors']

			for (let i = 0; i < data.length; i++) {
				sql.select('*', data[i]).then(result => {
					if (Object.keys(result).length > 0) {
						data[i] = result
					}
					if (++count == total) getVideos()
				});
			}
		}

		getInfos()

	} else res.render("not_connected/index", { i18n: res })
});

module.exports = router;
