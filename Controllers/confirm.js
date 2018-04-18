"use strict";

const express	=	require('express');
const router = express.Router();
const SQL = require('../Model/SQL.class.js');
const sql = new SQL();

router.get('/:login/:token', (req, res) => {
  confirm(req, res)
})


function confirm(req, res) {
  let login = req.params.login
  let token = req.params.token

  sql.select('*', 'users', {}, {login: login, token: token}).then(result => {
    if (Object.keys(result).length > 0) {
      sql.update('users', 'id', result[0].id, {email_confirmed: 1}).then(result => {
        req.flashAdd('tabSuccess', 'Email valide. Vous pouvez maintenant vous connecter.')
          res.redirect('/')
      })
    } else {
      req.flashAdd('tabError', 'Votre lien de confirmation n\'est pas valide.')
      res.redirect('/')
    }
  })
}

module.exports = router