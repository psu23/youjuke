var playlist = [
    {
        artistName: "Arctic Monkeys",
        songName: "Do I Wanna Know?",
        thumbnail: "https://api.deezer.com/album/6899610/image",
        preview: "https://cdns-preview-6.dzcdn.net/stream/c-6f1dc690a43d4c7914384b4d61636d2b-4.mp3",
        upvote: 0,
        downvote: 0
    },
    {
        artistName: "The Kinks",
        songName: "Shangri-La",
        thumbnail: "https://api.deezer.com/album/115918642/image",
        preview: "https://cdns-preview-c.dzcdn.net/stream/c-c91369d8fbb0d5c5eacc14c839741090-2.mp3",
        upvote: 0,
        downvote: 0
    },
    {
        artistName: "Pink Floyd",
        songName: "Money",
        thumbnail: "https://api.deezer.com/album/12114240/image",
        preview: "https://cdns-preview-f.dzcdn.net/stream/c-f15121774a7b2486d30328d0ca4b5d05-2.mp3",
        upvote: 0,
        downvote: 0
    },
    {
        artistName: "The Mars Volta",
        songName: "The Widow",
        thumbnail: "https://api.deezer.com/album/230048/image",
        preview: "https://cdns-preview-b.dzcdn.net/stream/c-ba2309052dbba45d2362d5175f306db8-6.mp3",
        upvote: 0,
        downvote: 0
    },
    {
        artistName: "Portugal. The Man",
        songName: "Modern Jesus",
        thumbnail: "https://api.deezer.com/album/6607726/image",
        preview: "https://cdns-preview-d.dzcdn.net/stream/c-d6afe829858e7b165d53df214a2123a8-2.mp3",
        upvote: 0,
        downvote: 0
    }
];

var songIndex = 0;

var queuedTracksArr = ["70322130", "781869182", "116914026", "2309096", "67511941"];

function renderQueue() {
    $(".queued-track").empty();

    for (var i = songIndex; i < playlist.length; i++) {

        var queuedTrack = $("<div>");
        queuedTrack.addClass("queued-song");
        var artistName = playlist[i].artistName;
        var songName = playlist[i].songName;
        var songNameP = $("<p>").text(songName);
        var artistNameP = $("<p>").text(artistName);

        //consider adding data attributes to this track..
        //..one for the index of the array..
        //..and perhaps one for the deezer song id..

        //album artwork information
        var thumbnail = playlist[i].thumbnail;
        var thumbnailImg = $("<img>").addClass("album-pic");
        thumbnailImg.attr("src", thumbnail);

        //voting buttons
        var thumbsDiv = $("<div>");
        thumbsDiv.addClass("btn-group");
        thumbsDiv.attr("role", "group");
        var upButton = $("<button>");
        upButton.attr("type", "button");
        upButton.attr("id", playlist[i].deezerID + "-u");
        upButton.addClass("btn btn-secondary");
        upButton.text("👍");
        var downButton = $("<button>");
        downButton.attr("type", "button");
        downButton.attr("id", playlist[i].deezerID + "-d");
        downButton.addClass("btn btn-secondary");
        downButton.text("👎");

        thumbsDiv.append(upButton);
        thumbsDiv.append(downButton);

        queuedTrack.append(thumbnailImg);
        queuedTrack.append(songNameP);
        queuedTrack.append(artistNameP);
        queuedTrack.append(thumbsDiv);

        $(".queued-track").append(queuedTrack);
    }

    // $(".queued-track").empty();

    // for (var i = 0; i < queuedTracksArr.length; i++) {

    //     var deezerID = queuedTracksArr[i];

    //     var settings = {
    //         "async": false,//set to false to keep proper order
    //         "crossDomain": true,
    //         "url": "https://deezerdevs-deezer.p.rapidapi.com/track/" + deezerID,
    //         "method": "GET",
    //         "headers": {
    //             "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    //             "x-rapidapi-key": "2b465189c6msh70d8eec8b15ca2bp19227bjsn69a9133db5ad"
    //         }
    //     }

    //     $.ajax(settings).done(function (response) {

    //         var results = response;

    //         var queuedTrack = $("<div>");
    //         queuedTrack.addClass("queued-song");
    //         var artistName = results.artist.name;
    //         var songName = results.title;
    //         var songNameP = $("<p>").text(songName);
    //         var artistNameP = $("<p>").text(artistName);

    //         //consider adding data attributes to this track..
    //         //..one for the index of the array..
    //         //..and perhaps one for the deezer song id..

    //         //audio information
    //         var preview = results.preview;
    //         var audioSample = $("<audio>");
    //         audioSample.attr("src", preview);

    //         //album artwork information
    //         var thumbnail = results.album.cover_small;
    //         var thumbnailImg = $("<img>").addClass("album-pic");
    //         thumbnailImg.attr("src", thumbnail);

    //         queuedTrack.append(thumbnailImg);
    //         queuedTrack.append(audioSample);
    //         queuedTrack.append(songNameP);
    //         queuedTrack.append(artistNameP);



    //         $(".queued-track").append(queuedTrack);


    //     });
    // };




}

$(document).ready(renderQueue());//or $(document).ready(renderQueue());

$("#search-button").on("click", function (event) {
    //first remove the results from any previous search
    $(".search-results").remove();

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
    searchResults.css("height", "150px");
    // searchResults.css("overflow", "auto");
    $(".search-results-container").append(searchResults);

    $.ajax(settings).done(function (response) {

        var results = response.data;
        for (var i = 0; i < 10; i++) {

            var searchResult = $("<div>").addClass("search-result");
            // searchResult.addClass("search-result"); Added this to the line above
            var artistName = results[i].artist.name;
            var songName = results[i].title;
            var songNameP = $("<p>").text(songName);
            var artistNameP = $("<p>").text(artistName);

            //deezer catalogue id
            var deezerID = results[i].id;

            //album artwork information
            var thumbnail = results[i].album.cover;
            var thumbnailImg = $("<img>");
            thumbnailImg.attr("src", thumbnail);

            //add button for option of adding it to the queue
            var addToQueue = $("<button>");
            addToQueue.attr("data-deezer", deezerID);
            addToQueue.addClass("add-button");
            addToQueue.text("add");

            searchResult.append(thumbnailImg);
            // searchResult.append(audioSample);
            searchResult.append(songNameP);
            searchResult.append(artistNameP);
            searchResult.append(addToQueue);


            searchResults.append(searchResult);


        }
        $(document).on("click", ".add-button", function (event) {
            console.log("added!");
            for (var i = 0; response.data.length; i++) {
                var results = response.data;
                var newSong = {};
                if (results[i].id == $(this).attr("data-deezer")) {
                    newSong = { artistName: results[i].artist.name, songName: results[i].title, thumbnail: results[i].album.cover, preview: results[i].preview, upvote: 0, downvote: 0 };
                    playlist.push(newSong);
                    renderQueue();

                    // consider adding a modal indicating that the song was successfully added
                }
            }
        })
    })

});

// $(document).on("click", ".add-button", function (event) {

//     var deezerID = $(this).attr("data-deezer");
//     console.log(this);
//     queuedTracksArr.push(deezerID);
//     playlist.push()
//     renderQueue();

// });



let playing = true;

$("#play-pause").on("click", function () {
    playPause();
});

function playPause() {
    if (playing) {
        const song = document.querySelector('#song'),
            thumbnail = document.querySelector('#thumbnail');
        song.play(); //this will play the audio track
        playing = false;
    } else {
        song.pause();
        playing = true;
    }
}



function songInfo() {

}


// let playing = true;
// $("#play-pause").on("click", function () {
//     playPause();
// })

function playPause() {
    if (playing) {
        getLyrics();
        const song = document.querySelector('#song');

        song.play(); //this will play the audio track
        playing = false;
    } else {



        song.pause();
        playing = true;
    }
}

const audio = $("#song");

audio.on("ended", (event) => {
    songIndex++;
    playing = true;
    $("#song").attr("src", playlist[songIndex].preview);
    playPause();
    getLyrics();
});

function getLyrics() {

    $(".music-lyrics-container").empty();
    var musicLyrics = $("<div>");
    musicLyrics.addClass("music-lyrics");
    // musicLyrics.css("overflow", "auto");
    $(".music-lyrics-container").append("<h3>Lyrics</h3>");
    $(".music-lyrics-container").append(musicLyrics);

    var queryURL = "https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=jsonp&callback=callback&q_track=" + playlist[songIndex].songName + "&q_artist=" + playlist[songIndex].artistName + "&apikey=2cfbc4e7d607a2feef36118210237514";

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
            $(".music-lyrics").append(musicLyrics);
        })
}

// queryURL: "https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=jsonp&callback=callback&q_track=" + currentSong + "&q_artist=" + currentArtist + "&apikey=2cfbc4e7d607a2feef36118210237514"

