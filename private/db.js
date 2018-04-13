const sql	=	require('mysql');

let connect = sql.createPool({
	host: 'localhost',
	user: 'finley',
	password: 'password',
	database: 'hypertube',
	port: 3306
});

// CREATE USER 'finley'@'localhost' IDENTIFIED BY 'password';
// GRANT ALL PRIVILEGES ON *.* TO 'finley'@'localhost' WITH GRANT OPTION;
// CREATE USER 'finley'@'%' IDENTIFIED BY 'password';
// GRANT ALL PRIVILEGES ON *.* TO 'finley'@'%' WITH GRANT OPTION;
// CREATE DATABASE 'hypertube';

connect.query("DROP TABLE IF EXISTS users;");

connect.query("CREATE TABLE `users` ( \
  `id` int(11) NOT NULL AUTO_INCREMENT, \
  `mail` varchar(255) NOT NULL, \
  `login` varchar(255) DEFAULT NULL, \
  `passwd` varchar(255) NOT NULL, \
  `last_name` varchar(255) DEFAULT NULL, \
  `first_name` varchar(255) NOT NULL, \
  `photos` longtext DEFAULT NULL, \
  PRIMARY KEY (`id`) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;");

connect.query("INSERT INTO `users` (`id`, `mail`, `login`, `passwd`, `last_name`, `first_name`, `photos`) VALUES \
(1, 'mjeannin@student.42.fr', 'mjeannin', 'test', 'Jeannin', 'Marine', 'default.png), \
(2, 'dchristo@student.42.fr', 'xeis', 'pwd', 'Christophe', 'Damien', 'default.png), \
(3, 'hmassonn@student.42.fr', 'hmassonn', 'pwd', 'Massonnet', 'Hugo', 'default.png), \
(4, 'jrasoloh@student.42.fr', 'haydn', 'pwd', 'Rasoloharijaona', 'Jossy', 'default.png), \
(5, 'ecunniet@student.42.fr', 'ecunniet', 'pwd', 'Cunniet-Robert', 'Élise', 'default.png), \
(6, 'kperreau@student.42.fr', 'kperreau', 'pwd', 'Perreau', 'Kevin', 'default.png), \
(7, 'ntibi@student.42.fr', 'ntibi', 'pwd', 'Tibi', 'Nicolas', 'default.png), \
(16, 'ocornevi@student.42.fr', 'ocornevi', 'pwd', 'Cornevin', 'cannot', 'default.png), \
(17, 'dorian.jeannin77340@gmail.com ', 'dodo', 'pwd', 'Jeannin', 'jimem', 'default.png), \
(18, 'lguarda@student.42.fr', 'lguarda', 'pwd', 'Guarda', 'lenom', 'default.png);");

connect.end();
