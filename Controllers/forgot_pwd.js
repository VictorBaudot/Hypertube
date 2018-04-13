"use strict";

const express	=	require('express');
const router	=	express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt-nodejs');
const connection = require('./../scripts/db');

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
    connection.query("SELECT * FROM users WHERE login = ? AND email = ?",[login, email], (err, rows) => {
      if (err) return console.log(err);
      else if (!rows.length) {
        req.flashAdd('tabError', 'Les informations que vous venez d\'envoyer sont incorrectes.')
        res.redirect('back')
      }
      else {
        id = rows[0].id
        let newpwd = generatePassword()
        let newpwd_crypt = bcrypt.hashSync(newpwd, bcrypt.genSaltSync(9))
        connection.query("UPDATE users SET psswd = ? WHERE id = ?",[newpwd_crypt, id], (err, rows) => {
          if (err) return console.log(err);
          else go("Reinitialisation Mot de Passe", newpwd, newpwd, email)
        })
      }
    })
  }

  let go = (subj, msgtext, msghtml, towho) => {
    nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

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
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
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