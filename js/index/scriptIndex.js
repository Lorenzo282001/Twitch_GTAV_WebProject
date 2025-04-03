// COMANDI PER LA CREAZIONE DELLA BARRA DI NAVIGAZIONE

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

// Login form
function openLogin() {
    closeRegister(); // Close the register form if it's open
    document.getElementById("login-container").style.display = "flex";
    document.querySelector(".hero").classList.add("moved");
}

function openRegister() {
    closeLogin(); // Close the login form if it's open
    document.getElementById("register-container").style.display = "flex";
    document.querySelector(".hero").classList.add("moved");
}   

function closeLogin() {
    document.getElementById("login-container").style.display = "none";
    document.querySelector(".hero").classList.remove("moved");
}

function closeRegister() {
    document.getElementById("register-container").style.display = "none";
    document.querySelector(".hero").classList.remove("moved");
}

// Aggiungo evento al login/register
document.getElementById("login-btn").addEventListener("click", function(e){
    e.preventDefault(); // Prevent the default form submission
    openLogin();
});

document.getElementById("register-btn").addEventListener("click", function(e){
    e.preventDefault(); // Prevent the default form submission
    openRegister();
});
