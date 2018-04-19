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
  `facebookId` BIGINT NULL, \
  `twitterId` BIGINT NULL, \
  `email` varchar(255) DEFAULT NULL, \
  `login` varchar(255) NOT NULL, \
  `psswd` varchar(255) NULL, \
  `last_name` varchar(255) DEFAULT NULL, \
  `first_name` varchar(255) DEFAULT NULL, \
  `photo` longtext NULL, \
  `token` TEXT NULL, \
  `email_confirmed` binary(1) NOT NULL DEFAULT '0', \
  PRIMARY KEY (`id`) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table users created!')
});

connection.query("INSERT INTO `users` (`id`, `email`, `login`, `psswd`, `last_name`, `first_name`, `photo`, `email_confirmed`) VALUES \
(1, 'mjeannin@student.42.fr', 'mjeannin', 'test', 'Jeannin', 'Marine', '/pics/default.jpg', 1), \
(2, 'dchristo@student.42.fr', 'xeis', 'pwd', 'Christophe', 'Damien', '/pics/default.jpg', 1), \
(3, 'hmassonn@student.42.fr', 'hmassonn', 'pwd', 'Massonnet', 'Hugo', '/pics/default.jpg', 1), \
(4, 'jrasoloh@student.42.fr', 'haydn', 'pwd', 'Rasoloharijaona', 'Jossy', '/pics/default.jpg', 1), \
(5, 'ecunniet@student.42.fr', 'ecunniet', 'pwd', 'Cunniet-Robert', 'Élise', '/pics/default.jpg', 1), \
(6, 'kperreau@student.42.fr', 'kperreau', 'pwd', 'Perreau', 'Kevin', '/pics/default.jpg', 1), \
(7, 'ntibi@student.42.fr', 'ntibi', 'pwd', 'Tibi', 'Nicolas', '/pics/default.jpg', 1), \
(8, 'ocornevi@student.42.fr', 'ocornevi', 'pwd', 'Cornevin', 'cannot', '/pics/default.jpg', 1), \
(9, 'dorian.jeannin77340@gmail.com', 'olag', '$2a$09$FXaBNRo92qwxpecqlQicKu9vFigq6n2HO34IIIKAimCjAT8y4bNt.', 'olag', 'olag', '/pics/default.jpg', 1), \
(10, 'ogre181@hotmail.com', 'dodo', 'pwd', 'Jeannin', 'jimem', '/pics/default.jpg', 1), \
(11, 'lguarda@student.42.fr', 'lguarda', 'pwd', 'Guarda', 'lenom', '/pics/default.jpg', 1);");

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
	`writers` varchar(255) NULL, \
	`actors` varchar(255) NULL, \
	`plot` longtext NULL, \
	`country` varchar(255) NULL, \
	`language` varchar(255) NULL, \
	`metascore` int(11) NULL, \
	`poster` varchar(255) NULL, \
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
	`magnet` longtext NULL, \
	PRIMARY KEY (`id`) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table films created!')
});

connection.query("DROP TABLE IF EXISTS videos;");

connection.query("CREATE TABLE `videos` ( \
  `id` int(11) NOT NULL AUTO_INCREMENT, \
  `title` varchar(255) NOT NULL, \
  `image` longtext NOT NULL, \
  `year` int(11) NULL, \
  `score` FLOAT NULL, \
  `duration` int(11) NULL, \
  `summary` varchar(255) NULL, \
  PRIMARY KEY (`id`) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table videos created!')
});

let lorem = 'Et dolorem sequi omnis eius iste soluta sint. Ipsum molestiae id ut velit illum ipsam.'

connection.query("INSERT INTO `videos` (`id`, `title`, `image`, `year`, `score`, `summary`) VALUES \
(1, 'Harry Potter', 'pics/video_default.png', 1938, 4.4, '"+lorem+"'), \
(2, 'Seven Pounds', 'pics/video_default.png', 1965, 1.3, '"+lorem+"'), \
(3, 'The Green Mile', 'pics/video_default.png', 2013, 2.7, '"+lorem+"'), \
(4, 'V for Vendetta', 'pics/video_default.png', 1990, 3.2, '"+lorem+"'), \
(5, 'Three Billboards', 'pics/video_default.png', 1981, 0.8, '"+lorem+"'), \
(6, 'Into the Wild', 'pics/video_default.png', 2003, 5, '"+lorem+"')");

connection.query("DROP TABLE IF EXISTS videos_users;");

connection.query("CREATE TABLE `videos_users` ( \
  `video_id` int(11) NOT NULL, \
  `user_id` int(11) NOT NULL, \
  `seen` enum('Y', 'N') NOT NULL DEFAULT 'N', \
  `score` float NULL, \
  PRIMARY KEY (`video_id`, `user_id`) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table videos_users created!')
});

connection.query("INSERT INTO `videos_users` (`video_id`, `user_id`) VALUES \
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), \
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), \
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8), (3, 9), (3, 10), \
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7), (4, 8), (4, 9), (4, 10), \
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7), (5, 8), (5, 9), (5, 10), \
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6), (6, 7), (6, 8), (6, 9), (6, 10)");

connection.query("DROP TABLE IF EXISTS directors;");

connection.query("CREATE TABLE `directors` ( \
  `director` VARCHAR(255) NOT NULL PRIMARY KEY \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table directors created!')
});

connection.query("INSERT INTO `directors` (`director`) VALUES \
('Chris Columbus'), \
('Gabrielle Muccino'), \
('Frank Darabont'), \
('James McTeigue'), \
('Martin McDonagh'), \
('Sean Penn')");

connection.query("DROP TABLE IF EXISTS videos_directors;");

connection.query("CREATE TABLE `videos_directors` ( \
  `video_id` int(11) NOT NULL, \
  `director` VARCHAR(255) NOT NULL,\
  PRIMARY KEY (`video_id`, `director`) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table videos_directors created!')
});

connection.query("INSERT INTO `videos_directors` (`video_id`, `director`) VALUES \
(1, 'Chris Columbus'), \
(2, 'Gabrielle Muccino'), \
(3, 'Frank Darabont'), \
(4, 'James McTeigue'), \
(5, 'Martin McDonagh'), \
(6, 'Sean Penn')");

connection.query("DROP TABLE IF EXISTS actors;");

connection.query("CREATE TABLE `actors` ( \
  `actor` VARCHAR(255) NOT NULL PRIMARY KEY \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table actors created!')
});

connection.query("INSERT INTO `actors` (`actor`) VALUES \
('Daniel Radcliffe'), ('Ruppert Grint'), ('Emma Watson'),\
('Will Smith'), \
('Tom Hanks'), ('Michael Clarke Duncan'), ('David Morse'), \
('Hugo Weaving'), ('Natalie Portman'), ('Rupert Graves'), \
('Frances McDormand'), ('Woody Harrelson'), ('Sam Rockwell'), \
('Vince Vaughn')");

connection.query("DROP TABLE IF EXISTS videos_actors;");

connection.query("CREATE TABLE `videos_actors` ( \
  `video_id` int(11) NOT NULL, \
  `actor` VARCHAR(255) NOT NULL,\
  PRIMARY KEY (`video_id`, `actor`) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table videos_actors created!')
});

connection.query("INSERT INTO `videos_actors` (`video_id`, `actor`) VALUES \
(1, 'Daniel Radcliffe'), (1, 'Ruppert Grint'), (1, 'Emma Watson'),\
(2, 'Will Smith'), \
(3, 'Tom Hanks'), (3, 'Michael Clarke Duncan'), (3, 'David Morse'), \
(4, 'Hugo Weaving'), (4, 'Natalie Portman'), (4, 'Rupert Graves'), \
(5, 'Frances McDormand'), (5, 'Woody Harrelson'), (5, 'Sam Rockwell'), \
(6, 'Vince Vaughn')");

connection.query("DROP TABLE IF EXISTS genres;");

connection.query("CREATE TABLE `genres` ( \
  genre VARCHAR(50) NOT NULL PRIMARY KEY \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table genres created!')
});

connection.query("INSERT INTO `genres` (`genre`) VALUES \
('Adventure'), ('Family'), ('Fantasy'), \
('Drama'), ('Romance'), \
('Crime'), \
('Sci-Fi'), \
('Biography')");

connection.query("DROP TABLE IF EXISTS videos_genres;");

connection.query("CREATE TABLE `videos_genres` ( \
  video_id int(11) NOT NULL, \
  genre VARCHAR(50) NOT NULL, \
      PRIMARY KEY (video_id, genre) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;", (err) => {
	if (err) console.error(err)
	else console.log('Success: table videos_genres created!')
});

connection.query("INSERT INTO `videos_genres` (`video_id`, `genre`) VALUES \
(1, 'Adventure'), (1, 'Family'), (1, 'Fantasy'), \
(2, 'Drama'), (2, 'Romance'), \
(3, 'Crime'), (3, 'Drama'), (3, 'Fantasy'), \
(4, 'Action'), (4, 'Drama'), (4, 'Sci-Fi'), \
(5, 'Crime'), (5, 'Drama'), \
(6, 'Adventure'), (6, 'Biography'), (6, 'Drama')");

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

connection.query("CREATE TABLE `downloads` ( \
	`imdb_id` varchar(255) NOT NULL, \
	`started` int(11) NOT NULL, \
	`progress` int(11) NOT NULL \
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;", err => {
	  if (err) console.error(err)
	  else console.log('Success: table downloads created!')
  })

let time = new Date();

connection.query("INSERT INTO `coms` (`video_id`, `user_id`, `com`, `creation`) VALUES \
(3, 1, '"+lorem+"', "+connection.escape(time)+"), \
(3, 2, '"+lorem+"', "+connection.escape(time)+"), \
(3, 3, '"+lorem+"', "+connection.escape(time)+"), \
(3, 4, '"+lorem+"', "+connection.escape(time)+"), \
(3, 5, '"+lorem+"', "+connection.escape(time)+"), \
(3, 6, '"+lorem+"', "+connection.escape(time)+")");

connection.end();
