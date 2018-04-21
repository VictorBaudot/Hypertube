const connection = require('./db')

// CREATE USER 'finley'@'localhost' IDENTIFIED BY 'password';
// GRANT ALL PRIVILEGES ON *.* TO 'finley'@'localhost' WITH GRANT OPTION;
// CREATE USER 'finley'@'%' IDENTIFIED BY 'password';
// GRANT ALL PRIVILEGES ON *.* TO 'finley'@'%' WITH GRANT OPTION;
// CREATE DATABASE 'hypertube';

connection.query("DROP TABLE IF EXISTS users;");

connection.query("CREATE TABLE `users` ( \
	`id` int(11) NOT NULL AUTO_INCREMENT, \
	`fortytwoId` int(11) NULL, \
	`facebookId` varchar(255) NULL, \
	`githubId` varchar(255) NULL, \
	`linkedinId` varchar(255) NULL, \
	`twitterId` varchar(255) NULL, \
	`email` varchar(255) DEFAULT NULL, \
	`login` varchar(255) NOT NULL, \
	`psswd` varchar(255) NULL, \
	`last_name` varchar(255) DEFAULT NULL, \
	`first_name` varchar(255) DEFAULT NULL, \
	`photo` longtext NOT NULL, \
	`token` TEXT NULL, \
	`email_confirmed` binary(1) NOT NULL DEFAULT '0', \
	`lang` varchar(255) DEFAULT 'en', \
	`view_history` longtext DEFAULT NULL, \
 	PRIMARY KEY (`id`) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table users created!')
});

connection.query("DROP TABLE IF EXISTS films;");

connection.query("CREATE TABLE `films` ( \
	`id` int(11) NOT NULL AUTO_INCREMENT, \
	`imdb_id` varchar(255) NOT NULL, \
	`parent_id` varchar(255) NULL, \
	`title` varchar(255) NOT NULL, \
	`year` int(11) NULL, \
	`rated` varchar(255) NULL, \
	`released` varchar(255) NULL, \
	`runtime` varchar(255) NULL, \
	`genre` varchar(255) NULL, \
	`director` varchar(255) NULL, \
	`writers` LONGTEXT NULL, \
	`actors` LONGTEXT NULL, \
	`plot` longtext NULL, \
	`country` varchar(255) NULL, \
	`language` varchar(255) NULL, \
	`metascore` int(11) NULL, \
	`poster` LONGTEXT NULL, \
	`rating` varchar(255) NULL, \
	`votes` varchar(255) NULL,  \
	`budget` varchar(255) NULL,  \
	`opening_weekend` varchar(255) NULL,  \
	`gross` varchar(255) NULL,  \
	`production` varchar(255) NULL,  \
	`type` varchar(255) NULL,  \
	`session` varchar(255) NULL,  \
	`episode` varchar(255) NULL,  \
	`status` varchar(255) NULL,	\
	`magnet` LONGTEXT NULL, \
	PRIMARY KEY (`id`) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table films created!')
});

connection.query("DROP TABLE IF EXISTS coms;");

connection.query("CREATE TABLE `coms` ( \
  `id` int(11) NOT NULL AUTO_INCREMENT, \
  `video_id` int(11) NOT NULL, \
  `user_id` int(11) NOT NULL, \
  `com` varchar(255) NOT NULL, \
  `creation` DATETIME NULL, \
  PRIMARY KEY (`id`) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table coms created!')
});

connection.query("DROP TABLE IF EXISTS downloads;");

connection.query("CREATE TABLE `downloads` ( \
	`imdb_id` varchar(255) NOT NULL, \
	`started` int(11) NOT NULL, \
	`progress` int(11) NOT NULL, \
	`subtitles` int (11) NOT NULL, \
	`conversion` int (11) NOT NULL, \
	`_____last_view` date DEFAULT NULL, \
	PRIMARY KEY (`imdb_id`)	\
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;", err => {
	  if (err) console.error(err)
	  else console.log('Success: table downloads created!')
  })


let lorem = 'Et dolorem sequi omnis eius iste soluta sint. Ipsum molestiae id ut velit illum ipsam.'
let time = new Date();

connection.query("INSERT INTO `users` (`id`, `email`, `login`, `psswd`, `last_name`, `first_name`, `photo`, `email_confirmed`, lang) VALUES \
(1, 'mjeannin@student.42.fr', 'mjeannin', 'test', 'Jeannin', 'Marine', '/pics/default.jpg', 1, 'en'), \
(2, 'dchristo@student.42.fr', 'xeis', 'pwd', 'Christophe', 'Damien', '/pics/default.jpg', 1, 'en'), \
(3, 'hmassonn@student.42.fr', 'hmassonn', 'pwd', 'Massonnet', 'Hugo', '/pics/default.jpg', 1, 'en'), \
(4, 'jrasoloh@student.42.fr', 'haydn', 'pwd', 'Rasoloharijaona', 'Jossy', '/pics/default.jpg', 1, 'en'), \
(5, 'ecunniet@student.42.fr', 'ecunniet', 'pwd', 'Cunniet-Robert', 'Élise', '/pics/default.jpg', 1, 'en'), \
(6, 'kperreau@student.42.fr', 'kperreau', 'pwd', 'Perreau', 'Kevin', '/pics/default.jpg', 1, 'en'), \
(7, 'ntibi@student.42.fr', 'ntibi', 'pwd', 'Tibi', 'Nicolas', '/pics/default.jpg', 1, 'en'), \
(8, 'ocornevi@student.42.fr', 'ocornevi', 'pwd', 'Cornevin', 'cannot', '/pics/default.jpg', 1, 'en'), \
(9, 'dorian.jeannin77340@gmail.com', 'olag', '$2a$09$FXaBNRo92qwxpecqlQicKu9vFigq6n2HO34IIIKAimCjAT8y4bNt.', 'olag', 'olag', '/pics/default.jpg', 1, 'fr'), \
(10, 'ogre181@hotmail.com', 'dodo', 'pwd', 'Jeannin', 'jimem', '/pics/default.jpg', 1, 'en'), \
(11, 'lguarda@student.42.fr', 'lguarda', 'pwd', 'Guarda', 'lenom', '/pics/default.jpg', 1, 'en');");

connection.query("INSERT INTO `coms` (`video_id`, `user_id`, `com`, `creation`) VALUES \
(3, 1, '"+lorem+"', "+connection.escape(time)+"), \
(3, 2, '"+lorem+"', "+connection.escape(time)+"), \
(3, 3, '"+lorem+"', "+connection.escape(time)+"), \
(3, 4, '"+lorem+"', "+connection.escape(time)+"), \
(3, 5, '"+lorem+"', "+connection.escape(time)+"), \
(3, 6, '"+lorem+"', "+connection.escape(time)+")");

connection.end();
