$(document).ready(function() {
    $("#gerarComandoBtn").click(function() {
        var idFilial = $("#idFilial").val();
        var nomeFantasia = $("#nomeFantasia").val();
        
        if (!idFilial || !nomeFantasia) {
            alert("Por favor, preencha todas as informações.");
            return;
        }

        var comando = `
delete from contasreceber where idfilial<>'${idFilial}'
go
delete from contaspagar where idfilial<>'${idFilial}'
go
delete from lancamentobanco where idfilial<>'${idFilial}'
go
delete from lancamentocaixa where idfilial<>'${idFilial}'
go
delete from lancamento where idfilial<>'${idFilial}'
go
delete from vendaprod where idfilial<>'${idFilial}'
go
delete from venda where idfilial<>'${idFilial}'
go
delete from devolucaoprod where idfilial<>'${idFilial}'
go
delete from devolucao where idfilial<>'${idFilial}'
go
delete from recebimentoprod where idfilialreceb<>'${idFilial}'
go
delete from recebimentoprodvlanteriores where idfilialreceb<>'${idFilial}'
go
delete from recebimento where idfilialreceb<>'${idFilial}'
go
delete from devolucaocompraprod
go
delete from devolucaocompra
go
delete from historiconf where idfilial<>'${idFilial}'
go
delete from cotacaovendaprod where idfilial<>'${idFilial}'
go
delete from cotacaovenda where idfilial<>'${idFilial}'
go
delete from pedidocompraprod where idfilialped<>'${idFilial}'
go
delete from pedidocompra where idfilialped<>'${idFilial}'
go
delete from logcp where idfilial<>'${idFilial}'
go
delete from logCR where idfilial<>'${idFilial}'
go
delete from acertoestoqueprod where idacerto in (select idacerto from acertoestoque where nomefilial<>'${nomeFantasia}')
go
delete from acertoestoque where nomefilial<>'${nomeFantasia}'
go
delete from conferenciaprod where idfilial<>'${idFilial}'
go
delete from conferencia where idfilial<>'${idFilial}'
go
delete from consignacaoprod where idfilial<>'${idFilial}'
go
delete from LOGCONSIGNACAOPROD where idfilial<>'${idFilial}'
go
delete from consignacao where idfilial<>'${idFilial}'
go
delete from SUPRIMENTO where IDFILIAL<>'${idFilial}'
go
delete from ordemservicoprod where IDFILIAL<>'${idFilial}'
go
delete from ordemservico where IDFILIAL<>'${idFilial}'
go
delete from empresa
go
UPDATE PEDIDO_VENDA_ID SET NEW_ID=(select max(idvenda)+1 from venda where idfilial='${idFilial}')
go
INSERT INTO EMPRESA (idEmpresa,nomeFantasia,cnpj,inscEst,razaoSocial,logradouro,
numero,complemento,bairro,cidade,estado,cep,fone,ramal,fax,email,crt) select '${idFilial}', nomeFantasia,cnpj,inscEst,razaoSocial,logradouro,
numero,complemento,bairro,cidade,estado,cep,fone,ramal,fax,email,'1' from filial where idfilial='${idFilial}'
go
update configuracao set servidor='0'
        `;

        $("#resultado").val(comando.trim());
    });

    $("#copiarResultadoBtn").click(function() {
        var resultadoText = $("#resultado").val();
        var tempInput = $("<textarea>");
        $("body").append(tempInput);
        tempInput.val(resultadoText).select();
        document.execCommand("copy");
        tempInput.remove();
        $("#alerta").slideDown(); // Exibe a div de alerta
    });
});

function fecharAlerta() {
    $("#alerta").fadeOut();
}

setTimeout(function() {
    $("#alerta").slideUp(); // Esconde a div de alerta
}, 7000); // 5000 milissegundos = 5 segundos
