// get reference to overlay div, which contains screen tint and modal itself
const overlay = document.getElementById("overlay");

// makes overlay and modal visible
const showModal = () => {
    overlay.style.display = "block";
}

// makes overlay and modal invisible
const hideModal = () => {
    overlay.style.display = "none";
}

// hides modal when it is visible and any area outside it is clicked
window.onclick = function(event) {
    if (event.target == overlay) {
        hideModal();
    }
}
