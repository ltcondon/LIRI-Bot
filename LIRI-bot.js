// ========= Required packages ========= //
var chalk = require("chalk");
var inquirer = require("inquirer");
var axios = require("axios");
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
var fs = require("fs")



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
        console.log(`
                \\   ^__^
                 \\  (oo)\\_______
                    (__)\\       )\\/\\
                        ||----w |
                        ||     ||`,)
}

// ========= OMDB script ========= //
function findMovie() {
    console.log("\nSearching...\n\n")
    var movieName = process.argv.slice(3).join("+");

    // Axios 'OMDB' request
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

    axios.get(queryUrl)
    .then(
        function(response) {
            console.log("\nTitle: " + response.data.Title);
            console.log("Released: " + response.data.Released);
            console.log("IMDB Rating: " + response.data.imdbRating + "\n");
            console.log("Plot: " + response.data.Plot + "\n");
            console.log("Cast: " + response.data.Actors + "\n");
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language + "\n\n\n\n\n\n");
            // console.log(response);
        }
    );

    // This line is just to help us debug against the actual URL.
    // console.log(queryUrl);
}

// ====== BandsInTown script ====== //
function findConcert() {
    console.log("\nSearching...\n\n")
    var artist = process.argv.slice(3).join("+");
    // Axios 'BandsInTown' request
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryUrl)
    .then(
        function(response) {
            // console.log(response.data[0]);
            console.log("\n\nNext show near you:" + "\n\n\n")
            console.log("Venue: " + response.data[0].venue.name + "\n");
            console.log("Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region + "\n");
            var showTime = new Date(response.data[0].datetime);
            console.log("Time: " + showTime + "\n\n\n\n\n\n");
        }
    );

    // This line is just to help us debug against the actual URL.
    // console.log(queryUrl);
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
    console.log("\nSearching...\n\n")

        var searchTerm = response.search;

        switch(response.type) {
            case("Track"):
            spotify
            .search({ type: 'track', query: searchTerm })
            .then(function(response) {
                console.log("\nTrack name: " + response.tracks.items[0].name);
                console.log("\nArtist(s): " + response.tracks.items[0].artists[0].name);
                console.log("\nAlbum: " + response.tracks.items[0].album.name);
                console.log("\nPreview: " + response.tracks.items[0].external_urls.spotify + "\n\n\n\n\n\n");
            })
            .catch(function(err) {
                console.log(err);
            });
            break;

            case("Artist"):
            spotify
            .search({ type: 'artist', query: searchTerm })
            .then(function(response) {
                console.log("\nArtist(s): " + response.artists.items[0].name);
                console.log("\nPreview: " + response.artists.items[0].external_urls.spotify + "\n\n\n\n\n\n");

            })
            .catch(function(err) {
                console.log(err);
            });
            break;
        }
        
    })

}

// ===== 'what-it-says' script ===== //
function whatItSays () {
    console.log("\nYou gotta check this jam, holmes!\n\n")
    
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) {
            console.log(data);
        }
        spotify
            .search({ type: 'track', query: data })
            .then(function(response) {
                console.log("\nTrack name: " + response.tracks.items[0].name);
                console.log("\nArtist(s): " + response.tracks.items[0].artists[0].name);
                console.log("\nAlbum: " + response.tracks.items[0].album.name);
                console.log("\nPreview: " + response.tracks.items[0].external_urls.spotify + "\n\n\n\n\n\n");
            })
            .catch(function(err) {
                console.log(err);
            });
      });
}
