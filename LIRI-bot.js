// ========= Required packages ========= //
var chalk = require("chalk");
var inquirer = require("inquirer");
var axios = require("axios");
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");



// Initial input validation:
var searchType = process.argv[2]

switch (searchType) {
  case "concert-this":
        findConcert();
    break;
  case "spotify-this":
        findMusic();
    break;
  case "movie-this":
        findMovie();
    break;
  case "do-what-it-says":
        whatItSays();
    break;
  default:
        console.log("Sorry, I don't understand that command :'(");
}

// ========= OMDB script ========= //
function findMovie() {

    var movieName = process.argv.slice(3).join("+");

    // Axios 'OMDB' request
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

    axios.get(queryUrl)
    .then(
        function(response) {
            console.log("Title: " + response.data.Title + "\n");
            console.log("Year: " + response.data.Year + "\n");
            console.log("Released: " + response.data.Released + "\n");
            console.log("IMDB Rating: " + response.data.imdbRating + "\n");
            console.log("Plot: " + response.data.Plot + "\n");
            console.log("Cast: " + response.data.Actors + "\n");
            console.log("Country: " + response.data.Country + "\n");
            console.log("Language: " + response.data.Language + "\n");
            // console.log(response);
        }
    );

    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);
}

// ====== BandsInTown script ====== //
function findConcert() {
    var artist = process.argv.slice(3).join("+");
    // Axios 'BandsInTown' request
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryUrl)
    .then(
        function(response) {
            // console.log(response.data[0]);
            console.log("Venue: " + response.data[0].venue.name + "\n");
            console.log("Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region + "\n");
            var showTime = new Date(response.data[0].datetime);
            console.log("Time: " + showTime + "\n");
        }
    );

    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);
}

// ======== Spotify script ======== //
function findMusic() {
    inquirer.prompt([
        {
        type: "list",
        message: "Are you looking for an artist or a track?",
        choices: ["Artist", "Track"],
        name: "type"
        },
        {
        message: "Okay then. What can I help you find?",
        name: "search"
        }
    ]).then(function(response) {
        var searchTerm = response.search;

        switch(response.type) {
            case("Track"):
            spotify
            .search({ type: 'track', query: searchTerm })
            .then(function(response) {
                console.log("\nTrack name: " + response.tracks.items[0].name);
                console.log("\nArtist(s): " + response.tracks.items[0].artists[0].name);
                console.log("\nAlbum: " + response.tracks.items[0].album.name);
                console.log("\nPreview: " + response.tracks.items[0].external_urls.spotify);


            })
            .catch(function(err) {
                console.log(err);
            });
            break;

            case("Artist"):
            spotify
            .search({ type: 'artist', query: searchTerm })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(err) {
                console.log(err);
            });
            break;
        }
        
    })

}


