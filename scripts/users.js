
const connection = require('./db')

connection.query("DROP TABLE IF EXISTS users;");

connection.query("CREATE TABLE `users` ( \
  `id` int(11) NOT NULL AUTO_INCREMENT, \
  `email` varchar(255) NOT NULL, \
  `login` varchar(255) DEFAULT NULL, \
  `psswd` varchar(255) NOT NULL, \
  `last_name` varchar(255) DEFAULT NULL, \
  `first_name` varchar(255) NOT NULL, \
  `photos` longtext DEFAULT NULL, \
  PRIMARY KEY (`id`) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table users Created!')
});
