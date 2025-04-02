

function toggleMenu(event) {
    event.stopPropagation(); // Prevent the click event from bubbling up to the document
    // Toggle the sidebar menu
    document.getElementById("sidebar").classList.toggle("active");
}

function closeMenu(event) {
    let sidebar = document.getElementById("sidebar");

    if (!sidebar.classList.contains(event.target) && sidebar.classList.contains("active")) {
        sidebar.classList.remove("active");
    }
}