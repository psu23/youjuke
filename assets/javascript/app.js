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
var totalSongs = 0;
var totalCount = 0;

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
        totalCount = snapshot.val().totalsongs;
        totalSongs = totalCount.count;

        // playlistArr = Object.entries(livePlaylist);

        $(".queued-track-container").empty();

        sortPlaylist();
        // console.log(sortPlaylist);
        // for (var i = songIndex; i < playlist.length; i++) {
        // var tempIndex = 0;

        for (var i = 0; i < playlistArr.length; i++) {
            // if (i == songIndex) {
            if (currentSong == "") {
                // currentSong = true;
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
                // update firebase with tempIndex
                // database.ref("/playlist/" + playlistArr[i][0]).update({
                //     index: tempIndex
                // })
            }
        }
    });

}

function clearSearchResults() {
    $(".search-results").remove();
    $("#search-input").val("");
    $("#clear-search").css("visibility", "hidden")
}

$(document).ready(renderQueue());
database.ref().on("value", function (snapshot) {
    // console.log(snapshot.val().playlist);
    livePlaylist = snapshot.val().playlist;
    totalCount = snapshot.val().totalsongs;
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

            for (var i = 0; i < 10; i++) {
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
                index: totalSongs
            });
            totalSongs++;
            // push total song count to firebase
            database.ref("/totalsongs").set({
                count: totalSongs
            });
            // var newSong = {};

            // newSong = { artistName: searchResultArr[i].artist.name, songName: searchResultArr[i].title_short, thumbnail: searchResultArr[i].album.cover, preview: searchResultArr[i].preview, upvote: 0, deezerID: searchResultArr[i].id };
            // livePlaylist.push(newSong);
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
            console.log("hi");
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

    // })
    // var sorted = false;
    // while (!sorted) {
    //     sorted = true;
    //     for (song in livePlaylist) {
    //         if (livePlaylist[song].upvote < arr[i + 1].upvote) {
    //             sorted = false;
    //             var temp = arr[i];
    //             arr[i] = arr[i + 1];
    //             arr[i + 1] = temp;
    //         }
    //     }
    // for (var i = songIndex + 1; i < totalSongs - 1; i++) {
    //     if (arr[i].upvote < arr[i + 1].upvote) {
    //         sorted = false;
    //         var temp = arr[i];
    //         arr[i] = arr[i + 1];
    //         arr[i + 1] = temp;
    //     }
    // }
    // }
    // renderQueue();
    // return arr;
}

// push upvotes/downvotes to firebase
$(document).on("click", ".upvote", function (event) {
    for (var property in livePlaylist) {
        if (livePlaylist[property].deezerID == $(this).attr("data-deezer")) {
            // add upvote to local playlist array
            livePlaylist[property].upvote++
            // variable to hold new upvote value
            var updates = {}
            updates["/playlist/" + property + "/upvote"] = livePlaylist[property].upvote;
            // push to firebase
            return database.ref().update(updates);
        }
    }
    // sortPlaylist(livePlaylist);
    renderQueue();

})

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
})

$(document).on("click", "#sign-in-submit", function (event) {
    event.preventDefault();
    var userName = $("#recipient-name").val().trim();
    localStorage.clear();
    localStorage.setItem("username", userName);
    $("#recipient-name").text(localStorage.getItem("username"));
})

$("#recipient-name").text(localStorage.getItem("username"));

// if (localStorage.getItem("username") == null) {
//     $("#sign-in-button").text("Sign out " + localStorage.getItem("username" + "?"));
//     $(document).on("click", "#sign-in-submit", function (event) {
//         event.preventDefault();
//         var userName = $("#recipient-name").val().trim();
//         localStorage.setItem("username", userName);
//         $("#sign-in-button").text("Sign out " + localStorage.getItem("username") + "?");
//     })
// }

// else if (localStorage.getItem("username") !== null) {
//     $("#sign-in-button").text("Sign out " + localStorage.getItem("username" + "?"));
//     $(document).on("click", "#sign-in-button", function (event) {
//         // $("#sign-in-button").text("Sign In");
//         localStorage.clear();
//         location.reload();
//     })
// }

function listRankings() {
    $("#rankings-list").empty();

    var arr = [...playlist];//copies the playlist array, otherwise, bubblesort will rearrange queue live
    var sorted = false;
    while (!sorted) {
        sorted = true;
        for (var i = 0; i < arr.length - 1; i++) {
            if (arr[i].upvote < arr[i + 1].upvote) {
                sorted = false;
                var temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
            }
        }
    }

    var orderedList = $("<ol>");

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].upvote > 0) {
            //artist and song
            var rankedTrack = $("<div>").addClass("ranked-song");
            var nameContainer = $("<div>").addClass("name-container");
            var artistName = arr[i].artistName;
            var songName = arr[i].songName;
            var songNameP = $("<p>").text(songName).addClass("song-name");
            var artistNameP = $("<p>").text(artistName).addClass("artist-name"); 
            //artwork
            var thumbnail = arr[i].thumbnail;
            var thumbnailImg = $("<img>").addClass("album-pic");
            thumbnailImg.attr("src", thumbnail);
            //ranking
            var songLikes = arr[i].upvote;
            var songLikesP = $("<p>").html("&uarr;" + songLikes).addClass("song-likes");
            //append song details together
            nameContainer.append(songNameP, artistNameP);
            rankedTrack.append("<li></li>");
            rankedTrack.append(thumbnailImg);
            rankedTrack.append(nameContainer);
            rankedTrack.append(songLikesP);
            //append song to list
            orderedList.append(rankedTrack);

        }

    }

    $("#rankings-list").append(orderedList);

}