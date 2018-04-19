// const OS = require('opensubtitles-api');
const OpenSubtitles = new OS({
    useragent: 'TemporaryUserAgent',
    // username: 'Username',
    // password: 'Password',
    ssl: true
});

// OpenSubtitles.api.LogIn('rbadia', '!^n^b%tmrfm57P2Io^s5', 'en', 'TemporaryUserAgent')
// .then(res => {
//     console.log(res.token);
//     console.log(res.userinfo);
//     return OpenSubtitles.api.SearchSubtitles(res.token, )
// })
// .then(subtitles => {
//     console.log(subtitles)
// })
// .catch(err => {
//     console.log(err);
// });

OpenSubtitles.search({
    imdbid: 'tt0181689'
})
.then(subtitles => {
    console.log(subtitles)
})
.catch(err => {
    console.log(err);
});