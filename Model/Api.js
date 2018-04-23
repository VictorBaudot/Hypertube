const request	=	require('request');
const token = "kb90dQbxzq0397352800";

module.exports = class Api
{

	get(params) {
		return new Promise((resolve, reject) => {
			let request_params = ""
			
			for (const key in params) {
				if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != '') {
					if (key == "rating" || key == "year") request_params += '&'+key+'L='+ params[key].l+'&'+key+'U='+ params[key].u
					else request_params += '&'+key+'='+ params[key]
				}
			}
			console.log(request_params)
			request.get("http://127.0.0.1:3001/api?token=" + token + request_params, function (err, response, body) {
				if (err) throw console.log(err);;
				resolve(JSON.parse(body));
			});
		});
	}

	post(form) {
		return new Promise((resolve, reject) => {
			request.post({ url: "http://127.0.0.1:3001/api?token="+token, form: form }, function (err, response, body) {
				if (err) throw console.log(err);;
				resolve(JSON.parse(body));
			});
		});
	}

	put(form) {
		return new Promise((resolve, reject) => {
			request.put({ url: "http://127.0.0.1:3001/api?token="+token, form: form }, function (err, response, body) {
				if (err) throw console.log(err);;
				resolve(JSON.parse(body));
			});
		});
	}

	delete(form) {
		return new Promise((resolve, reject) => {
			request.delete({ url: "http://127.0.0.1:3001/api?token="+token, form: form }, function (err, response, body) {
				if (err) throw console.log(err);;
				resolve(JSON.parse(body));
			});
		});
	}

}
