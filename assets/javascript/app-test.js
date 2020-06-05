// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDIAOPYeVbv9YgJsKQ9JDSHImO3CGcYzJ8",
    authDomain: "youjuke-63253.firebaseapp.com",
    databaseURL: "https://youjuke-63253.firebaseio.com",
    projectId: "youjuke-63253",
    storageBucket: "youjuke-63253.appspot.com",
    messagingSenderId: "859147308716",
    appId: "1:859147308716:web:d21f0411fe121a2c1d9909",
    measurementId: "G-FMLC6K90WT"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();

var livePlaylist = {};
var previouslyPlayed = {};
var totalSongPlaylist = [];
var likedSongs = [];

// set all chart font to white
Chart.defaults.global.defaultFontColor = 'white';
//radar chart variable
var ctx = $('#myChart');
// radar chart content
var myRadarChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['Punk', 'Rap', 'Rock', 'Indie', 'Metal', 'Electronic', 'Pop', 'Country', 'R&B', 'Other'],
        datasets: [{
            data: [20, 30, 60, 75, 10, 50, 60, 30, 30],
            borderColor: 'red',
            backgroundColor: 'rgba(255, 10, 13, 0.1)',
            label: 'Current Users'
        }],
    },
    options: {
        scale: {
            angleLines: {
                display: false
            },
            ticks: {
                suggestedMin: 50,
                suggestedMax: 100
            },
            gridLines: {
                color: '#ffffff'
            }
        },
        legend: {
            labels: {
                fontColor: 'white'
            }
        },
        maintainAspectRatio: false,//ensures no overflow but properly scales to parent div dimensions
        responsive: true
    }
});

// stores search results
var searchResultArr = {};
//holds deezerID for current song
var currentSong = "";

// function that pulls info from firebase and updates playlist order
function renderQueue() {
    //grabs info from firebase
    database.ref().once("value", function (snapshot) {
        livePlaylist = snapshot.val().playlist;
        // empty current song container
        $(".queued-track-container").empty();
        // run sortPlaylist to make sure any upvoted songs get moved up the list
        sortPlaylist();
        // loads playlist on screen
        for (var i = 0; i < playlistArr.length; i++) {
            // checks if there is a current song
            if (currentSong == "") {
                //creates playlist format for each song
                currentSong = playlistArr[i][1].deezerID;
                $("#song").attr("src", playlistArr[i][1].preview);
                var queuedTrack = $("<div>").addClass("current-song-container").attr("data-id", playlistArr[i][1].deezerID);
                var nameContainer = $("<div>").addClass("name-container current-song");
                var artistName = playlistArr[i][1].artistName;
                var songName = playlistArr[i][1].songName;
                var songNameP = $("<p>").text(songName).addClass("song-name");
                var artistNameP = $("<p>").text(artistName).addClass("artist-name");
                var thumbsDiv = $("<div>").addClass("thumbs-container");

                thumbsDiv.addClass("btn-group");
                thumbsDiv.attr("role", "group");

                var upButton = $("<a>");
                // create upvote button
                upButton.attr("data-deezer", playlistArr[i][1].deezerID);
                upButton.addClass("btn btn-flat waves-effect waves-green upvote");
                upButton.html("<i class='material-icons'>thumb_up</i>");
                // create downvote button
                var downButton = $("<a>");
                downButton.attr("data-deezer", playlistArr[i][1].deezerID);
                downButton.addClass("btn btn-flat waves-effect waves-red downvote");
                downButton.html("<i class='material-icons'>thumb_down</i>");
                // add upvote to song container
                thumbsDiv.append(upButton);
                thumbsDiv.append(downButton);


                //album artwork information
                var thumbnail = playlistArr[i][1].thumbnail;
                var thumbnailImg = $("<img>").addClass("album-pic current-album");
                thumbnailImg.attr("src", thumbnail);

                nameContainer.append(songNameP, artistNameP);
                queuedTrack.append(thumbnailImg);
                queuedTrack.append(nameContainer);
                queuedTrack.append(thumbsDiv);
                // append current song to page
                $("#current-track-box").empty();
                $("#current-track-box").append(queuedTrack);
            }
            // checks if song ID matches current song ID
            else if (currentSong !== playlistArr[i][1].deezerID) {
                //creates playlist format for each song
                var queuedTrack = $("<div>").addClass("queued-song");
                var nameContainer = $("<div>").addClass("name-container");
                var artistName = playlistArr[i][1].artistName;
                var songName = playlistArr[i][1].songName;
                var songNameP = $("<p>").text(songName).addClass("song-name");
                var artistNameP = $("<p>").text(artistName).addClass("artist-name");
                var thumbsDiv = $("<div>");

                //album artwork information
                var thumbnail = playlistArr[i][1].thumbnail;
                var thumbnailImg = $("<img>").addClass("album-pic");
                thumbnailImg.attr("src", thumbnail);
                // create upvote button
                var upButton = $("<a>");
                upButton.attr("data-deezer", playlistArr[i][1].deezerID);
                upButton.addClass("btn btn-flat waves-effect waves-green upvote");
                upButton.html("<i class='material-icons'>thumb_up</i>");
                // create downvote button
                var downButton = $("<a>");
                downButton.attr("data-deezer", playlistArr[i][1].deezerID);
                downButton.addClass("btn btn-flat waves-effect waves-red downvote");
                downButton.html("<i class='material-icons'>thumb_down</i>");

                thumbsDiv.append(upButton);
                thumbsDiv.append(downButton);

                nameContainer.append(songNameP, artistNameP);
                queuedTrack.append(thumbnailImg);
                queuedTrack.append(nameContainer);
                queuedTrack.append(thumbsDiv);
                // append song to playlist container on page
                $(".queued-track-container").append(queuedTrack);
            }
            // set up to push array that holds all songs
            if (totalSongPlaylist.length !== 0) {
                var existing = false;
                for (var v = 0; v < totalSongPlaylist.length; v++) {
                    if (playlistArr[i][1].deezerID == totalSongPlaylist[v][1].deezerID) {
                        existing = true;
                    }
                }
                if (!existing) {
                    totalSongPlaylist.push(playlistArr[i]);
                }
            }
            else {
                totalSongPlaylist.push(playlistArr[i]);
            }
        }
    });
    // update top songs chart
    listRankings()
}
// function that clears search results
function clearSearchResults() {
    $(".search-results").remove();
    $("#search-input").val("");
    $("#clear-search").css("visibility", "hidden")
}

let playing = true;
// plays or pauses audio based on playing status
function playPause() {
    if (playing) {

        getLyrics();
        const song = document.querySelector('#song');

        song.play(); //this will play the audio track
        playing = false;
        $("#start-listening").html("<i class='large material-icons play-pause'>pause_circle_outline</i>");
    } else {
        song.pause();
        playing = true;
        $("#start-listening").html("<i class='large material-icons play-pause'>play_circle_outline</i>");
    }
}
// retrieves current songs lyrics and displays on page
function getLyrics() {

    for (var i = 0; i < playlistArr.length; i++) {
        if (currentSong == playlistArr[i][1].deezerID) {
            var lyricTitle = playlistArr[i][1].songName;
            $(".music-lyrics-container").empty();
            var musicLyrics = $("<div>");
            musicLyrics.addClass("music-lyrics");
            // musicLyrics.css("overflow", "auto");


            var queryURL = "https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=jsonp&callback=callback&q_track=" + playlistArr[i][1].songName + "&q_artist=" + playlistArr[i][1].artistName + "&apikey=2cfbc4e7d607a2feef36118210237514";

            $.ajax({
                url: queryURL,
                type: "GET",
                data: {
                    format: "jsonp",
                    callback: "jsonp_callback"
                },
                dataType: "jsonp",
                jsonpCallback: "jsonp_callback",
                contentType: "application/json"
            })
                .then(function (response) {

                    var results = response;
                    var musicLyrics = results.message.body.lyrics.lyrics_body;

                    var lyricTitleDiv = $("<h3>");
                    lyricTitleDiv.append("\'" + lyricTitle + "\':");
                    $(".music-lyrics-container").append(lyricTitleDiv);
                    $(".music-lyrics-container").append(musicLyrics);
                    $(".music-lyrics").append(musicLyrics);

                })
        }
    }
}
// sorts playlist based on upvote count
function sortPlaylist() {
    playlistArr = Object.entries(livePlaylist);

    if (playlistArr.length > 2) {
        var sorted = false;
        while (!sorted) {
            sorted = true;
            for (var i = 1; i < playlistArr.length - 1; i++) {
                if ((playlistArr[i][1].upvote < playlistArr[i + 1][1].upvote)) {
                    sorted = false;
                    var temp = playlistArr[i];
                    playlistArr[i] = playlistArr[i + 1];
                    playlistArr[i + 1] = temp;
                    // })
                }
                // playlistArr[i][1].index = i;
            }
        }
    }
    return playlistArr;
}
// sorts top songs based on upvote count
function listRankings() {
    $("#rankings-list").empty();


    var arr = [...totalSongPlaylist];

    var sorted = false;
    while (!sorted) {
        sorted = true;
        for (var i = 0; i < arr.length - 1; i++) {

            if (arr[i][1].upvote < arr[i + 1][1].upvote) {

                sorted = false;
                var temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
            }
        }
    }

    var orderedList = $("<ol>");

    for (var i = 0; i < arr.length; i++) {

        if (arr[i][1].upvote > 0) {
            //artist and song
            var rankedTrack = $("<div>").addClass("queued-song ranked-song");
            var nameContainer = $("<div>").addClass("name-container");
            var artistName = arr[i][1].artistName;
            var songName = arr[i][1].songName;
            var songNameP = $("<p>").text(songName).addClass("song-name");
            var artistNameP = $("<p>").text(artistName).addClass("artist-name");
            //artwork
            var thumbnail = arr[i][1].thumbnail;
            var thumbnailImg = $("<img>").addClass("album-pic");
            thumbnailImg.attr("src", thumbnail);
            //ranking
            var songLikes = arr[i][1].upvote;

            var songLikesP = $("<p>").html("&uarr;" + songLikes).addClass("song-likes");
            //append song details together
            nameContainer.append(songNameP, artistNameP);
            rankedTrack.append("<li></li>");
            rankedTrack.append(thumbnailImg);
            rankedTrack.append(nameContainer);
            rankedTrack.append(songLikesP);
            //append song to list
            orderedList.append(rankedTrack);

            $("#rankings-list").append(orderedList);
        }
    }
};
// listens for key strokes in the search
$("#search-input").keyup(function (event) {
    //first remove the results from any previous search
    var searchStatus = $("#search-input").val();

    if (searchStatus == "") {
        $(".search-results").remove();
        $("#clear-search").css("visibility", "hidden")
    }
    else {
        $("#clear-search").css("visibility", "visible");
        $(".search-results").replaceWith();
        var searchName = $("#search-input").val().trim();
        // calls deezer API to show search results
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + searchName,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
                "x-rapidapi-key": "2b465189c6msh70d8eec8b15ca2bp19227bjsn69a9133db5ad"
            }
        }

        //create the search results div only when a search is first called
        var searchResults = $("<div>");
        searchResults.addClass("search-results");
        $(".search-results-container").append(searchResults);

        $.ajax(settings).done(function (response) {
            var results = response.data;
            searchResultArr = results;
            // loop through search results and adds each song to search result container on page
            for (var i = 0; i < results.length; i++) {
                var searchResult = $("<div>").addClass("search-result").attr("data-target", "#add-song-modal").attr("data-toggle", "modal").attr("data-backdrop", "false");
                var nameContainers = $("<div>").addClass("name-container search-name");
                var artistName = results[i].artist.name;
                var songName = results[i].title_short;
                var songNameP = $("<p>").text(songName);
                var artistNameP = $("<p>").text(artistName);

                //deezer catalogue id
                var deezerID = results[i].id;

                //album artwork information
                var thumbnail = results[i].album.cover;
                var thumbnailImg = $("<img>");

                thumbnailImg.attr("src", thumbnail).addClass("album-pic");
                searchResult.attr("data-deezer", deezerID);
                searchResult.append(thumbnailImg);
                nameContainers.append(songNameP, artistNameP);
                searchResult.append(nameContainers);
                searchResults.append(searchResult);
            }
        })
    }
});
// listens for click on play/pause button
$("#start-listening").on("click", function () {
    playPause();
});
// listens for click on rankings tab and updates top songs list
$("#rankings-tab").on("click", listRankings);

// listens for click on song in search result
$(document).on("click", ".search-result", function (event) {
    for (var i = 0; i < 25; i++) {
        if (searchResultArr[i].id == $(this).attr("data-deezer")) {
            // push song data to firebase
            database.ref("/playlist").push({
                artistName: searchResultArr[i].artist.name,
                songName: searchResultArr[i].title_short,
                thumbnail: searchResultArr[i].album.cover,
                preview: searchResultArr[i].preview,
                upvote: 0,
                deezerID: searchResultArr[i].id,
            });

            renderQueue();

            $("#add-song-modal").modal("show").on("shown.bs.modal", function () {
                window.setTimeout(function () {
                    $("#add-song-modal").modal("hide");
                }, 1000);
            });
        }
    }
});
// listens for click to clear search results
$(document).on("click", "#clear-search", clearSearchResults);
// listens for click on any upvote button
$(document).on("click", ".upvote", function (event) {

    listRankings();
    for (var i = 0; i < playlistArr.length; i++) {
        if (playlistArr[i][1].deezerID == $(this).attr("data-deezer")) {

            // add upvote to local playlist array
            playlistArr[i][1].upvote++
            if (likedSongs.length !== 0) {
                for (var u = 0; u < likedSongs.length; u++) {
                    if (likedSongs[u].deezerID !== playlistArr[i][1].deezerID) {
                        // push to likedSongs and push likedSongs to local storage
                        likedSongs.push(playlistArr[i][1]);
                        localStorage.setItem("Liked Songs", JSON.stringify(likedSongs));
                    }
                }
            }
            else {
                likedSongs.push(playlistArr[i][1]);
                localStorage.setItem("Liked Songs", JSON.stringify(likedSongs));
            }
            // variable to hold new upvote value
            var updates = {}
            updates["/playlist/" + playlistArr[i][0] + "/upvote"] = playlistArr[i][1].upvote;
            // push to firebase
            return database.ref().update(updates);
        }
    }
    // update playlist with new upvote count
    renderQueue();

});

// pull liked songs from local storage to show on fav tab
$(document).ready(function (event) {
    if (Array.isArray(likedSongs)) {
        var favs = JSON.parse(localStorage.getItem("Liked Songs"));
        var favList = $("<ol>");
        if (likedSongs.length !== 0) {
            for (var i = 0; i < favs.length; i++) {
                var favTrack = $("<div>").addClass("queued-song ranked-song");
                var nameContainer = $("<div>").addClass("name-container");
                var artistName = favs[i].artistName;
                var songName = favs[i].songName;
                var songNameP = $("<p>").text(songName).addClass("song-name");
                var artistNameP = $("<p>").text(artistName).addClass("artist-name");
                //artwork
                var thumbnail = favs[i].thumbnail;
                var thumbnailImg = $("<img>").addClass("album-pic");
                thumbnailImg.attr("src", thumbnail);

                //append song details together
                nameContainer.append(songNameP, artistNameP);
                favTrack.append("<li></li>");
                favTrack.append(thumbnailImg);
                favTrack.append(nameContainer);
                //append song to list
                favList.append(favTrack);

                $("#favs-list").append(favList);
            }
        }
    }
});

$(document).on("click", ".downvote", function (event) {

    for (var property in livePlaylist) {
        if (livePlaylist[property].deezerID == $(this).attr("data-deezer")) {
            // add upvote to local playlist array
            livePlaylist[property].upvote--
            // variable to hold new upvote value
            var updates = {}
            updates["/playlist/" + property + "/upvote"] = livePlaylist[property].upvote;
            // push to firebase
            return database.ref().update(updates);
        }
    }
    renderQueue();
});
// listens for click on sign-in button
$(document).on("click", "#sign-in-submit", function (event) {
    event.preventDefault();

    $(".welcome-box").remove();
    var userName = $("#recipient-name").val().trim();
    localStorage.clear();
    localStorage.setItem("username", userName);
    // $("#recipient-name").text(localStorage.getItem("username"));
    var welcome = $("<div>").addClass("welcome-box");
    welcome.text("Welcome " + userName + "!");
    $("#welcome-container").append(welcome);
    $("#sign-in-button").text("Sign out");
});

// set up playlist on page load
$(document).ready(renderQueue());
// checks local storage for existing username on page load
$(document).ready(function (event) {
    if (localStorage.getItem("username") !== null) {
        var welcomeBack = $("<div>").addClass("welcome-box");
        $("#sign-in-button").text("Sign out");
        welcomeBack.text("Welcome back " + localStorage.getItem("username") + "!");
        $("#welcome-container").append(welcomeBack);
    }
});
// checks local storage for favorite song on page load
$(document).ready(function (event) {
    if (Array.isArray(likedSongs)) {
        var favs = JSON.parse(localStorage.getItem("Liked Songs"));
        var favList = $("<ol>");
        for (var i = 0; i < favs.length; i++) {
            var favTrack = $("<div>").addClass("queued-song ranked-song");
            var nameContainer = $("<div>").addClass("name-container");
            var artistName = favs[i].artistName;
            var songName = favs[i].songName;
            var songNameP = $("<p>").text(songName).addClass("song-name");
            var artistNameP = $("<p>").text(artistName).addClass("artist-name");
            //artwork
            var thumbnail = favs[i].thumbnail;
            var thumbnailImg = $("<img>").addClass("album-pic");
            thumbnailImg.attr("src", thumbnail);

            //append song details together
            nameContainer.append(songNameP, artistNameP);
            favTrack.append("<li></li>");
            favTrack.append(thumbnailImg);
            favTrack.append(nameContainer);
            //append song to list
            favList.append(favTrack);

            $("#favs-list").append(favList);
        }
    }
});

// listens for end of song 
$("#song").on("ended", (event) => {
    currentSong = "";
    var removeSong = playlistArr[0][0];
    // removes ended song from firebase
    database.ref("/playlist/" + removeSong).remove();

    renderQueue();

    if (playlistArr.length > 0) {
        playing = true;
        playPause();
    }
    else {
        playing = true;
        playPause();
        $("#start-listening").text("Start Listening");
    }
});


// update livePlaylist variable when firebase is changed
database.ref().on("value", function (snapshot) {
    livePlaylist = snapshot.val().playlist;
});

//Volume control
var volume = document.querySelector("#volume");
var songFile = document.querySelector("#song");

volume.addEventListener('change', function (e) {
    songFile.volume = e.currentTarget.value / 100;
})

