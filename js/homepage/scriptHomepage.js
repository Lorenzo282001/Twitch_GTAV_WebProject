document.addEventListener('DOMContentLoaded', function() {

    console.log("ID USER:" + localStorage.getItem("id"));
 
    $("#spanUsername").html(localStorage.getItem("user").toUpperCase());
    
    const role = localStorage.getItem("role");

    if (role == "citizen") {
        $("#roleID").html("🧍‍♂️");
    }

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

    // Receupero settaggi utente se sono diversi da null
    fetch(`http://localhost:3000/get-settings?id=${localStorage.getItem("id")}&name=${localStorage.getItem("user")}`)
    .then(response => {
        if (!response.ok) {
        throw new Error('Errore nel recupero delle impostazioni');
        }
        return response.json();
    })
    .then(data => {
         // Imposta valori di default se il campo è null o undefined
        const gender = data.gender ?? 'male'; // Default: Maschio
        const nationality = data.nationality ?? 'it'; // Default: Italia
        const birthdate = data.birthdate ?? '2000-01-01'; // Default: data generica
        const height = data.height ?? 170; // Default: 170 cm

        // Imposta i valori nei campi con jQuery
        $('#gender').val(gender);
        $('#nationality').val(nationality);
        $('#birthdate').val(birthdate);
        $('#height').val(height);

    })
    .catch(error => {
        console.error('Errore nel fetch:', error);
    });

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

/* DASHBOARD CITTADINO*/

function toggleDashboard() {

    if ($('.dashboard').is(':visible')) {
        $(".dashboard").fadeOut(500);
    } else {
        $(".dashboard").hide().fadeIn(500);
        document.getElementById('mainSettings').style.display = 'none';
    }
}

/* IMPOSTAZIONI */
 

function openSettings() {
    $(".dashboard").fadeOut(500);

    $("#mainSettings").fadeIn(500);

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