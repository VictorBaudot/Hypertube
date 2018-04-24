const express = require("express");
const i18n = require('i18n');
const app = express();
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const database = require('./Model/SQL.class.js');
const session = require('express-session');
const cookieParser = require('cookie-parser');

require('./private/passport')(passport)

const index = require('./Controllers/index.js');
const lang = require('./Controllers/lang.js');
const api = require('./Controllers/api.js');
const sort = require('./Controllers/sort.js');
const auth = require('./Controllers/auth.js');
const signin = require('./Controllers/signin.js');
const signup = require('./Controllers/signup.js');
const forgot_pwd = require('./Controllers/forgot_pwd.js');
const profile = require('./Controllers/profile.js');
const modify_profile = require('./Controllers/modify_profile.js');
const logout = require('./Controllers/logout.js');
const confirm = require('./Controllers/confirm.js');
const user = require('./Controllers/user.js');
const video = require('./Controllers/video.js');
const comments = require('./Controllers/comments.js');
const dwl = require('./Controllers/dwl.js');

app.set('views', path.join(__dirname, './public/views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(cookieParser('secret'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
i18n.configure({
	locales: ['en', 'fr'],
	directory: __dirname + '/locales',
	defaultLocale: 'en',
	cookie: 'i18n'
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 60000 * 60 * 24 * 30 }
}))
app.use(i18n.init);

app.use(passport.initialize())
app.use(passport.session())
app.use(require('./private/middlewares/flash'))

app.use('/', index);
app.use('/lang', lang)
app.use('/api', api);
app.use('/sort', isLoggedIn, sort);
app.use('/auth', auth(passport))
app.use('/signin', signin(passport));
app.use('/signup', signup(passport));
app.use('/confirm', confirm);
app.use('/forgot_pwd', forgot_pwd);
app.use('/modify_profile', isLoggedIn, modify_profile);
app.use('/profile', isLoggedIn, profile);
app.use('/user', isLoggedIn, user);
app.use('/video', isLoggedIn, video);
app.use('/comments', isLoggedIn, comments);
app.use('/logout', isLoggedIn, logout);
app.use('/dwl', dwl);

http.createServer(app).listen(3001);

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}
