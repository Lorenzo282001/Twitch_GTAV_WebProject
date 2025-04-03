document.querySelector(".register-form button").addEventListener("click", () => {
    const nome = document.getElementById("register-name").value.toLowerCase(); // Username
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const repassword = document.getElementById("register-repassword").value;
    const errorMsg = document.getElementById("register-error");

    errorMsg.style.display = "none"; // Nasconde l'errore all'inizio

    if (!nome || !email || !password || !repassword) {
        errorMsg.textContent = "Compila tutti i campi!";
        errorMsg.style.display = "block";

        // Nasconde l'errore dopo 3 secondi
        setTimeout(() => {
            errorMsg.style.display = "none";
        }, 3000);

        return;
    }

    if (password !== repassword) {
        errorMsg.textContent = "Le password non coincidono!";
        errorMsg.style.display = "block";

        // Nasconde l'errore dopo 3 secondi
        setTimeout(() => {
            errorMsg.style.display = "none";
        }, 3000);
        return;
    }

    fetch("http://localhost:3000/registrazione", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.errore) {
            errorMsg.textContent = "Errore: " + data.errore;
            errorMsg.style.display = "block";
        } else {
            alert("Registrazione riuscita!");
            document.getElementById("register-container").style.display = "none";
        }
    })
    .catch(error => {
        errorMsg.textContent = "Errore di connessione al server!";
        errorMsg.style.display = "block";
        console.error("Errore:", error);
    });
});