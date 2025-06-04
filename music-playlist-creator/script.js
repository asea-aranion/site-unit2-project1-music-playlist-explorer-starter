// get reference to overlay div, which contains screen tint and modal itself
const overlay = document.getElementById("overlay");
// get reference to modal
const modal = document.getElementById("modal");

// makes overlay and modal visible, disables scrolling
const showModal = (playlistData) => {
    // place playlist information into modal here

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
