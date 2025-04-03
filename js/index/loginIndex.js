document.querySelector(".login-form button").addEventListener("click", () => {
    const name = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("login-error");

    errorMsg.style.display = "none"; // Nasconde l'errore all'inizio

    if (!name || !password) {
        errorMsg.textContent = "Compila tutti i campi!";
        errorMsg.style.display = "block";

        // Nasconde l'errore dopo 3 secondi
        setTimeout(() => {
            errorMsg.style.display = "none";
        }, 3000);

        return;
    }

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.errore) {
            errorMsg.textContent = data.errore;
            errorMsg.style.display = "block";
        } else {
            errorMsg.textContent = "Accesso riuscito! Benvenuto " + data.nome + "!";
            errorMsg.style.color = "green"; // Cambia il colore del messaggio di errore in verde
            errorMsg.style.display = "block";

            localStorage.setItem("id", data.id);
            localStorage.setItem("user", data.nome); // Salva i dati dell'utente nel localStorage
            localStorage.setItem("is_admin", data.admin); // Salva il flag is_admin nel localStorage
            localStorage.setItem("role", data.role); // Salva il ruolo dell'utente nel localStorage
            window.location.href = "../html/homepage.html"; // Cambia la pagina se il login ha successo
        }
    })
    .catch(error => {
        errorMsg.textContent = "Errore di connessione al server!";
        errorMsg.style.display = "block";
        console.error("Errore:", error);
    });
});
