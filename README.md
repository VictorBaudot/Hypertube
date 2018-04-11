Installation : 

Project : 

`git clone https://github.com/olag18/Hypertube`

Dependencies : 

`npm install`

Database :

```
create database hypertube;
use hypertube;
create table user (id int(11) primary key auto_increment, login varchar(255), psswd varchar(255), email varchar(255));
```

Rappel :

Vous pouvez ajouter une colonne a une table via la commande : 

`alter table <table name> add column <column_name> <type>;`

Class :

Database : (Model/SQL.class.js);

- (var) sql :

	Created by the constructor, stock the database connexion for later use

- (func) constructor : *no params needed* | *no returns*

	Pour le moment n'admet aucunes variables, peut etre mettre host / root / password / database / port sur des variables ?

- (func) select : ((String) quantity, (String) table, (JSON) condition) | return {Promise} => {JSON}

	Renvoie en premier lieu une Promise, si la Promise est resolu, renvoie un JSON de la selection demander
	Format pour les conditions : 
	```
		{
			column_name: [first_value, second_value, third_value, ...],
			column_name: [first_value, second_value, third_value, ...]
		}
	```

	Example : (`login`, `user`, *cf plus bas* )

	```
		{
			login: ['cbeauvoi', 'hmasson'],
			psswd: ['squeezie', 'requin']
		}
	```
	Va generer une requete sous cette forme : 

	`SELECT login FROM user WHERE (login='cbeauvoi' OR login='hmasson') AND (psswd='squeezie' OR psswd='requin')`

- (func) insert : ((String) table, (JSON) values) | return {Promise}
	
	Insert dans n'importe quel table n'importe quel valeurs sous la forme suivante : 

	```
	{
		column_name: value,
		column_name: value
		.
		.
		.
	}
	```

TODO : 

- [x] Creer une classe pour les requetes sql
- [x] Selectionner n'importe quel table en fonction de parametres
- [x] Ajout de conditions and les requetes de select
- [ ] Ajout du `INNER JOIN` dans les requetes de select
- [x] Ajout de la requete `insert` avec les memes pre-requis que select

Changelog :

- 11-04-2018 :

-> Module d'inscription termine
-> Creation de la fonction `insert` dans la class `SQL`
-> Bug trouver sur la redirection des session dans l'espace de connexion

- 09-04-2018 :

-> Creation des depandeces obligatoire
-> Creation de l'architecture NodeJS & moteur de template (ejs)
-> Creation de la class SQL.class.js avec le constructor & la methode select
-> Creation des views index.ejs & connexion.ejs
-> Sur la view connexion.ejs creation du formulaire de connexion + possibilite de ce connecter si l'utilisateur est present dans la db

=> todo pour finir l'espace utilisateur
- [x] Possibilite de s'enregistrer (route prevue /inscription)
- [x] Modifier `index.js` pour mettre les methodes de connexion dans `connexion.js`
- [ ] Possibilite de check les profils d'autres utilisateur (route prevue /user/{id_user}/info)
- [ ] Strategie de connexion Omniauth