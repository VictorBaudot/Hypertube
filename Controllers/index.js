"use strict";

const express = require('express');
const router = express.Router();
const connection = require('../private/db')

router.get('/', (req, res, next) => {
	if (req.isAuthenticated()) {
		let genres = [], directors = [], actors = [], videos = [];

		function display() {
			console.log('Display')
			// console.log(videos)
			// videos.forEach(video => {
			// 	console.log(video.genres)
			// })
			res.render("connected/index", { title: 'Accueil', videos, i18n: res })
		}

		function addVideosInfos() {
			console.log('Add Videos Infos')
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

				connection.query("SELECT genres.genre FROM genres INNER JOIN videos_genres ON genres.genre = videos_genres.genre WHERE video_id = ?", video.id, (err, rows) => {
					if (err) throw err;
					rows.forEach(row => {
						tabGenres.push('#'+row.genre)
					})
					video.genres = tabGenres.join(', ')
					if (++count2 == total2) check()
				});

				connection.query("SELECT actors.actor FROM actors INNER JOIN videos_actors ON actors.actor = videos_actors.actor WHERE video_id = ?", video.id, (err, rows) => {
					if (err) throw err;
					rows.forEach(row => {
						tabActors.push(row.actor)
					})
					video.actors = tabActors.join(', ')
					if (++count2 == total2) check()
				});

				connection.query("SELECT directors.director FROM directors INNER JOIN videos_directors ON directors.director = videos_directors.director WHERE video_id = ?", video.id, (err, rows) => {
					if (err) throw err;
					video.director = rows[0].director
					if (++count2 == total2) check()
				});
				
				
			});
			
		}

		function getVideos() {
			console.log('Get Videos')
			connection.query("SELECT * FROM videos ORDER BY score DESC", (err, rows) => {
				if (err) throw err;
				videos = rows
				addVideosInfos()
			});
		}

		function getInfos() {
			console.log('Get Infos')
			let count = 0;
			let total = 3;

			connection.query("SELECT * FROM genres", (err, rows) => {
				if (err) throw err;
				genres = rows
				count++
				if (count == total)
					getVideos()
			});

			connection.query("SELECT * FROM directors", (err, rows) => {
				if (err) throw err;
				directors = rows
				count++
				if (count == total)
					getVideos()
			});

			connection.query("SELECT * FROM actors", (err, rows) => {
				if (err) throw err;
				actors = rows
				count++
				if (count == total)
					getVideos()
			});

		}

		getInfos()

	} else res.render("not_connected/index", { i18n: res })
});

module.exports = router;
