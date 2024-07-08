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

    // Gerar a senha comercial
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const date = new Date();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const password = `vcelj`;
    const passwordInfo = `Senha <strong>COMERCIAL</strong> ${month} ${year}: <span class="red-password"><i>${password}</i></span>`;
    $('#commercialPassword').html(passwordInfo);
});
