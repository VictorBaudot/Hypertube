"use strict";

const express = require('express');
const router = express.Router();
const SQL = require('../Model/SQL.class.js');
const sql = new SQL();
const htmlspecialchars = require("htmlspecialchars");
const Api	= require('../Model/Api.js');

router.get('/', (req, res, next) => {
	let api = new Api;

	if (req.cookies.i18n == undefined) res.setLocale('en')
  else res.setLocale(req.cookies.i18n)

	if (req.isAuthenticated()) {
		let infos = {genres: [], directors: [], actors: []}
		let films = []
		let filters = {
			title: '',
			page: 1,
			rating: { l: 0, u: 10.0 },
			year: { l: 1900, u: 2018 },
			genres: [],
			directors: [],
			actors: [],
			sortType: "rating",
			sortOrder: "desc",
			videos_viewed: "all"
		}

		function display() {
			for (const key in infos) {
				if (infos.hasOwnProperty(key)) {
					infos[key].sort();
				}
			}
			res.render("connected/index", {
				films,
				title: 'Accueil',
				filters,
				genres: infos.genres,
				directors: infos.directors,
				actors: infos.actors,
				i18n: res,
				history: (req.user.view_history && req.user.view_history.length) ? req.user.view_history.split(',') : []
			})
		}

		function getInfos() {
			films.forEach(video =>{
				let infos_video = {genres: [], directors: [], actors: []}
				for (const key in infos_video) {
					if (infos_video.hasOwnProperty(key)) {
						if (key == "genres") infos_video[key] = video.genre.split(", ")
						else if (key == "directors") infos_video[key] = video.director.split(" ,")
						else infos_video[key] = video.actors.split(" , ")
						infos_video[key].forEach(elem => {
							if (!infos[key].includes(elem) && elem != '' && elem != ' ') infos[key].push(elem)
						})
					}
				}

			})
			display()
		}

		function getVideos() {
			api.get(filters).then((body) => {
				films = body.films
				getInfos()
			}).catch((err) => { console.log(err); });
		}

		getVideos()

	} else res.render("not_connected/index", { i18n: res })
});

module.exports = router;
