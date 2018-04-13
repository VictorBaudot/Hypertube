
const connection = require('./db')

connection.query(`\
CREATE TABLE IF NOT EXISTS \`users\` ( \
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    login VARCHAR(60) NOT NULL, \
	prenom VARCHAR(255) NOT NULL default 'prenom', \
	nom VARCHAR(255) NOT NULL default 'nom', \
    email VARCHAR(320) NOT NULL, \
	psswd TEXT NULL, \
	photo VARCHAR(320) NOT NULL default 'default.jpg', \
	token TEXT NULL, \
	email_confirmed BINARY(1) NOT NULL default 0, \
        PRIMARY KEY (id) \
)`, (err) => {
	if (err) console.error(err)
	else console.log('Success: table users Created!')
});
