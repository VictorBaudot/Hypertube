const SQL = require('../Model/SQL.class.js');
const fs = require('fs');

let padding = (int) => {
  return ((int < 10) ? '0' + int : int);
};
let sql = new SQL();
let date = new Date();
let end = date.getFullYear() + '-' + padding(date.getMonth() - 1) + '-' + padding(date.getUTCDate());
date.setDate(1);
date.setMonth(date.getMonth() - 1);
let start = date.getFullYear() + '-' + padding(date.getMonth()) + '-' + padding(date.getUTCDate());
let between = "_____last_view BETWEEN '" + start + "' AND '" + end + "'";

sql.select('imdb_id', 'downloads', null, null, null, null, between).then(result => {
  if (!(result) && !(result.length))
    return (true);
  for (let i in result) {
    fs.unlink('/groinfre/' + result[i].imdb_id + '.*', (err) => {
      if (err) throw err;
      console.log("movie number " +result[i].imdb_id + " has been deleted");
      sql.update('downloads', 'imdb_id', result[i].imdb_id, {
        started: 0,
        progress: 0,
        conversion: 0,
        _____last_view: null
      })
    });
  }
});
