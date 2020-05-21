var playlist = [
    0 = {
        artistName: "Arctic Monkeys",
        songName: "Do I Wanna Know?",
        thumbnail: "https://api.deezer.com/album/6899610/image",
        preview: "https://cdns-preview-6.dzcdn.net/stream/c-6f1dc690a43d4c7914384b4d61636d2b-4.mp3",
        upvote: 0,
        downvote: 0
    },
    1 = {
        artistName: "The Kinks",
        songName: "Shangri-La",
        thumbnail: "https://api.deezer.com/album/115918642/image",
        preview: "https://cdns-preview-c.dzcdn.net/stream/c-c91369d8fbb0d5c5eacc14c839741090-2.mp3",
        upvote: 0,
        downvote: 0
    },
    2 = {
        artistName: "Pink Floyd",
        songName: "Money",
        thumbnail: "https://api.deezer.com/album/12114240/image",
        preview: "https://cdns-preview-f.dzcdn.net/stream/c-f15121774a7b2486d30328d0ca4b5d05-2.mp3",
        upvote: 0,
        downvote: 0
    },
    3 = {
        artistName: "The Mars Volta",
        songName: "The Widow",
        thumbnail: "https://api.deezer.com/album/230048/image",
        preview: "https://cdns-preview-b.dzcdn.net/stream/c-ba2309052dbba45d2362d5175f306db8-6.mp3",
        upvote: 0,
        downvote: 0
    },
    4 = {
        artistName: "Portugal. The Man",
        songName: "Modern Jesus",
        thumbnail: "https://api.deezer.com/album/6607726/image",
        preview: "https://cdns-preview-d.dzcdn.net/stream/c-d6afe829858e7b165d53df214a2123a8-2.mp3",
        upvote: 0,
        downvote: 0
    }
];

var currentArtist = $("#current-track-box").attr("data-artist");
var currentSong = $("#current-track-box").attr("data-song");

$("#search-button").on("click", function (event) {
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


    $.ajax(settings).done(function (response) {
        console.log(response.data);
    })
})

let playing = true;
$("#play-pause").on("click", function () {
    playPause();
})

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

// query URL for song lyrics
// queryURL: "https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=jsonp&callback=callback&q_track=" + currentSong + "&q_artist=" + currentArtist + "&apikey=2cfbc4e7d607a2feef36118210237514",


