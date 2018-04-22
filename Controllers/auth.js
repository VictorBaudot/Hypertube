"use strict";

const express	=	require('express');
const router	=	express.Router();

module.exports = (passport) => {
  router.get('/42', passport.authenticate('42'));

  router.get('/42/callback', passport.authenticate('42', { failureRedirect: '/' }), 
    (req, res) => {
      res.redirect('/'); // Successful authentication, redirect home.
  }); 
  
  // router.get('/facebook', passport.authenticate('facebook'));

  // router.get('/facebook/callback', 
  //   passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/' }));

  router.get('/twitter', passport.authenticate('twitter'));

  router.get('/twitter/callback', 
    passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/' }));
  
  router.get('/github', passport.authenticate('github'));
 
  router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/');
  });

  router.get('/linkedin', passport.authenticate(('linkedin')));

  router.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/');
  });

  router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

  router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/');
  });

  return router
}