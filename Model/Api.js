const request	=	require('request');
const token = "kb90dQbxzq0397352800";

module.exports = class Api
{

	get() {
		return new Promise((resolve, reject) => {
			request.get("http://127.0.0.1:3001/api?token=${token}", function (err, response, body) {
				if (err) throw console.log(err);;
				resolve(JSON.parse(body));
			});
		});
	}

	post(form) {
		return new Promise((resolve, reject) => {
			request.post({ url: "http://127.0.0.1:3001/api?token=${token}", form: form }, function (err, response, body) {
				if (err) throw console.log(err);;
				resolve(JSON.parse(body));
			});
		});
	}

	put(form) {
		return new Promise((resolve, reject) => {
			request.put({ url: "http://127.0.0.1:3001/api?token=${token}", form: form }, function (err, response, body) {
				if (err) throw console.log(err);;
				resolve(JSON.parse(body));
			});
		});
	}

	delete(form) {
		return new Promise((resolve, reject) => {
			request.delete({ url: "http://127.0.0.1:3001/api?token=${token}", form: form }, function (err, response, body) {
				if (err) throw console.log(err);;
				resolve(JSON.parse(body));
			});
		});
	}

}
