$(document).ready(function () {
    // Oculta os submenus ao carregar a página
    $('.submenu').hide();

    $('.menu-link').on('click', function (event) {
        event.preventDefault();

        // Verifica se o link clicado é "Mais Opções"
        if ($(this).attr('id') === 'moreMenu') {
            // Mostra ou oculta o submenu correspondente
            $(this).next('.submenu').slideToggle();
        } else {
            // Se não for "Mais Opções", carrega a página correspondente
            $('.menu-link').removeClass('active');
            $(this).addClass('active');
            var href = $(this).attr('href');
            $('#conteudo').load(href);
        }
    });
});