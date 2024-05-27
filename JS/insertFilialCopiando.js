$(document).ready(function() {
 

    $("#gerarComandoBtn").click(function() {
        // Capturando os valores dos campos do formulário
        var idFilial = $("#idFilial").val();
        var nomeFantasia = $("#nomeFantasia").val();
        var idFilialOrig = $("#idFilialOrig").val();
            
        console.log("Dados do formulário:", { idFilial, nomeFantasia, idFilialOrig });  // Depuração
    
        // Montando o comando SQL
        var comando = "INSERT INTO FILIAL (idFilial,status, regional, subregional, nomeFantasia,cnpj,inscEst,razaoSocial,logradouro,numero,\r\ncomplemento,bairro,cidade,estado,cep,fone,ramal,fax,email, matriz, caixaLoja, nomeGeral, filiaisPendentes) " +
            "\r\nSelect " + 
            "'" + idFilial + "', status, regional, subregional,'" + nomeFantasia + "',cnpj,inscEst,razaoSocial,logradouro, numero,complemento,\r\nbairro,cidade,estado,cep,fone,ramal,fax,email, 0 ,\r\n" +
            "'CXID" + idFilial + "LJ', nomeGeral, filiaisPendentes from filial where idfilial=" + idFilialOrig + "\r\n" +
            "GO \r\n" +
            "INSERT INTO CAIXA (CAIXA,STATUS,SALDO) SELECT CAIXALOJA,'1',0 FROM FILIAL WHERE IDFILIAL=" + idFilial + "; \r\n" +
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
