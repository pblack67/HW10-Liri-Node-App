require("dotenv").config();
const keys = require("./keys.js");
const axios = require("axios");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const omdb = require("omdb-client");
const fs = require("fs");

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

function executeCommand(command, argument) {
    switch (command) {
        case "concert-this":
            if (argument != undefined) {
                bandsInTown(argument);
            } else {
                console.log("Please enter a band/artist name");
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
            console.log("Please enter one of the following commands: concert-this, spotify-this-song, movie-this, do-what-it-says");
            break;
    }
}

function doWhatItSays() {
    fs.readFile('./random.txt', 'utf8', (err, data) => {
        if (err) {
            return console.log("File Read Error!");
        }

        console.log(data);
        let command = data.split(",");
        console.log(command);
        executeCommand(command[0].trim(), command[1].trim());
    });
}

executeCommand(process.argv[2].trim(), process.argv[3].trim());
