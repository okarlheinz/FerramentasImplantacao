$(document).ready(function() {
    $('.menu-link').on('click', function(event) {
        event.preventDefault(); // Evita a mudança de página padrão

        // Remove a classe 'active' de todos os links do menu
        $('.menu-link').removeClass('active');

        // Adiciona a classe 'active' apenas ao link clicado
        $(this).addClass('active');

        // Carrega o conteúdo da página correspondente usando AJAX
        var pagina = $(this).attr('href');
        $.ajax({
            url: pagina,
            success: function(data) {
                $('#conteudo').html(data);
            }
        });
    });
});
