// get reference to overlay div, which contains screen tint and modal itself
const overlay = document.getElementById("overlay");
// get reference to modal
const modal = document.getElementById("modal");

// array of all playlists
let playlists;

const heartOutlinePath = '<path class="outlined" fill="#899afa" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>';
const heartFilledPath = '<path class="filled" fill="mediumseagreen" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>';

// fetches data from json file, stores playlists in array, and adds each playlist to view
const loadPlaylistData = async () => {
    fetch("data/data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            playlists = data["playlists"];

            // display either all playlists or featured playlist, depending on page
            if (displayPlaylists() === 1) {
                displayFeaturedPlaylist();
            }
        })
        .catch(error => {
            console.error("Something went wrong: ", error);
        });
}

// loads playlists into section.playlist-cards
const displayPlaylists = () => {
    const playlistContainer = document.querySelector(".playlist-cards");

    // check if current page is featured.html (does not contain section.playlist-cards)
    if (playlistContainer === null) {

        // return error code to loadPlaylistData()
        return 1;
    }

    // clear playlist container to prevent duplicating its contents
    playlistContainer.innerHTML = "";

    // iterate over playlists in data array, adding them as children of the playlist container
    for (let playlist of playlists) {

        const newPlaylist = document.createElement("article");
        newPlaylist.className = "playlist";
        newPlaylist.id = playlist["playlist_id"];
        newPlaylist.innerHTML = `
            <img src=${playlist["playlist_art"]} alt=${playlist["playlist_art_alt"]}>
            <h3>${playlist["playlist_title"]}</h3>
            <p>${playlist["playlist_author"]}</p>
            <div class="like-container" data-liked="false">
                <button onclick="toggleLike(${playlist["playlist_id"]})">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                        ${heartOutlinePath}
                    </svg>
                </button>
                <p class="like-counter">${playlist["playlist_likes"]}</p>
            </div>
        `

        newPlaylist.addEventListener("click", (event) => {

            // prevent liking/unliking a playlist from displaying modal
            if (event.target.tagName !== "button" && event.target.tagName !== "svg" && event.target.tagName !== "path") {
                showModal(playlist);
            }

        });

        playlistContainer.appendChild(newPlaylist);
    }

    return 0;
}

// displays a random featured playlist (only run on featured.html)
const displayFeaturedPlaylist = () => {
    const featured = playlists[Math.floor(Math.random() * playlists.length)];

    const container = document.querySelector(".featured-container");

    const newPlaylist = document.createElement("article");
    newPlaylist.className = "featured-playlist";
    newPlaylist.innerHTML = `
        <div class="featured-info">
            <img src=${featured["playlist_art"]} alt=${featured["playlist_art_alt"]}>
            <h3>${featured["playlist_title"]}</h3>
            <p>${featured["playlist_author"]}</p>
        </div>
        <aside class="featured-song-container">

        </aside>
    `;

    container.appendChild(newPlaylist);

    const songContainer = document.querySelector(".featured-song-container");

    for (let song of featured["songs"]) {

        const newSong = document.createElement("article");
        newSong.className = "featured-song";
        newSong.innerHTML = `
            <img src=${song["song_art"]} alt=${song["song_art_alt"]}>
            <div class="song-info-text">
                <h6>${song["song_title"]}</h6>
                <p>${song["song_artist"]}</p>
                <p>${song["song_album"]}</p>
            </div>
        `;

        songContainer.appendChild(newSong);
    }
}

// likes or unlikes a playlist depending on whether the user has liked it
const toggleLike = (id) => {

    const playlistLikeContainer = document.getElementById(id.toString()).querySelector(".like-container");

    if (playlistLikeContainer.dataset.liked === "false") {
        // like playlist

        // update playlist data
        playlists[id]["playlist_likes"] += 1;

        // update displayed like counter
        playlistLikeContainer.querySelector(".like-counter").textContent = playlists[id]["playlist_likes"];

        // update heart icon
        playlistLikeContainer.querySelector("svg").innerHTML = heartFilledPath;

        // update dataset
        playlistLikeContainer.dataset.liked = "true";

    } else {
        // unlike playlist

        // update playlist data
        playlists[id]["playlist_likes"] -= 1;

        // update displayed like counter
        playlistLikeContainer.querySelector(".like-counter").textContent = playlists[id]["playlist_likes"];

        // update heart icon
        playlistLikeContainer.querySelector("svg").innerHTML = heartOutlinePath;

        // update dataset
        playlistLikeContainer.dataset.liked = "false";

    }

}

// shuffle songs in the playlist with the given id
const shufflePlaylist = (id) => {
    const songArray = playlists[id]["songs"]
    const numSongs = songArray.length;

    // perform numSongs swaps between random indices
    for (let i = 0; i < numSongs; i++) {
        const randIndex1 = Math.floor(Math.random() * numSongs);
        const randIndex2 = Math.floor(Math.random() * numSongs);
        
        let temp = songArray[randIndex1];
        songArray[randIndex1] = songArray[randIndex2];
        songArray[randIndex2] = temp;
    }

    showModal(playlists[id]);
}

// makes overlay and modal visible, disables scrolling
const showModal = (playlistData) => {
    // populate clicked playlist data
    modal.querySelector("h3").innerHTML = playlistData["playlist_title"];
    modal.querySelector("p").innerHTML = playlistData["playlist_author"];
    modal.querySelector("img").src = playlistData["playlist_art"];
    modal.querySelector("img").alt = playlistData["playlist_art_alt"];
    modal.querySelector("button").onclick = () => {
        shufflePlaylist(playlistData["playlist_id"]);
    }

    const songContainer = modal.querySelector(".songs");

    songContainer.innerHTML = "";

    for (let song of playlistData["songs"]) {
        const newSong = document.createElement("article");
        newSong.className = "song";
        newSong.innerHTML = `
            <img src=${song["song_art"]} alt=${song["song_art_alt"]}>
            <div class="song-info-text">
                <h6>${song["song_title"]}</h6>
                <p>${song["song_artist"]}</p>
                <p>${song["song_album"]}</p>
            </div>
        `;

        songContainer.appendChild(newSong);
    }

    // display modal and overlay
    overlay.style.opacity = "1";
    document.body.style.overflow = "hidden";
    overlay.style.zIndex = "2";
}

// makes overlay and modal invisible, enables scrolling
const hideModal = () => {
    overlay.style.opacity = "0";
    document.body.style.overflow = "scroll";
    overlay.style.zIndex = "-1";
}

// hides modal when it is visible and any area outside it is clicked
window.onclick = function(event) {
    if (event.target == overlay) {
        hideModal();
    }
}

loadPlaylistData();

