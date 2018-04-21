const pwdRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,20})");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nomRegex = new RegExp("^[a-zA-Z]{3,16}$");
const loginRegex = new RegExp("^[a-zA-Z0-9_]{3,16}$");
const comRegex = new RegExp("^[a-zA-Z0-9\p{L}_,#\ +-]{2,100}$");
const htmlspecialchars = require("htmlspecialchars");
const SQL = require('./SQL.class');

var Check = {

    // - Pas deja pris
    // - Taille raisonnable
    // - Format correct
    login: login = (login, req, cb) => {
        let rep = true
        if (!loginRegex.test(login)) {
            req.flashAdd('tabError', 'Pseudo: format incorrect')
            rep = false
        }
        let sql = new SQL()
        sql.select('*', 'users', {}, {login: htmlspecialchars(login)}).then(result => {
			if (Object.keys(result).length > 0)
			{
				req.flashAdd('tabError', 'Ce pseudo n\'est pas disponible')
                rep = false
            }
            cb(rep)
		});
    },

    // - Pas d'espace
    // - Uniquement des lettres
    // - Taille correcte
    first_name: first_name = (nom, req, cb) => {
        let rep = true
        if (!nomRegex.test(nom)) {
            req.flashAdd('tabError', 'Prenom: format incorrect')
            rep = false
        }
        cb(rep)
    },
    last_name: last_name = (nom, req, cb) => {
        let rep = true
        if (!nomRegex.test(nom)) {
            req.flashAdd('tabError', 'Nom: format incorrect')
            rep = false
        }
        cb(rep)
    },

    // - Pas deja pris
    // - Format correct
    email: email = (email, req, cb) => {
        let rep = true
        let sql = new SQL()
        sql.select('*', 'users', {}, {email: htmlspecialchars(email)}).then(result => {
			if (Object.keys(result).length > 0) {
                req.flashAdd('tabError', 'Cet email n\'est pas disponible')
                rep = false
            } else if (!emailRegex.test(email)) {
                req.flashAdd('tabError', 'Syntaxe de l\'email invalide');
                rep = false
            }
            cb(rep)
		});
    },

    // - Password === confirmation
    // - Format correct
    psswd: psswd = (password, confirm, req, cb) => {
        let rep = true
        if (!confirm || password !== confirm) {
            req.flashAdd('tabError', 'Les mots de passe ne correspondent pas.');
            rep = false
        }
        if (!pwdRegex.test(password)) {
            req.flashAdd('tabError', 'Mot de passe en carton. ([a-z]+[A-Z]+[0-9])*(6-20)');
            rep = false
        }
        cb(rep)
    },

    // - Taille correcte
    com: com = (com, req, cb) => {
        let rep = true
        if (!comRegex.test(com)) {
            req.flashAdd('tabError', 'Commentaire: format incorrect')
            rep = false
        }
        cb(rep)
    },

}

module.exports = Check
