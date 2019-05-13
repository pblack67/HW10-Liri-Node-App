require("dotenv").config();
const keys = require("./keys.js");
const axios = require("axios");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const omdb = require("omdb-client");

console.log(process.argv);

function bandsInTown(bandName) {
    let bandsInTownAPI = `https://rest.bandsintown.com/artists/${bandName}/events?app_id=${keys.bandsInTown.id}`;
    axios.get(bandsInTownAPI)
        .then(response => {
            if (typeof response.data !== "string") {
                console.log(`${bandName} concerts:`);
                response.data.forEach(element => {
                    console.log(`${moment(element.datetime).format("MM/DD/YYYY")}: ${element.venue.name}, ${element.venue.city}, ${element.venue.region}`);
                });
            } else {
                console.log(`${bandName} not found`);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function getArtistString(artistArray) {
    let artistString = "";
    artistArray.forEach(artist => {
        if (artistString !== "") {
            artistString += ", ";
        }
        artistString += artist.name;
    });
    return artistString;
}

function spotifyThisSong(songName) {
    spotify.search({ type: 'track', query: songName }, (err, data) => {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        data.tracks.items.forEach(item => {
            const artistString = getArtistString(item.album.artists);
            console.log(`${artistString}: ${item.album.name} (${item.preview_url})`);
        });
    });
}

function getMovieDetails(movie) {
    const params = {
        apiKey: 'trilogy',
        title: movie.Title,
        year: parseInt(movie.Year)
    }
    omdb.get(params, (err, movieDetails) => {
        if (err) {
            return console.error(err);
        }

        console.log(`${movieDetails.Title} (${movieDetails.Year})`);
        console.log(`Country: ${movieDetails.Country}`);
        console.log(`Language: ${movieDetails.Language}`);
        movieDetails.Ratings.forEach(rating => {
            console.log(`${rating.Source} (${rating.Value})`)
        });
        console.log(`Cast: ${movieDetails.Actors}`);
        console.log(`Plot: ${movieDetails.Plot}`);
        console.log("==================================")

    })
}

function movieThis(movieName) {
    const params = {
        apiKey: "trilogy",
        query: movieName,
        type: "movie"
    }

    omdb.search(params, (err, movies) => {
        if (err) {
            return console.error(err);
        }

        if (movies.Search.length < 1) {
            return console.log('No movies were found!');
        }

        movies.Search.forEach(movie => {
            getMovieDetails(movie);
        });
    });
}

switch (process.argv[2]) {
    case "concert-this":
        let bandName = process.argv[3];
        if (bandName != undefined) {
            bandsInTown(bandName);
        } else {
            console.log("Please enter a band/artist name");
        }
        break;

    case "spotify-this-song":
        let songName = process.argv[3];
        if (songName !== undefined) {
            spotifyThisSong(songName);
        } else {
            spotifyThisSong("The Sign");
        }
        break;

    case "movie-this":
        let movieName = process.argv[3];
        if (movieName !== undefined) {
            movieThis(movieName);
        } else {
            movieThis("Mr. Nobody");
        }
        break;

    case "do-what-it-says":
        console.log("do-what-it-says");
        break;

    default:
        console.log("Please enter one of the following commands: concert-this, spotify-this-song, movie-this, do-what-it-says");
        break;
}

