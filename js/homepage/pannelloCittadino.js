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
