require("dotenv").config();
const keys = require("./keys.js");

console.log(process.argv);

switch(process.argv[2]) {
    case "concert-this":
        console.log("concert-this");
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

