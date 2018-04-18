const request	=	require('request');
const PirateBay = require('thepiratebay')

module.exports = class Thepiratebay
{
	getOnePage(Pagenumber)
	{
		return new Promise((resolve, reject) => {
			let body = PirateBay.search('harry potter', {
			    category: 'video',
				subcategory: 201,
			    page: Pagenumber,
			    orderBy: 'seeds',
			    sortBy: 'desc'
			  })
			resolve(body);
		});
	}

	getFilm(name)
	{
		return new Promise((resolve, reject) => {
			PirateBay.search(name, {
			  category: 201
			})
			.then((result) => {
				resolve(result);
			}).catch(err => console.log(err))
		});
	}

	getFilmbyId(id)
	{
		return new Promise((resolve, reject) => {
			PirateBay.getTorrent(id)
			.then((result) => {
				resolve(result);
			}).catch(err => console.log(err))
		});
	}

}
