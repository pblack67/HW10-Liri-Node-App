require("dotenv").config();
const keys = require("./keys.js");
const axios = require("axios");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const omdb = require("omdb-client");
const fs = require("fs");

const separator = "==================================";

function log(data) {
    console.log(data);
    fs.appendFile("./log.txt", data + "\n", (err) => {
        if (err) {
            console.log("File write error!");
        }
    });
}

function bandsInTown(bandName) {
    let bandsInTownAPI = `https://rest.bandsintown.com/artists/${bandName}/events?app_id=${keys.bandsInTown.id}`;
    axios.get(bandsInTownAPI)
        .then(response => {
            if (typeof response.data !== "string") {
                log(`${bandName} concerts:`);
                response.data.forEach(element => {
                    log(`${moment(element.datetime).format("MM/DD/YYYY")}: ${element.venue.name}, ${element.venue.city}, ${element.venue.region}`);
                });
            } else {
                log(`${bandName} not found`);
            }
        })
        .catch(error => {
            log(error);
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
            return log('Error occurred: ' + err);
        }

        data.tracks.items.forEach(item => {
            const artistString = getArtistString(item.album.artists);
            log(`${artistString}: ${item.album.name} (${item.preview_url})`);
        });
    });
}

function getMovieDetails(movie) {
    const params = {
        apiKey: keys.omdb.id,
        title: movie.Title,
        year: parseInt(movie.Year)
    }
    omdb.get(params, (err, movieDetails) => {
        if (err) {
            return console.error(err);
        }

        log(`${movieDetails.Title} (${movieDetails.Year})`);
        log(`Country: ${movieDetails.Country}`);
        log(`Language: ${movieDetails.Language}`);
        movieDetails.Ratings.forEach(rating => {
            log(`${rating.Source} (${rating.Value})`)
        });
        log(`Cast: ${movieDetails.Actors}`);
        log(`Plot: ${movieDetails.Plot}`);
        log(separator);
    })
}

function movieThis(movieName) {
    const params = {
        apiKey: keys.omdb.id,
        query: movieName,
        type: "movie"
    }

    omdb.search(params, (err, movies) => {
        if (err) {
            return console.error(err);
        }

        if (movies.Search.length < 1) {
            return log('No movies were found!');
        }

        movies.Search.forEach(movie => {
            getMovieDetails(movie);
        });
    });
}

function executeCommand(command, argument) {
    log(separator);
    log(`Command: ${command} ${argument}`);
    log(separator);

    switch (command) {
        case "concert-this":
            if (argument != undefined) {
                bandsInTown(argument);
            } else {
                log("Please enter a band/artist name");
            }
            break;

        case "spotify-this-song":
            if (argument !== undefined) {
                spotifyThisSong(argument);
            } else {
                spotifyThisSong("The Sign");
            }
            break;

        case "movie-this":
            if (argument !== undefined) {
                movieThis(argument);
            } else {
                movieThis("Mr. Nobody");
            }
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;

        default:
            log("Please enter one of the following commands: concert-this, spotify-this-song, movie-this, do-what-it-says");
            break;
    }
}

function doWhatItSays() {
    fs.readFile('./random.txt', 'utf8', (err, data) => {
        if (err) {
            return log("File Read Error!");
        }

        let command = data.split(",");
        executeCommand(command[0].trim(), command[1].trim());
    });
}

executeCommand(process.argv[2].trim(), process.argv[3].trim());
