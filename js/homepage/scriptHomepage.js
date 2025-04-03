document.addEventListener('DOMContentLoaded', function() {

    $("#spanUsername").html(localStorage.getItem("user").toUpperCase());

    $("#roleID").html("["+ localStorage.getItem("role").toUpperCase() + "]");
    
    if (localStorage.getItem("is_admin") == 1) {
        $("#is_adminID").css("display", "block");

        $(".sidebar a:first-child").hover(function() {
            $(this).css("background-color", "black");
            $(this).css("cursor", "pointer");
        }, function() {
            $(this).css("background-color", ""); // Resetta il colore quando non è più hoverato
            $(this).css("cursor", "");
        });
    
    }

});


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

/* IMPOSTAZIONI */
 

function openSettings() {
    document.getElementById('mainSettings').style.display = 'flex';
}

 // Funzione per chiudere il menu delle impostazioni
 function closeSettings() {
    document.getElementById('mainSettings').style.display = 'none';
}

// Funzione per salvare le impostazioni sul server
function saveSettings() {
    const gender = document.getElementById('gender').value;
    const nationality = document.getElementById('nationality').value;
    const birthdate = document.getElementById('birthdate').value;
    const height = document.getElementById('height').value;

    // Crea un oggetto con i dati da inviare
    const settingsData = {
        id: localStorage.getItem("id"),
        name: localStorage.getItem("user"),
        gender: gender,
        nationality: nationality,
        birthdate: birthdate,
        height: height
    };

    // Invia una richiesta POST al server
    fetch('http://localhost:3000/save-settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Errore:', error);
        alert('Si è verificato un errore durante il salvataggio.');
    });
}


/**************************************** */