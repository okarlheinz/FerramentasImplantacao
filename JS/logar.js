$(document).ready(function () {
    var usuarios = []; // Array para armazenar os usuários

    // Carrega os usuários do arquivo JSON
    $.getJSON("JSON/usuarios.json", function(data) {
        usuarios = data;
    });

    // Evento de clique no botão de login
    $('#login-btn').on('click', function () {
        var username = $('#username').val().toLowerCase(); // Converter para minúsculas
        var password = $('#password').val().toLowerCase(); // Converter para minúsculas

        // Verifica se o usuário e senha estão corretos
        var usuarioValido = usuarios.find(function (user) {
            return user.usuario.toLowerCase() === username && user.senha.toLowerCase() === password;
        });

        if (usuarioValido) {
            // Mostra a mensagem de boas-vindas
            var nomeUsuario = usuarioValido.usuario;
            $('#login-form').hide();
            $('#welcome-message').text('Bem-vindo(a), ' + nomeUsuario + '!');
            $('#welcome-message').show();
            $('#logout-btn').show();
        } else {
            alert('Usuário ou senha inválidos.');
        }
    });

    // Evento de clique no botão de logout
    $('#logout-btn').on('click', function () {
        // Esconde a mensagem de boas-vindas e o botão de logout
        $('#welcome-message').hide();
        $('#logout-btn').hide();
        // Mostra o formulário de login
        $('#login-form').show();
        // Limpa os campos de usuário e senha
        $('#username').val('');
        $('#password').val('');
    });

    $('.menu-link').on('click', function (event) {
        event.preventDefault();
        $('.menu-link').removeClass('active');
        $(this).addClass('active');
        var href = $(this).attr('href');
        $('#conteudo').load(href);
    });
});
