"use strict";

const express	=	require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: './public/pics/',
	filename: (req, file, cb) => {
			cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({
	storage: storage,
	limits:{fileSize: 3000000, files:1},
	fileFilter: (req, file, cb) => {
			checkFileType(file, cb);
	}
}).fields([{name: 'photo'}]);

module.exports = (passport) => {
	router.post('/', checkCredentials, addphoto, passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true, // allow flash messages
		session: false // prevent auto-login
	}));
	return router;
}

function checkCredentials(req, res, next) {
	console.log('Check credentials')
	console.log(req.body)
	console.log(req.files)
	let {login, first_name, last_name, email, password, psswd_confirm} = req.body
	if (login && first_name && last_name && email && password && psswd_confirm) return next();

	req.flashAdd('tabError', 'Tous les champs ne sont pas remplis.');
	res.redirect('back');
}


function addphoto(req, res, next) {
	console.log('Add Photo')
	upload(req, res, (err) => {
		if(err){
				console.error('Upload error', err)
				req.flashAdd('tabError', 'Le fichier que vous essayez d\'envoyer n\'est pas adapte');
				res.redirect('back');
		} else {
				let photo;
				console.log(req.files)
				if (Object.keys(req.files).length !== 0) {
						console.log("File: ")
						console.log(req.files['photo'][0].filename)
						photo = 'pics/'+req.files['photo'][0].filename
				} else photo = '/pics/default.jpg';
				req.body.photo = photo;
				console.log(photo)
				next()
			}
		})
}

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
		const mimetype = filetypes.test(file.mimetype);
		
    console.log('check image')
    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: Images Only!');
    }
  }