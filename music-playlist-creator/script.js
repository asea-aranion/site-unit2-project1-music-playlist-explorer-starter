// get reference to overlay div, which contains screen tint and modal itself
const overlay = document.getElementById("overlay");
// get reference to modal
const modal = document.getElementById("modal");

// array of all playlists
let playlists;

// like button icons
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
            if (displayPlaylists(playlists) === 1) {
                displayFeaturedPlaylist();
            }
        })
        .catch(error => {
            console.error("Something went wrong: ", error);
        });
}

// loads playlists into section.playlist-cards
const displayPlaylists = (playlistsData) => {
    const playlistContainer = document.querySelector(".playlist-cards");

    // check if current page is featured.html (does not contain section.playlist-cards)
    if (playlistContainer === null) {

        // return error code to loadPlaylistData()
        return 1;
    }

    // clear playlist container to prevent duplicating its contents
    playlistContainer.innerHTML = "";

    // iterate over playlists in data array, adding them as children of the playlist container
    for (let playlist of playlistsData) {

        const newPlaylist = document.createElement("article");
        newPlaylist.className = "playlist";
        newPlaylist.id = playlist["id"];
        newPlaylist.innerHTML = `
            <img src=${playlist["playlistArt"]["src"]} alt=${playlist["playlistArt"]["alt"]}>
            <h3>${playlist["title"]}</h3>
            <p>${playlist["author"]}</p>
            <div class="like-container" data-liked="false">
                <button onclick="toggleLike(${playlist["id"]})">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                        ${heartOutlinePath}
                    </svg>
                </button>
                <p class="like-counter">${playlist["likes"]}</p>
            </div>
            <div class="playlist-button-container">
                <button class="delete-button" onclick="deletePlaylist(${playlist["id"]})">
                    Delete
                </button>
                <button class="edit-button">
                    Edit
                </button>
            </div>
        `

        // clicking the playlist's edit button opens modal in editing mode
        newPlaylist.querySelector(".edit-button").addEventListener("click", (event) => {
            showModal(playlist, true);
        });

        // clicking the playlist opens modal in detail view
        newPlaylist.addEventListener("click", (event) => {
            
            // prevent clicking buttons within a playlist from displaying modal
            if (event.target.tagName !== "BUTTON" && event.target.tagName !== "svg" && event.target.tagName !== "path") {
                showModal(playlist, false);
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

    // display playlist info
    const newPlaylist = document.createElement("article");
    newPlaylist.className = "featured-playlist";
    newPlaylist.innerHTML = `
        <div class="featured-info">
            <img src=${featured["playlistArt"]["src"]} alt=${featured["playlistArt"]["alt"]}>
            <h3>${featured["title"]}</h3>
            <p>${featured["author"]}</p>
        </div>
        <aside class="featured-song-container">

        </aside>
    `;

    container.appendChild(newPlaylist);

    // add songs to display
    const songContainer = document.querySelector(".featured-song-container");

    for (let song of featured["songs"]) {

        const newSong = document.createElement("article");
        newSong.className = "featured-song";
        newSong.innerHTML = `
            <img src=${song["art"]["src"]} alt=${song["art"]["alt"]}>
            <div class="song-info-text">
                <h6>${song["title"]} <span class="song-duration">${song["duration"]}</span></h6>
                <p>${song["artist"]}</p>
                <p>${song["album"]}</p>
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
        playlists[id]["likes"] += 1;

        // update displayed like counter
        playlistLikeContainer.querySelector(".like-counter").textContent = playlists[id]["likes"];

        // update heart icon
        playlistLikeContainer.querySelector("svg").innerHTML = heartFilledPath;

        // update dataset
        playlistLikeContainer.dataset.liked = "true";

    } else {
        // unlike playlist

        // update playlist data
        playlists[id]["likes"] -= 1;

        // update displayed like counter
        playlistLikeContainer.querySelector(".like-counter").textContent = playlists[id]["likes"];

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

    showModal(playlists[id], false);
}

// make overlay and modal visible, populate modal, disable scrolling
const showModal = (playlistData, editing) => {

    modal.innerHTML = "";

    // if showing existing playlist rather than adding a new one
    if (playlistData != null) {

        // if opening edit form rather than detail view
        if (editing) {

            // show form for playlist info
            const playlistEditForm = document.createElement("form");

            playlistEditForm.id = "edit-playlist-form";
            playlistEditForm.innerHTML = `
                    <section class="playlist-data">
                        <input type="text" id="input-edit-title" placeholder="Playlist title" value="${playlistData["title"]}" required>
                        <input type="text" id="input-edit-author" placeholder="Playlist author" value="${playlistData["author"]}" required>
                    </section>
                    <section class="songs-data">
                        <button type="button" onclick="addSongToEditPlaylistForm()">
                            + Add song
                        </button>
                    </section>
                    
                    <button type="submit" onclick="handleEditPlaylistSubmit(event, ${playlistData["id"]})">
                        Save playlist
                    </button>
            `;

            const editSongsContainer = playlistEditForm.querySelector(".songs-data");

            // add 1 song edit form per song in playlist
            for (let song of playlistData["songs"]) {
                const newSongForm = document.createElement("div");

                newSongForm.innerHTML = `
                    <input type="text" class="input-edit-song-title" placeholder="Song title" value="${song["title"]}" required>
                    <input type="text" class="input-edit-song-artist" placeholder="Artist name" value="${song["artist"]}" required>
                    <input type="text" class="input-edit-song-album" placeholder="Album name" value="${song["album"]}" required>
                    <input type="text" class="input-edit-song-duration" placeholder="Song duration" value="${song["duration"]}" required>
                `;

                editSongsContainer.appendChild(newSongForm);
            }

            modal.appendChild(playlistEditForm);

        } else {

            // populate clicked playlist data
            const playlistDetailView = document.createElement("div");

            playlistDetailView.innerHTML = `
                <section class="playlist-info">
                    <img src="${playlistData["playlistArt"]["src"]}" alt="${playlistData["playlistArt"]["alt"]}">
                    <div class="playlist-info-text">
                        <h3>${playlistData["title"]}</h3>
                        <p>${playlistData["author"]}</p>
                    </div>
                    <button onclick="shufflePlaylist(${playlistData["id"]})">
                        Shuffle
                    </button>
                </section>
                <section class="songs">
                    
                </section>
            `;

            modal.appendChild(playlistDetailView);

            const songContainer = modal.querySelector(".songs");

            songContainer.innerHTML = "";

            for (let song of playlistData["songs"]) {
                const newSong = document.createElement("article");
                newSong.className = "song";
                newSong.innerHTML = `
                    <img src=${song["art"]["src"]} alt=${song["art"]["alt"]}>
                    <div class="song-info-text">
                        <h6>${song["title"]} <span class="song-duration">${song["duration"]}</span></h6>
                        <p>${song["artist"]}</p>
                        <p>${song["album"]}</p>
                    </div>
                `;

                songContainer.appendChild(newSong);
            }

        }

    // if null was passed in, show add playlist form
    } else {
        const addPlaylistForm = document.createElement("form");

        addPlaylistForm.id = "add-playlist-form";
        addPlaylistForm.innerHTML = `
                <section class="playlist-data">
                    <input type="text" id="input-title" placeholder="Playlist title" required>
                    <input type="text" id="input-author" placeholder="Playlist author" required>
                    <input type="file" id="input-cover" accept="image/jpeg, image/png" required>
                </section>
                <section class="songs-data">
                    <button type="button" onclick="addSongToAddPlaylistForm()">
                        + Add song
                    </button>
                </section>
                
                <button type="submit" onclick="handleAddPlaylistSubmit(event)">
                    Add playlist
                </button>
        `;

        modal.appendChild(addPlaylistForm);

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

const handleEditPlaylistSubmit = (event, id) => {
    event.preventDefault();

    playlists[id] = {
        ...playlists[id],
        "title": document.getElementById("input-edit-title").value,
        "author": document.getElementById("input-edit-author").value,
        "songs": new Array()
    };

    const songInputsArray = Array.from(modal.querySelector(".songs-data").children).slice(1);


    // add songs to new playlist object
    for (let songInputs of songInputsArray) {
        
        playlists[id]["songs"].push({
            "title": songInputs.querySelector(".input-edit-song-title").value,
            "artist": songInputs.querySelector(".input-edit-song-artist").value,
            "album": songInputs.querySelector(".input-edit-song-album").value,
            "duration": songInputs.querySelector(".input-edit-song-duration").value,
            "art": {
                "src": "assets/img/song.png",
                "alt": "An icon of a music note."
            }
        });
    }

    displayPlaylists(playlists);

    hideModal();
}

// add playlist to array and display all playlists
const handleAddPlaylistSubmit = (event) => {
    event.preventDefault();

    const imageURL = URL.createObjectURL(document.getElementById("input-cover").files[0]);

    // add data for playlist itself
    const newPlaylistData = {
        "id": playlists.length,
        "title": document.getElementById("input-title").value,
        "author": document.getElementById("input-author").value,
        "likes": 0,
        "dateAdded": new Date().toDateString(),
        "playlistArt": {
            "src": imageURL,
            "alt": ""
        },
        "songs": new Array()
    };

    // get array of divs containing inputted song data
    const songInputsArray = Array.from(modal.querySelector(".songs-data").children).slice(1);

    // add songs to new playlist object
    for (let songInputs of songInputsArray) {
        
        newPlaylistData["songs"].push({
            "title": songInputs.querySelector(".input-song-title").value,
            "artist": songInputs.querySelector(".input-song-artist").value,
            "album": songInputs.querySelector(".input-song-album").value,
            "duration": songInputs.querySelector(".input-song-duration").value,
            "art": {
                "src": "assets/img/song.png",
                "alt": "An icon of a music note."
            }
        });
    }

    playlists.push(newPlaylistData);

    displayPlaylists(playlists);

    hideModal();

}

const addSongToAddPlaylistForm = () => {
    const addPlaylistForm = document.querySelector("#add-playlist-form");
    const addPlaylistFormSongs = addPlaylistForm.querySelector(".songs-data");

    const newSongForm = document.createElement("div");
    newSongForm.innerHTML = `
        <input type="text" class="input-song-title" placeholder="Song title" required>
        <input type="text" class="input-song-artist" placeholder="Artist name" required>
        <input type="text" class="input-song-album" placeholder="Album name" required>
        <input type="text" class="input-song-duration" placeholder="Song duration" required>
    `;

    addPlaylistFormSongs.appendChild(newSongForm);
}

const addSongToEditPlaylistForm = () => {
    const editSongsContainer = modal.querySelector(".songs-data");

    const newSongForm = document.createElement("div");

    newSongForm.innerHTML = `
        <input type="text" class="input-edit-song-title" placeholder="Song title" required>
        <input type="text" class="input-edit-song-artist" placeholder="Artist name" required>
        <input type="text" class="input-edit-song-album" placeholder="Album name" required>
        <input type="text" class="input-edit-song-duration" placeholder="Song duration" required>
    `;

    editSongsContainer.appendChild(newSongForm);
    
}

// delete a playlist from the array and display
const deletePlaylist = (id) => {

    playlists = playlists.filter((element) => element["id"] !== id);

    displayPlaylists(playlists);
}

// only display playlists whose title or author contain text in the search box
const filterPlaylists = () => {

    const searchTerm = document.getElementById("input-search").value.toLowerCase();

    displayPlaylists(playlists.filter((element) => 
        element["title"].toLowerCase().includes(searchTerm) 
        || element["author"].toLowerCase().includes(searchTerm)
    ))
}

// set search box text to empty
const clearSearchTerm = () => {
    document.getElementById("input-search").value = "";
    filterPlaylists();
}

// perform mutating sort on playlists array and display sorted array
const sortPlaylists = (sortNum) => {

    // sort by name
    if (sortNum === 0) {
        playlists.sort((a, b) => 
            a["title"].localeCompare(b["title"])
        );

    // sort by likes
    } else if (sortNum === 1) {
        playlists.sort((a, b) =>
            b["likes"] - a["likes"]
        );

    // sort by date added
    } else if (sortNum === 2) {
        playlists.sort((a, b) =>
            new Date(b["dateAdded"]) - new Date(a["dateAdded"])
        );
    }
    
    displayPlaylists(playlists);
}

// hides modal when it is visible and any area outside it is clicked
window.onclick = function(event) {
    if (event.target == overlay) {
        hideModal();
    }
}

// if on index.html, search playlists on enter key press in search box
document.getElementById("input-search")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        filterPlaylists();
    }
})

loadPlaylistData();

