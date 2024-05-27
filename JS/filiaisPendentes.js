$(document).ready(function () {
    $("#gerarFiliaisPendentesBtn").click(function () {
        var idFilial = $("#idFilial").val();
        var tabela = $("#tabela").val();
        var valorSubstituicao = calcularValorSubstituicao(idFilial);

        if (idFilial === "") {
            alert("Por favor, insira o ID da filial.");
            return;
        }

        if (isNaN(idFilial) || idFilial <= 0 || idFilial > 999) {
            alert("O ID da filial deve ser um número entre 1 e 999.");
            return;
        }

        var comando = "update " + tabela + " set filiaisPendentes=filiaisPendentes | " + valorSubstituicao;

        switch (tabela) {
            case "forma":
                comando += " where tipo<>'2'";
                break;
            case "conta":
                comando += " where contaFilial='1'";
                break;
            case "centroCusto":
                comando += " where centroFilial='1'";
                break;
            case "filialEstoque":
                comando += " where qtddisp<>0";
                break;
            case "funcionario":
            case "funcionarioCaixa":
            case "cliente":
            case "grupo":
            case "cor":
            case "tamanho":
            case "produto":
            case "gradeProd":
            case "fornecedor":
            case "composicaoprod":
            case "transportador":
                comando;
                break;
            default:
                alert("Tabela inválida.");
                return;
        }

        comando += "\ngo";

        $("#resultado").text(comando);
        $("#copiarResultadoBtn").show(); // Mostra o botão de copiar resultado
    });

    $(document).on('click', '#copiarResultadoBtn', function() {
        var resultado = $('#resultado').text();
        var tempInput = $('<textarea>'); // Alterado para textarea para preservar quebras de linha
        $('body').append(tempInput);
        tempInput.val(resultado).select();
        document.execCommand('copy');
        tempInput.remove();
        alert('Resultado copiado para a área de transferência!');
    });
    
    function calcularValorSubstituicao(idFilial) {
        return Math.pow(2, parseInt(idFilial) - 1);
    }
});
