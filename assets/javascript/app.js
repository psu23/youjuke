var playlist = [
    {
        artistName: "Arctic Monkeys",
        songName: "Do I Wanna Know?",
        thumbnail: "https://api.deezer.com/album/6899610/image",
        preview: "https://cdns-preview-6.dzcdn.net/stream/c-6f1dc690a43d4c7914384b4d61636d2b-4.mp3",
        upvote: 0,
        downvote: 0,
        deezerID: 70322130
    },
    {
        artistName: "The Kinks",
        songName: "Shangri-La",
        thumbnail: "https://api.deezer.com/album/115918642/image",
        preview: "https://cdns-preview-c.dzcdn.net/stream/c-c91369d8fbb0d5c5eacc14c839741090-2.mp3",
        upvote: 0,
        downvote: 0,
        deezerID: 781869182
    },
    {
        artistName: "Pink Floyd",
        songName: "Money",
        thumbnail: "https://api.deezer.com/album/12114240/image",
        preview: "https://cdns-preview-f.dzcdn.net/stream/c-f15121774a7b2486d30328d0ca4b5d05-2.mp3",
        upvote: 0,
        downvote: 0,
        deezerID: 116914026
    },
    {
        artistName: "The Mars Volta",
        songName: "The Widow",
        thumbnail: "https://api.deezer.com/album/230048/image",
        preview: "https://cdns-preview-b.dzcdn.net/stream/c-ba2309052dbba45d2362d5175f306db8-6.mp3",
        upvote: 0,
        downvote: 0,
        deezerID: 2309096
    },
    {
        artistName: "Portugal. The Man",
        songName: "Modern Jesus",
        thumbnail: "https://api.deezer.com/album/6607726/image",
        preview: "https://cdns-preview-d.dzcdn.net/stream/c-d6afe829858e7b165d53df214a2123a8-2.mp3",
        upvote: 0,
        downvote: 0,
        deezerID: 67511941
    }
];

var songIndex = 0;

function renderQueue() {
    $(".queued-track-container").empty();

    for (var i = songIndex; i < playlist.length; i++){
    
        if (i == songIndex) {
            var queuedTrack = $("<div>").addClass("queued-song").attr("data-id", playlist[i].deezerID);
            var nameContainer = $("<div>").addClass("name-container current-song");
            var artistName = playlist[i].artistName;
            var songName = playlist[i].songName;
            var songNameP = $("<p>").text(songName).addClass("song-name");
            var artistNameP = $("<p>").text(artistName).addClass("artist-name");
            var thumbsDiv = $("<div>").addClass("thumbs-container");
          
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


            //album artwork information
            var thumbnail = playlist[i].thumbnail;
            var thumbnailImg = $("<img>").addClass("album-pic");
            thumbnailImg.attr("src", thumbnail);

            nameContainer.append(songNameP, artistNameP);
            queuedTrack.append(thumbnailImg);
            queuedTrack.append(nameContainer);
            queuedTrack.append(thumbsDiv);

            $("#current-track-box").empty();
            $("#current-track-box").append(queuedTrack);
        }
        else {
            var queuedTrack = $("<div>").addClass("queued-song").attr("data-id", playlist[i].deezerID);
            var nameContainer = $("<div>").addClass("name-container");
            var artistName = playlist[i].artistName;
            var songName = playlist[i].songName;
            var songNameP = $("<p>").text(songName).addClass("song-name");
            var artistNameP = $("<p>").text(artistName).addClass("artist-name");
            var thumbsDiv = $("<div>");

            //album artwork information
            var thumbnail = playlist[i].thumbnail;
            var thumbnailImg = $("<img>").addClass("album-pic");
            thumbnailImg.attr("src", thumbnail);
          
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

            nameContainer.append(songNameP, artistNameP);
            queuedTrack.append(thumbnailImg);
            queuedTrack.append(nameContainer);
            queuedTrack.append(thumbsDiv);

            $(".queued-track-container").append(queuedTrack);
        }
    }
}

$(document).ready(renderQueue());

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
            var artistName = results[i].artist.name;
            var songName = results[i].title;
            var songNameP = $("<p>").text(songName);
            var artistNameP = $("<p>").text(artistName);

            //deezer catalogue id
            var deezerID = results[i].id;

            //album artwork information
            var thumbnail = results[i].album.cover;
            var thumbnailImg = $("<img>");
            thumbnailImg.attr("src", thumbnail).addClass("album-pic");

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

                    newSong = {artistName: results[i].artist.name, songName: results[i].title, thumbnail: results[i].album.cover, preview: results[i].preview, upvote: 0, downvote: 0, deezerID: results.id};
                    playlist.push(newSong);
                    renderQueue();

                    // consider adding a modal indicating that the song was successfully added
                }
            }
        })
    })

});

$("#start-listening").on("click", function () {
    playPause();
});

let playing = true;

function playPause() {
    if (playing) {
        getLyrics();
        const song = document.querySelector('#song');

        song.play(); //this will play the audio track
        playing = false;
        $("#start-listening").text("Stop Listening")
    } else {
        song.pause();
        playing = true;
        $("#start-listening").text("Start Listening")
    }
}

$("#song").on("ended", (event) => {
    songIndex++;
    playing = true;
    $("#song").attr("src", playlist[songIndex].preview);
    playPause();
    getLyrics();
    renderQueue();
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


