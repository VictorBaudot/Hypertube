"use strict";

const express	=	require('express');
const router	=	express.Router();

module.exports = (passport) => {
  router.get('/42', passport.authenticate('42'));

  router.get('/42/callback', 
    passport.authenticate('42', { failureRedirect: '/' }), 
    (req, res) => {
      res.redirect('/video/1'); // Successful authentication, redirect home.
  }); 
  
  // router.get('/facebook', passport.authenticate('facebook'));

  // router.get('/facebook/callback', 
  //   passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/' }));

  router.get('/twitter', passport.authenticate('twitter'));

  router.get('/twitter/callback', 
    passport.authenticate('twitter', { successRedirect: '/profile', failureRedirect: '/' }));
  
  return router
}