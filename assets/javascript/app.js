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
        console.log(response.data[0].preview);
    })
})

$("#play-pause").on("click", function () {
    let playing = true; function playPause() {
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
})