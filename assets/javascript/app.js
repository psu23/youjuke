// var playlist = [
//     0 = {
//         artistName: "Arctic Monkeys",
//         songName: "Do I Wanna Know?",
//         thumbnail: "https://api.deezer.com/album/6899610/image",
//         preview: "https://cdns-preview-6.dzcdn.net/stream/c-6f1dc690a43d4c7914384b4d61636d2b-4.mp3",
//         upVote: 0,
//         downVote: 0
//     },
//     1 = {
//         artistName: "The Kinks",
//         songName: "Shangri-La",
//         thumbnail: "https://api.deezer.com/album/115918642/image",
//         preview: "https://cdns-preview-c.dzcdn.net/stream/c-c91369d8fbb0d5c5eacc14c839741090-2.mp3",
//         upVote: 0,
//         downVote: 0
//     },
//     2 = {
//         artistName: "Pink Floyd",
//         songName: "Money",
//         thumbnail: "https://api.deezer.com/album/12114240/image",
//         preview: "https://cdns-preview-f.dzcdn.net/stream/c-f15121774a7b2486d30328d0ca4b5d05-2.mp3",
//         upVote: 0,
//         downVote: 0
//     },
//     3 = {
//         artistName: "The Mars Volta",
//         songName: "The Widow",
//         thumbnail: "https://api.deezer.com/album/230048/image",
//         preview: "https://cdns-preview-b.dzcdn.net/stream/c-ba2309052dbba45d2362d5175f306db8-6.mp3",
//         upVote: 0,
//         downVote: 0
//     },
//     4 = {
//         artistName: "Portugal. The Man",
//         songName: "Modern Jesus",
//         thumbnail: "https://api.deezer.com/album/6607726/image",
//         preview: "https://cdns-preview-d.dzcdn.net/stream/c-d6afe829858e7b165d53df214a2123a8-2.mp3",
//         upVote: 0,
//         downVote: 0
//     }
// ];

var queuedTracksArr = ["70322130", "781869182", "116914026", "2309096", "67511941"];

function renderQueue() {

    $(".queued-track").empty();

    for (var i = 0; i < queuedTracksArr.length; i++) {

        var deezerID = queuedTracksArr[i];

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://deezerdevs-deezer.p.rapidapi.com/track/" + deezerID,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
                "x-rapidapi-key": "2b465189c6msh70d8eec8b15ca2bp19227bjsn69a9133db5ad"
            }
        }

        $.ajax(settings).done(function (response) {

            var results = response;

            var queuedTrack = $("<div>");
            queuedTrack.addClass("queued-song");
            var artistName = results.artist.name;
            var songName = results.title;
            var songNameP = $("<p>").text(songName);
            var artistNameP = $("<p>").text(artistName);

            //consider adding data attributes to this track..
            //..one for the index of the array..
            //..and perhaps one for the deezer song id..

            //audio information
            var preview = results.preview;
            var audioSample = $("<audio>");
            audioSample.attr("src", preview);

            //album artwork information
            var thumbnail = results.album.cover;
            var thumbnailImg = $("<img>");
            thumbnailImg.attr("src", thumbnail);

            queuedTrack.append(thumbnailImg);
            queuedTrack.append(audioSample);
            queuedTrack.append(songNameP);
            queuedTrack.append(artistNameP);



            $(".queued-track").append(queuedTrack);


        });
    };




}

renderQueue();

$("#search-button").on("click", function (event) {
    //first remove the results from any previous search
    $(".search-results-container").remove();

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
    var searchResultsContainer = $("<div>");
    searchResultsContainer.addClass("search-results-container");
    $(".music-facts-container").prepend(searchResultsContainer);

    $.ajax(settings).done(function (response) {
        console.log(response.data[0].preview);

        var results = response.data;

        for (var i = 0; i < 10; i++) {

            var searchResult = $("<div>");
            searchResult.addClass("search-result");
            var artistName = results[i].artist.name;
            var songName = results[i].title;
            var songNameP = $("<p>").text(songName);
            var artistNameP = $("<p>").text(artistName);

            //deezer catalogue id
            var deezerID = results[i].id;

            //audio information
            var preview = results[i].preview;
            var audioSample = $("<audio>");
            audioSample.attr("src", preview);

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
            searchResult.append(audioSample);
            searchResult.append(songNameP);
            searchResult.append(artistNameP);
            searchResult.append(addToQueue);


            searchResultsContainer.append(searchResult);


        }
    })

});

$(document).on("click", ".add-button", function (event) {

    var deezerID = $(this).attr("data-deezer");
    console.log(deezerID);
    queuedTracksArr.push(deezerID);
    renderQueue();

});



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
        const song = document.querySelector('#song');

        song.play(); //this will play the audio track
        playing = false;
    } else {



        song.pause();
        playing = true;
    }
}

