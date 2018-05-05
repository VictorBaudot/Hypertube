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
  if (result.length == 0)
  {
    console.log("nothing to delete");
    process.exit(0);
  }
  console.log("delete files", result);
  fs.readdir('/tmp/', (err, files) => {
    for (let j in files)
    {
      for (let i in result)
      {
        let reg = new RegExp("^(" + result[i].imdb_id + "){1}");
        let match = files[j].match(reg);
        if (match !== null) {
          fs.unlinkSync('/tmp/' + match.input);
			sql.update('downloads', 'imdb_id', result[i].imdb_id, {
				started: 0,
				progress: 0,
				conversion: 0,
				_____last_view: null
			})
		}
      }
    }
    console.log("all files has been deleted");
    process.exit(0);
  });
});
