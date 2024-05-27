$(document).ready(function() {
    // Máscara para o CNPJ
    $('#cnpj').mask('00.000.000/0000-00', {reverse: true});

    // Função para buscar endereço pelo CEP
    $('#cep').blur(function() {
        var cep = $(this).val().replace(/\D/g, '');
        console.log("CEP:", cep);  // Adicione esta linha para depuração
        if (cep != "") {
            var validacep = /^[0-9]{8}$/;
            if (validacep.test(cep)) {
                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function(dados) {
                    console.log("Dados do CEP:", dados);  // Adicione esta linha para depuração
                    if (!("erro" in dados)) {
                        $('#logradouro').val(dados.logradouro);
                        $('#bairro').val(dados.bairro);
                        $('#cidade').val(dados.localidade);
                        $('#estado').val(dados.uf);
                        $('#complemento').val(dados.complemento);
                        $('#numero').val('');
                        $('#numero').focus();
                    } else {
                        alert("CEP não encontrado.");
                    }
                });
            } else {
                alert("Formato de CEP inválido.");
            }
        }
    });
    

    $("#gerarComandoBtn").click(function() {
        // Capturando os valores dos campos do formulário
        var idFilial = $("#idFilial").val();
        var nomeFantasia = $("#nomeFantasia").val();
        var cnpj = $("#cnpj").val();
        var inscEst = $("#inscEst").val();
        var razaoSocial = $("#razaoSocial").val();
        var logradouro = $("#logradouro").val();
        var numero = $("#numero").val();
        var complemento = $("#complemento").val();
        var bairro = $("#bairro").val();
        var cidade = $("#cidade").val();
        var estado = $("#estado").val();
        var cep = $("#cep").val();
        var fone = $("#fone").val();
        var email = $("#email").val();
        var caixaLoja = $("#caixaLoja").val();
        var nomeGeral = $("#nomeGeral").val();
    
        console.log("Dados do formulário:", { idFilial, nomeFantasia, cnpj, inscEst, razaoSocial, logradouro, numero, complemento, bairro, cidade, estado, cep, fone, email, caixaLoja, nomeGeral });  // Adicione esta linha para depuração
    
        // Montando o comando SQL
        var comando = "INSERT INTO filial (idFilial,regional,subregional,nomeFantasia,cnpj,inscEst,razaoSocial,logradouro,numero,complemento,bairro,cidade,estado,cep,fone,ramal,fax,email,caixaLoja,status,matriz,NOMEGERAL,filiaispendentes,filiaispendentes1) " +
            "VALUES (" +
            "'" + idFilial + "', \r\n" +
            "'" + estado + "', \r\n" +
            "'" + cidade + "', \r\n" +
            "'" + nomeFantasia + "', \r\n" +
            "'" + cnpj + "', \r\n" +
            "'" + inscEst + "', \r\n" +
            "'" + razaoSocial + "', \r\n" +
            "'" + logradouro + "', \r\n" +
            "'" + numero + "', \r\n" +
            "'" + complemento + "', \r\n" +
            "'" + bairro + "', \r\n" +
            "'" + cidade + "', \r\n" +
            "'" + estado + "', \r\n" +
            "'" + cep + "', \r\n" +
            "'" + fone + "', \r\n" +
            "'', \r\n" +
            "'', \r\n" +
            "'" + email + "', \r\n" +
            "'" + caixaLoja + "', \r\n" +
            "'1', \r\n" +
            "'0', \r\n" +
            "'" + nomeGeral + "', \r\n" +
            "'0', \r\n" +
            "'0'); \r\n" +
            "GO \r\n" +
            "INSERT INTO CAIXA (CAIXA,STATUS,SALDO) SELECT '" + caixaLoja + "','1',0 FROM FILIAL WHERE IDFILIAL='" + idFilial + "'; \r\n" +
            "GO \r\n" +
            "INSERT INTO filialEstoque (prodCodigo,idFilial,qtdDisp,qtdEst,qtdReserv,qtdAssist,qtdPed,entradas,saidas,filiaisPendentes,qtddispbal,qtdconsignacao,qtddev,qtdinicio) SELECT codigograde,'" + idFilial + "',0,0,0,0,0,0,0,0,0,0,0,0 FROM gradeprod; \r\n" +
            "GO \r\n" +
            "UPDATE FILIAL SET filiaispendentes=filiaispendentes | (SELECT (POWER(2,(SELECT MAX(idfilial)-1 FROM filial))*2)-2) WHERE IDFILIAL='" + idFilial + "';";
    
        $("#resultado").text(comando);
    });
    

    $("#copiarResultadoBtn").click(function() {
        var resultadoText = $("#resultado").text();
        var tempInput = $("<textarea>");  // Alterado para textarea para preservar quebras de linha
        $("body").append(tempInput);
        tempInput.val(resultadoText).select();
        document.execCommand("copy");
        tempInput.remove();
        alert("Comando copiado para a área de transferência!");
    });
});
