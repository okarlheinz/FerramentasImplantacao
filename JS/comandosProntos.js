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

    // Função para gerar o comando com base no exemplo selecionado
    function gerarComando(exemplo) {
        switch (exemplo) {
            case "GradeProdCorrecao":
                return "INSERT INTO gradeProd (codigoBase,codigoCor,codigoTamanho,codigoGrade,codigoBarra,filiaisPendentes,descricaoGrade,gradeVendaPrc,gradeQtdMinima,gradeAtivo,GRADEDATAINCLUSAO) SELECT codigo, '0', '0', codigo, codigoBarraProduto, 0, descricao, vendaprc, 0, '1', DATAINCLUSAO FROM produto WHERE codigo NOT IN (SELECT codigograde FROM gradeprod)";
            case "FilialEstoqueCorrecao":
                return "insert into filialEstoque (prodCodigo,idFilial,qtdDisp,qtdEst,qtdReserv,qtdAssist,qtdPed, entradas,saidas,filiaisPendentes,qtddispbal,qtdconsignacao,qtddev,qtdinicio) select codigograde,?,0,0,0,0,0,0,0,0,0,0,0,0 from gradeprod where codigograde not in (select prodCodigo from filialEstoque where idfilial=?)";
            case "FiliaisPendentes":
                return "update TABELA set filiaispendentes=filiaispendentes | (select (power(2,(select max(idfilial)-1 from filial))*2)-2)"
            default:
                return "";
        }
    }
});