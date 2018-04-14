
const connection = require('./db')

connection.query("DROP TABLE IF EXISTS users;");

connection.query("CREATE TABLE `users` ( \
  `id` int(11) NOT NULL AUTO_INCREMENT, \
  `fortytwoId` int(11) NULL, \
  `facebookId` BIGINT NULL, \
  `twitterId` BIGINT NULL, \
  `email` varchar(255) DEFAULT NULL, \
  `login` varchar(255) NOT NULL, \
  `psswd` varchar(255) NULL, \
  `last_name` varchar(255) DEFAULT NULL, \
  `first_name` varchar(255) DEFAULT NULL, \
  `photo` longtext NOT NULL, \
  `token` TEXT NULL, \
  `email_confirmed` binary(1) NOT NULL DEFAULT '0',\
  PRIMARY KEY (`id`) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table users Created!')
});
