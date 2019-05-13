require("dotenv").config();
const keys = require("./keys.js");
const axios = require("axios");
const moment = require("moment");

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
        console.log("spotify-this-song");
        break;

    case "movie-this":
        console.log("movie-this");
        break;

    case "do-what-it-says":
        console.log("do-what-it-says");
        break;

    default:
        console.log("Please enter one of the following commands: concert-this, spotify-this-song, movie-this, do-what-it-says");
        break;
}

