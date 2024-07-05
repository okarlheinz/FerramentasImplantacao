$(document).ready(function () {

    $.getJSON('../JSON/comandos.json', function (data) {
        const comandos = data;

        $('#comandosSelect').change(function () {
            const comandoSelecionado = $(this).val();
            $('#descricaoComando').val(comandos[comandoSelecionado].descricao);
        });

        // Gera o comando selecionado ao clicar no botão "Gerar Comando"
        $('#gerarComandoBtn').click(function () {
            const comandoSelecionado = $('#comandosSelect').val();
            const comandoGerado = comandos[comandoSelecionado].comando;
            $('#comandoGerado').val(comandoGerado);
        });
    });

    // Copia o comando gerado para a área de transferência ao clicar no botão "Copiar Comando"
    $('#copiarComandoBtn').click(function () {
        const comandoGerado = $('#comandoGerado').val();
        navigator.clipboard.writeText(comandoGerado);
        $('.alert').fadeIn().delay(2000).fadeOut();
    });

    // Fecha a mensagem de alerta ao clicar no botão "X"
    $('.alert button.close').click(function () {
        $('.alert').fadeOut();
    });
});