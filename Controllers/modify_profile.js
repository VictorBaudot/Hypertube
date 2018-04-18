"use strict";

const express				=	require('express');
const router				=	express.Router();
const htmlspecialchars		=	require("htmlspecialchars");
const SQL					=	require('../Model/SQL.class');
const Check = require('../Model/check');
const bcrypt = require('bcrypt-nodejs');
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
  limits:{fileSize: 3000000},
  fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
  }
}).fields([{name: 'photo'}]);

router.post('/', (req, res, next) => {
  upload(req, res, (err) => {
    if(err){
        console.log(err)
        req.flashAdd('tabError', 'Le fichier que vous essayez d\'envoyer n\'est pas adapte');
        res.redirect('back')
    } else {
        modify_pics(req, res, modify_profile)
    }
  });
})

function modify_pics(req, res, cb) {
  let id = req.user.id
      //console.log(JSON.stringify(o, null, 4));
  if (Object.keys(req.files).length !== 0) {
    // console.log("File: ")
    // console.log(req.files['photo'][0].filename)
    let photo = '/pics/'+req.files['photo'][0].filename
    let sql = new SQL();
    sql.update('users', 'id', id, {photo: photo}).then(result => {
      if (Object.keys(result).length > 0){
        req.flashAdd('tabSuccess', 'Modification des photos de profil reussie.');
        cb(req, res)
      }
      else cb(req, res)
    });
  } else cb(req, res)
}

function modify_profile (req, res) {
  // console.log("File: ")
  // console.log(req.files)
  // console.log("Body: ")
  // console.log(req.body)
  const Check = require('./../Model/check')
  let {login, first_name, last_name, email, psswd, psswd_confirm} = req.body
  let params = {login, first_name, last_name, email, psswd, psswd_confirm}
  let count = 0
  let o = {}
  let id = req.user.id
  let valid = true
  let total = 0

  console.log(JSON.stringify(params, null, 4));

  for (let i in params) {
      if (params[i] && i !== 'psswd_confirm') total++
  }

  if (total === 0) {
      if (Object.keys(req.files).length === 0) req.flashAdd('tabError', 'Aucune modification n\'a ete enregistree.');
      res.redirect('/profile')
  }

  function modify () {
  //  console.log(JSON.stringify(o, null, 4));
      if (Object.keys(o).length !== 0){
          let sql = new SQL();
          sql.update('users', 'id', id, o).then(result => {
            if (Object.keys(result).length > 0){
              for (let i in o) {
                if (o[i] && i !== 'psswd_confirm') req.flashAdd('tabSuccess', capitalizeFirstLetter(i)+' -> '+o[i]);
              }
              res.redirect('/profile')
            }
            else res.redirect('/profile')
          });
      } else res.redirect('/profile')
  }

  function checkField (i) {
      if (i === "psswd") {
          Check[i](params[i], params["psswd_confirm"], req, (check) => {
              if (check === true) o[i] = bcrypt.hashSync(params[i], bcrypt.genSaltSync(9))
              count++
              if (count === total) {
                  modify()
              }
          })
      } else Check[i](params[i], req, (check) => {
          if (check === true) {
              if (i === "first_name" || i === "last_name") o[i] = capitalizeFirstLetter(params[i])
              else o[i] = params[i]
          }
          count++
          if (count === total) {
              modify()
          }
      })
  }

  for (let i in params) {
      if (params[i] && i !== 'psswd_confirm') {
        //  console.log(i+" - "+params[i])
        checkField(i)
      }
  }

}

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
      return cb(null,true);
  } else {
      cb('Error: Images Only!');
  }
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = router