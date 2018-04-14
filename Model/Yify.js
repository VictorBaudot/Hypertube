const request	=	require('request');

module.exports = class Yify
// class Yify
{
	getOnePage(Pagenumber)
	{
		request('https://yts.ag/api/v2/list_movies.json?sort_by=rating&limit=50&page='+Pagenumber, function (error, response, body) {
			if (response && response.statusCode == 200)
				return JSON.parse(body);
			// console.log('error:', error); // Print the error if one occurred
			// console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			// let obj = JSON.parse(body);
			// // for (var i = 0; i < obj.data.movies.length; i++) {
			// // 	obj.data.movies[i];
			// // }
			// console.log('body:', obj.data.movies[0].background_image) // Print the HTML for the Google homepage.
		});
	}
}

// let y = new Yify;
// let res = y.getOnePage(1);
