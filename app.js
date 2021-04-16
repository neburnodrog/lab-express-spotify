require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:


app.get('/', (req, res, next) => {
    res.render('index');
})


app.get('/artist-search/', (req, res, next) => {

    const artist = req.query.artist

    spotifyApi
        .searchArtists(artist, { limit: 6 })
        .then(data => {

            res.render('artists-results', {
                artists: data.body.artists.items,
                data: data,
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/albums/:artistId', (req, res, next) => {

    spotifyApi
        .getArtistAlbums(req.params.artistId, { limit: 6 })
        .then(data => {

            res.render('albums', { albums: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/tracks/:albumId', (req, res, next) => {

    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            console.log('Trying to render this:', data.body)
            res.render('tracks', { tracks: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.listen(3333, () => console.log('My Spotify project running 🎧 🥁 🎸 🔊'));
