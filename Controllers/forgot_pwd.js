"use strict";

const express	=	require('express');
const router	=	express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt-nodejs');
const SQL = require('../Model/SQL.class.js');
const sql = new SQL();

router.get('/', (req, res, next) => {
	res.render('not_connected/forgot_pwd', { error : false });
});

router.post('/', (req, res, next) => {
  forgot_pwd(req, res)
});

function forgot_pwd(req, res) {
  let {login, email} = req.body
  let id
  let check = () => {
    sql.select('*', 'users', {}, {login: login, email: email}).then(result => {
      if (Object.keys(result).length > 0) {
        id = result[0].id
        let newpwd = generatePassword()
        let newpwd_crypt = bcrypt.hashSync(newpwd, bcrypt.genSaltSync(9))
        sql.update('users', 'id', id, {psswd: newpwd_crypt}).then(result => {
          if (Object.keys(result).length > 0){
            go("Reinitialisation Mot de Passe", newpwd, newpwd, email)
          }
        });
      } else {
        req.flashAdd('tabError', 'Les informations que vous venez d\'envoyer sont incorrectes.')
        res.redirect('back')
      }
    });
  }

  let go = (subj, msgtext, msghtml, towho) => {
    nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return process.exit(1);
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        port: 1025,
        ignoreTLS : true
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Hypertube admins 👻" <admins@hypertube.com>', // sender address
      to: towho, // list of receivers
      subject: subj, // Subject line
      text: msgtext, // plain text body
      html: msghtml // html body
  };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log('Error occurred. ' + err.message);
          return process.exit(1);
        }
        req.flashAdd('tabSuccess', 'Felicitations, votre nouveau mot de passe vient de vous etre envoye!')
        res.redirect('/')

    });
  });
  }
  check()
}

let generatePassword = () => {
  var length = 12,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

module.exports = router