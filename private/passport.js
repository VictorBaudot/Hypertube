const LocalStrategy = require('passport-local').Strategy
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt-nodejs');
const connection = require('./../scripts/db')

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null,user.id)
    })

    passport.deserializeUser((id, done) => {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], (err, rows) => {
            done(err, rows[0]);
        });
    })

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, login, password, done) => {
        console.log('Check')
        let end = () => {
            return done(null, null, req.flashAdd('tabSuccess', 'Bravo, finalisez votre compte en cliquant sur le lien que vous venez de recevoir par email!'));
        }
        connection.query("SELECT * FROM users WHERE login = ? OR email = ?",[login, req.body.email], (err, rows) => {
            if (err) return done(err);
            if (!isSignUpValid(req, login, password, rows)) return done(null, false);
            else {
                var newUser = {
                    login: login,
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(9)),
                    first_name: capitalizeFirstLetter(req.body.first_name),
                    last_name: capitalizeFirstLetter(req.body.last_name),
                    photo: '/pics/default.jpg',
                    email: req.body.email,
                    token: bcrypt.hashSync('hypertube'+login, bcrypt.genSaltSync(9)).replace(/\//g, '')
                };
                console.log(newUser)
                var insertQuery = "INSERT INTO users ( login, first_name, last_name, photo, email, psswd, token ) values (?, ?, ?, ?, ?, ?, ?)";

                connection.query(insertQuery,[newUser.login, newUser.first_name, newUser.last_name, newUser.photo, newUser.email, newUser.password, newUser.token], (err) => {
                    if (err) throw err
                    else {
                        let link = 'http://localhost:3001/confirm/'+newUser.login+'/'+newUser.token
                        let msgtext = "Valider votre compte en vous rendant a cette adresse : "+link
                        let msghtml = "<p>Valider votre compte en "+"<a href="+link+">cliquant ici</a></p>"
                        go("Hypertube", msgtext, msghtml, newUser.email)
                    }
                });
            }
        });

        let go = (subj, msgtext, msghtml, towho) => {
            nodemailer.createTestAccount((err, account) => {
            if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
            }
        
            console.log('Credentials obtained, sending message...');
        
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                port: 1025,
                ignoreTLS : true
            });
        
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Hypertube admins 👻" <admins@hypertube.com>', // sender address
                to: towho, // list of receivers
                subject: subj, // Subject line
                text: msgtext, // plain text body
                html: msghtml // html body
            };
        
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                end()
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        });
        }
    }))

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local-signin',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'login',
            passwordField: 'password',
            passReqToCallback: true, // allows us to pass back the entire request to the callback
        }, (req, login, password, done) => {
            connection.query('SELECT * FROM users WHERE login = ?', [login], (err, rows) => {
                if (err) return done(err);
                // console.log(rows)
                if (!rows.length) {
                    return done(null, false, req.flashAdd('tabError', 'Cet utilisateur n\'existe pas.'));
                }
                if (rows[0].email_confirmed == 0)  return done(null, false, req.flashAdd('tabError', 'L\'email de ce compte n\'a pas encore ete confirme'));
                
                if (!bcrypt.compareSync(password, rows[0].psswd)) return done(null, false, req.flashAdd('tabError', 'Oops! Mauvais mot de passe.'));

                return done(null, rows[0]);
            });
            
        })
    );
}

function isSignUpValid (req, login, password, rows) {
    const pwdRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,20})");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const last_nameRegex = new RegExp("^[a-zA-Z_]{3,16}$");
    const loginRegex = new RegExp("^[a-zA-Z0-9_]{3,16}$");
    let result = true;
    console.log(rows)
    if (rows.length) {
        req.flashAdd('tabError', 'Ce pseudo/email est deja pris')
        result = false
    }
    if (!loginRegex.test(login)) {
        req.flashAdd('tabError', 'Pseudo: format incorrect')
        result = false
    }
    if (!last_nameRegex.test(req.body.first_name)) {
        req.flashAdd('tabError', 'first_name: format incorrect')
        result = false
    }
    if (!last_nameRegex.test(req.body.last_name)) {
        req.flashAdd('tabError', 'last_name: format incorrect')
        result = false
    }
    if (password !== req.body.psswd_confirm) {
        req.flashAdd('tabError', 'Les mots de passe ne correspondent pas.');
        result = false
    }
    if (!pwdRegex.test(password)) {
        req.flashAdd('tabError', 'Mot de passe en carton. ([a-z]+[A-Z]+[0-9])*(6-20)');
        result = false
    }
    if (!emailRegex.test(req.body.email)) {
        req.flashAdd('tabError', 'Syntaxe de l\'email invalide');
        result = false
    }
    if (!isLengthOkay('Pseudo', login, req) || !isLengthOkay('first_name', req.body.first_name, req) || !isLengthOkay('last_name', req.body.last_name, req))
        result = false
    return result
}

function isLengthOkay(champs, value, req) {
    let result = true
    console.log(champs+" : "+value.length)
    if (value.length < 3) {
        req.flashAdd('tabError', champs+': trop court');
        result = false
    }
    else if (value.length > 16) {
        req.flashAdd('tabError', champs+': trop long');
        result = false
    }
    return result
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}