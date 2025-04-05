$(document).ready(function() {
    // Quando si clicca su una card con la classe 'toggle-menuDashboard'
    $('.toggle-menuDashboard').click(function() {
        var menu = $(this).find('.menu'); // Trova il menu all'interno della card cliccata
        var description = $(this).find('p'); // Trova la descrizione della card
        var title = $(this).find('h2'); // Trova il titolo h2 della card

        // Nascondi tutte le altre card (menu, titolo, descrizione)
        $('.toggle-menuDashboard').not(this).each(function() {
            $(this).find('.menu').slideUp(); // Nasconde il menu
            $(this).find('p').slideDown(); // Mostra la descrizione
            $(this).find('h2').slideDown(); // Mostra il titolo
        });

        // Alterna la visibilità del menu, del titolo e della descrizione della card cliccata
        menu.slideToggle();
        title.slideToggle();
        description.slideToggle();

        
    });

    
    // Funzione per gestire il click del bottone e inviare i dati delle patenti
    $("#add_documentButton").on("click", function () {
        // Recupera le patenti già esistenti dalla funzione getPatente
        fetch(`http://localhost:3000/patente/${localStorage.getItem('id')}`)
            .then(response => response.json())
            .then(data => {
                // Se non ci sono patenti da aggiungere
                if (data.errore) {
                    console.log('Errore:', data.errore);
                    return;
                }
    
                // Verifica quale patente è selezionata
                const selectedDoc = $("#document-select").val(); // Recupera il valore dell'option selezionata
    
                // Imposta i valori per ogni patente, con il valore iniziale o aggiornato
                let patenteA = data.patente_A === 0 ? 0 : data.patente_A; // Mantieni il valore esistente o 0 se non presente
                let patenteB = data.patente_B === 0 ? 0 : data.patente_B;
                let patenteC = data.patente_C === 0 ? 0 : data.patente_C;
    
                // Se la patente selezionata non è già presente, aggiorna solo quella
                if (selectedDoc === "patente-a" && patenteA === 0) {
                    patenteA = 1; // Aggiorna solo patente A
                } else if (selectedDoc === "patente-b" && patenteB === 0) {
                    patenteB = 1; // Aggiorna solo patente B
                } else if (selectedDoc === "patente-c" && patenteC === 0) {
                    patenteC = 1; // Aggiorna solo patente C
                } else {
                    alert("La patente selezionata è già presente.");
                    return; // Non fare nulla se la patente è già stata inserita
                }
    
                // Chiamata alla funzione per inserire i dati
                inserisciDocumenti(patenteA, patenteB, patenteC);
            })
            .catch(error => {
                console.error('Errore nella richiesta:', error);
            });
    });
    
    $("#remove_documentButton").on("click", function () {
        // Recupera le patenti già esistenti dalla funzione getPatente
        fetch(`http://localhost:3000/patente/${localStorage.getItem('id')}`)
            .then(response => response.json())
            .then(data => {
                // Se non ci sono patenti da eliminare
                if (data.errore) {
                    console.log('Errore:', data.errore);
                    return;
                }
    
                // Verifica quale patente è selezionata per essere eliminata
                const selectedDoc = $("#documentRemove-select").val(); // Recupera il valore dell'option selezionata
    
                // Imposta i valori per ogni patente, con il valore esistente
                let patenteA = data.patente_A === 0 ? 0 : data.patente_A; // Mantieni il valore esistente o 0 se non presente
                let patenteB = data.patente_B === 0 ? 0 : data.patente_B;
                let patenteC = data.patente_C === 0 ? 0 : data.patente_C;
    
                // Se la patente selezionata è presente, impostala a 0 per "eliminarla"
                if (selectedDoc === "patente-a" && patenteA === 1) {
                    patenteA = 0; // Imposta patente A come "non presente"
                } else if (selectedDoc === "patente-b" && patenteB === 1) {
                    patenteB = 0; // Imposta patente B come "non presente"
                } else if (selectedDoc === "patente-c" && patenteC === 1) {
                    patenteC = 0; // Imposta patente C come "non presente"
                } else {
                    alert("La patente selezionata non è presente.");
                    return; // Non fare nulla se la patente non è presente
                }
    
                // Chiamata alla funzione per eliminare i dati
                eliminaDocumenti(patenteA, patenteB, patenteC);
            })
            .catch(error => {
                console.error('Errore nella richiesta:', error);
            });
    });


    //Carta d'identità - Recupero
    getCartaIdentita();

    //Patente - Recupero
    getPatente();
    

    // Quando si clicca su un'opzione del menu, mostra la relativa card
    $('.view-option').click(function(e) {
        e.preventDefault(); // Impedisce il comportamento predefinito del link

        var target = $(this).data('target'); // Ottieni il target della specifica card

        // Nascondi il pannello principale
        $('.dashboard').hide();

        // Mostra la specifica card relativa all'opzione cliccata
        $('#' + target).show();
    });
});

// Funzione per tornare al pannello principale
function goBack() {
    // Nascondi la card specifica
    $('.specifica-card').hide();

    // Mostra il pannello principale
    $('.dashboard').show();
}

// Funzione per fare una richiesta POST alla route /add_documets/:id
function inserisciDocumenti(patenteA, patenteB, patenteC) {

    console.log(`Patente A: ${patenteA}, Patente B: ${patenteB}, Patente C: ${patenteC}`);
    // Prepara il body JSON da inviare
    const body = {
        patente_A: patenteA,
        patente_B: patenteB,
        patente_C: patenteC
    };

    fetch(`http://localhost:3000/add_documets/${localStorage.getItem('id')}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Risposta del server:', data);
    })
    .then(() => {
        // Ricarica la pagina per aggiornare i dati 
        location.reload(); 
    })
    .catch(error => {
        console.error('❌ Errore nella richiesta:', error);
    });
}


// Funzione per fare una richiesta GET alla route /carta-identita/:id
function getCartaIdentita() {
    fetch(`http://localhost:3000/carta-identita/${localStorage.getItem('id')}`)
        .then(response => response.json())
        .then(data => {
            if (data.errore) {
                console.log('Errore:', data.errore);
            } else {
                console.log('Carta di identità recuperata:', data.carta_identita);

                $("#carta-identita").html(`${data.carta_identita}`); // Mostra i dati della carta di identità

            }
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
        });
}

// Funzione per fare una richiesta GET alla route /carta-identita/:id
function getPatente() {
    fetch(`http://localhost:3000/patente/${localStorage.getItem('id')}`)
        .then(response => response.json())
        .then(data => {
            if (data.errore) {
                console.log('Errore:', data.errore);
            } else {
                console.log(`Dati patente {\n A:${data.patente_A} \n B:${data.patente_B} \n C:${data.patente_C}\n}`);

                $("#patente-a").html(data.patente_A != 0 ? `✅` : "❌");
                $("#patente-b").html(data.patente_B != 0 ? `✅` : "❌");
                $("#patente-c").html(data.patente_C != 0 ? `✅` : "❌");

                // Rimuovi le opzioni già presenti in #document-select
                if (data.patente_A == 1) {
                    $("#document-select option[value='patente-a']").remove();  // Rimuovi da document-select
                }  
                else {
                    $("#documentRemove-select option[value='patente-a']").remove();  // Disabilita in documentRemove-select
                }

                if (data.patente_B == 1) {
                    $("#document-select option[value='patente-b']").remove();  // Rimuovi da document-select
                }
                else {
                    $("#documentRemove-select option[value='patente-b']").remove();  // Disabilita in documentRemove-select

                }

                if (data.patente_C == 1) {
                    $("#document-select option[value='patente-c']").remove();  // Rimuovi da document-select
                }
                else{
                    $("#documentRemove-select option[value='patente-c']").remove();  // Disabilita in documentRemove-select
                }

                // Se non rimane nessuna opzione, disabilita il bottone o mostra un messaggio in #document-select
                if ($("#document-select option").length === 0) {
                    $("#add_documentButton").prop("disabled", true).text("Tutte le patenti già inserite");
                }

                // Se non rimane nessuna opzione abilitata in #documentRemove-select, disabilita il bottone o mostra un messaggio
                if ($("#documentRemove-select option:not(:disabled)").length === 0) {
                    $("#remove_documentButton").prop("disabled", true).text("Tutte le patenti sono state rimosse");
                }
            }
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
        });
}

function eliminaDocumenti(patenteA, patenteB, patenteC) {
    const body = {
        patente_A: patenteA,
        patente_B: patenteB,
        patente_C: patenteC
    };

    // Fai una richiesta POST per eliminare la patente selezionata
    fetch(`http://localhost:3000/elimina_patente/${localStorage.getItem('id')}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Patente eliminata con successo!');
            // Puoi aggiornare la pagina o i dati dopo l'eliminazione
            window.location.reload();
        } else {
            console.log('Errore:', data.errore);
            alert('Errore durante l\'eliminazione della patente.');
        }
    })
    .catch(error => {
        console.error('Errore nella richiesta:', error);
    });
}
