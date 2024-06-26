$(document).ready(function() {
    $(document).on('click', '#gerarSenhaBtn', function() {
        var quantidade = $('#quantidade').val();
        var letrasMaiusculas = $('#letrasMaiusculas').is(':checked');
        var letrasMinusculas = $('#letrasMinusculas').is(':checked');
        var numeros = $('#numeros').is(':checked');
        var caracteresEspeciais = $('#caracteresEspeciais').is(':checked');

        var caracteres = '';
        if (letrasMaiusculas) caracteres += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (letrasMinusculas) caracteres += 'abcdefghijklmnopqrstuvwxyz';
        if (numeros) caracteres += '0123456789';
        if (caracteresEspeciais) caracteres += '!@#$%^&*()_+{}[]|:;"\'<>,.?/~';

        var senha = '';
        for (var i = 0; i < quantidade; i++) {
            senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }

        $('#senhaGerada').html('<h4>Senha Gerada:</h4><input type="text" class="form-control" id="senhaInput" value="' + senha + '">');
        $('#copiarSenhaBtn').show();
    });

    $(document).on('click', '#copiarSenhaBtn', function() {
        var senha = $('#senhaInput').val();
        var tempInput = $('<input>');
        $('body').append(tempInput);
        tempInput.val(senha).select();
        document.execCommand('copy');
        tempInput.remove();
        
        $('.alert-custom').show().delay(3000).fadeOut();
    });

    $(document).on('click', '.alert-custom .close', function() {
        $(this).parent().hide();
    });
});
