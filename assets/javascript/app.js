// getlyrics not working
// 

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

Chart.defaults.global.defaultFontColor = 'white';

var ctx = $('#myChart');
// var Chart = require('chart.js');
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

// var songIndex = 0;
var searchResultArr = {};
// var userName = "";

var currentSong = "";
function renderQueue() {
    database.ref().once("value", function (snapshot) {
        livePlaylist = snapshot.val().playlist;

        $(".queued-track-container").empty();

        sortPlaylist();
        // loads playlist on screen
        for (var i = 0; i < playlistArr.length; i++) {
            // if (i == songIndex) {
            if (currentSong == "") {
                // currentSong = true;
                currentSong = playlistArr[i][1].deezerID;
                $("#song").attr("src", playlistArr[i][1].preview);
                console.log(playlistArr[i][1].songName);
                var queuedTrack = $("<div>").addClass("current-song-container").attr("data-id", playlistArr[i][1].deezerID);
                var nameContainer = $("<div>").addClass("name-container current-song");
                var artistName = playlistArr[i][1].artistName;
                var songName = playlistArr[i][1].songName;

            var songNameP = $("<p>").text(songName).addClass("song-name");
            var artistNameP = $("<p>").text(artistName).addClass("artist-name");
            // var thumbsVol = $("<div>").addClass("thumbs-volume");
            var thumbsDiv = $("<div>").addClass("thumbs-container");

            thumbsDiv.addClass("btn-group");
            thumbsDiv.attr("role", "group");

                var upButton = $("<a>");
                // upButton.attr("type", "button");
                upButton.attr("data-deezer", playlistArr[i][1].deezerID);
                upButton.addClass("btn btn-flat waves-effect waves-green upvote");
                upButton.html("<i class='material-icons'>thumb_up</i>");

                var downButton = $("<a>");
                // downButton.attr("type", "button");
                downButton.attr("data-deezer", playlistArr[i][1].deezerID);
                downButton.addClass("btn btn-flat waves-effect waves-red downvote");
                downButton.html("<i class='material-icons'>thumb_down</i>");

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

                $("#current-track-box").empty();
                $("#current-track-box").append(queuedTrack);
                // $(".queued-track-container").append(queuedTrack);
                // update firebase with tempIndex
                // database.ref("/playlist/" + playlistArr[i][0]).update({
                //     index: 0
                // });
            }
            else if (currentSong !== playlistArr[i][1].deezerID) {

                // tempIndex++;
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

                var upButton = $("<a>");
                // upButton.attr("type", "button");
                upButton.attr("data-deezer", playlistArr[i][1].deezerID);
                upButton.addClass("btn btn-flat waves-effect waves-green upvote");
                upButton.html("<i class='material-icons'>thumb_up</i>");

                var downButton = $("<a>");
                // downButton.attr("type", "button");
                downButton.attr("data-deezer", playlistArr[i][1].deezerID);
                downButton.addClass("btn btn-flat waves-effect waves-red downvote");
                downButton.html("<i class='material-icons'>thumb_down</i>");

                thumbsDiv.append(upButton);
                thumbsDiv.append(downButton);

                nameContainer.append(songNameP, artistNameP);
                queuedTrack.append(thumbnailImg);
                queuedTrack.append(nameContainer);
                queuedTrack.append(thumbsDiv);

                $(".queued-track-container").append(queuedTrack);
            }
            // 
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

    listRankings()


}

function clearSearchResults() {
    $(".search-results").remove();
    $("#search-input").val("");
    $("#clear-search").css("visibility", "hidden")
}

$(document).ready(renderQueue());

database.ref().on("value", function (snapshot) {
    livePlaylist = snapshot.val().playlist;
});

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
        // searchResults.css("height", "150px");
        // searchResults.css("overflow", "auto");
        $(".search-results-container").append(searchResults);

        $.ajax(settings).done(function (response) {
            var results = response.data;
            searchResultArr = results;

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

                //add button for option of adding it to the queue
                // var addToQueue = $("<button>");
                searchResult.attr("data-deezer", deezerID);
                // addToQueue.addClass("add-button");
                // addToQueue.text("add");

                searchResult.append(thumbnailImg);
                nameContainers.append(songNameP, artistNameP);
                searchResult.append(nameContainers);


                searchResults.append(searchResult);
            }
        })
    }
});


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
})
$(document).on("click", "#clear-search", clearSearchResults);

$("#start-listening").on("click", function () {
    // for (var property in livePlaylist) {
    //     if (livePlaylist[property].index == 0) {
    // $("#song").attr("src", livePlaylist[property].preview);
    playPause();
    // requires sign in for music to play
    // if (userName != "") {
    //     playPause();
    // }   
    //     }
    // }
});

let playing = true;

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

var playedTracks = [];

$("#song").on("ended", (event) => {
    currentSong = "";
    var removeSong = playlistArr[0][0];
    database.ref("/playlist/" + removeSong).remove();
    renderQueue();
    // songIndex++;
    //remove first (most recently finished) track from playlist
    // var playedTrack = playlist.shift();
    // playedTracks.push(playedTrack);
    // sortPlaylist(livePlaylist);
    if (playlistArr.length > 0) {

        // for (var property in livePlaylist) {
        // if (livePlaylist[property].index == 1) {

        playing = true;
        // $("#song").attr("src", livePlaylist[property].preview);

        playPause();
        // getLyrics();
        // songIndex++;
        // renderQueue();
        // }
        // }
        // songIndex++;
    }
    else {
        // songIndex++;
        playing = true;
        playPause();
        $("#start-listening").text("Start Listening");
    }
});

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
    return playlistArr
}

// push upvotes/downvotes to firebase
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

$(document).on("click", "#sign-in-submit", function (event) {
    event.preventDefault();

    $(".welcome-box").remove();
    var userName = $("#recipient-name").val().trim();
    localStorage.clear();
    localStorage.setItem("username", userName);
    // $("#recipient-name").text(localStorage.getItem("username"));
    var welcome = $("<div>").addClass("welcome-box");
    welcome.text("Welcome " + userName + "!");
    $("#header-menu-buttons").append(welcome);
    $("#sign-in-button").text("Sign out");
});

$(document).ready(function (event) {
    if (localStorage.getItem("username") !== null) {
        var welcomeBack = $("<div>").addClass("welcome-box");
        $("#sign-in-button").text("Sign out");
        welcomeBack.text("Welcome back " + localStorage.getItem("username") + "!");
        $("#header-menu-buttons").append(welcomeBack);
    }
});

$("#recipient-name").attr("value", localStorage.getItem("username"));



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
// shows tops songs after clicking on rankings tab
$("#rankings-tab").on("click", listRankings);


