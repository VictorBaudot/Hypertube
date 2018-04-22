"use strict";

const express = require('express');
const router = express.Router();
const SQL = require('../Model/SQL.class.js');
const sql = new SQL();
const htmlspecialchars = require("htmlspecialchars");
const Api	= require('../Model/Api.js');

router.post('/', (req, res, next) => {
	let api = new Api;

	if (req.isAuthenticated()) {
		let infos = {genres: [], directors: [], actors: []}
		let allFilms = []
		let renderedFilms = []
		let {title, ratingL, ratingU, yearL, yearU, videos_viewed, filterGenres, filterDirectors, filterActors, sortType, sortOrder} = req.body
    	let filters = {
			page: 1,
			title: '',
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
				user: req.user,
				films: renderedFilms,
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
			var viewed = []
			if (req.user.view_history && req.user.view_history.length) {
				viewed = req.user.view_history.split(',')
			}

			if (videos_viewed == 'Y') {
				renderedFilms = renderedFilms.filter(video => viewed.indexOf(video.imdb_id) != -1)
			} else if (videos_viewed == 'N') {
				renderedFilms = renderedFilms.filter(video => viewed.indexOf(video.imdb_id) == -1)
			}
			allFilms.forEach(video =>{
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
			api.get(filters) // get list of films to be rendered
			.then((body) => {
				renderedFilms = body.films
				return api.get({}) // we still need all genre etc. for the form
			})
			.then((body) => {
				allFilms = body.films
				getInfos()
			})
			.catch((err) => { console.log(err); });
		}

    function getFilters() {
      if (sortType && (sortType === "title" || sortType === "rating" || sortType === "year")) {
        filters.sortType = sortType
        if (sortOrder && (sortOrder === "asc" || sortOrder === "desc")) {
          filters.sortOrder = sortOrder
        }
      }
      if (ratingL && ratingU && ratingL >= 0 && ratingL <= 9.9 && ratingU >= 0.1 && ratingU <= 10) {
        filters.rating.l = ratingL
        filters.rating.u = ratingU
      }
      if (yearL && yearU && yearL >= 1900 && yearL <= 2017 && yearU >= 1901 && yearU <= 2018) {
        filters.year.l = yearL
        filters.year.u = yearU
      }
			// ADD REGEX

			const filtersRegex = new RegExp("^[a-zA-Z0-9\p{L}_,\ +-]{1,1000}$");

			if (title && filtersRegex.test(title)) filters.title = title
      if (filterGenres && filtersRegex.test(filterGenres)) filters.genres = filterGenres
      if (filterActors && filtersRegex.test(filterActors)) filters.actors = filterActors
			if (filterDirectors && filtersRegex.test(filterDirectors)) filters.directors = filterDirectors
			
      if (videos_viewed && (videos_viewed == "Y" || videos_viewed == "N")) filters.videos_viewed = videos_viewed

      getVideos()
    }

		getFilters()

	} else res.render("not_connected/index", { i18n: res })
});

module.exports = router;
