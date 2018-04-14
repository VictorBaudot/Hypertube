const request	=	require('request');

// module.exports = class Yify
class Yify
{
	getAll()
	{
		request('https://yts.ag/api/v2/list_movies.json?sort_by=rating&limit=50&page=1', function (error, response, body) {
			console.log('error:', error); // Print the error if one occurred
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			console.log('body:', body); // Print the HTML for the Google homepage.
		});
	}
}

let y = new Yify;
y.getAll();
