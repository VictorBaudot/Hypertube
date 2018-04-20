"use strict";

const express = require('express');
const router = express.Router();

router.get('/fr', (req, res, next) => {
  res.cookie('i18n', 'fr');
  res.redirect('back')
})

router.get('/en', (req, res, next) => {
  res.cookie('i18n', 'en');
  res.redirect('back')
})

module.exports = router;