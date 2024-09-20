$(document).ready(function () {
  setTimeout(function () {
    $("#cnpj").mask("00.000.000/0000-00", { reverse: true });

    $("#cnpj").on("blur", function () {
      var cnpj = $("#cnpj")
        .val()
        .replace(/[^\d]+/g, ""); // Remove máscara para enviar o CNPJ puro

      if (cnpj.length === 14) {
        // Valida se o CNPJ tem 14 dígitos
        $.ajax({
          url: `https://www.receitaws.com.br/v1/cnpj/${cnpj}`,
          method: "GET",
          dataType: "jsonp",
          success: function (data) {
            if (data.status === "OK") {
              // Preenche os campos com os dados retornados
              $("#nomeFantasia").val(data.fantasia.toUpperCase());
              $("#razaoSocial").val(data.nome.toUpperCase());
              $("#logradouro").val(data.logradouro.toUpperCase());
              $("#numero").val(data.numero.toUpperCase());
              $("#cep").val(data.cep.toUpperCase().replace(/\D/g, ""));
              $("#complemento").val(data.complemento.toUpperCase());
              $("#bairro").val(data.bairro.toUpperCase());
              $("#cidade").val(data.municipio.toUpperCase());
              $("#estado").val(data.uf.toUpperCase());
              $("#email").val(data.email.toUpperCase());
              $("#fone").val(data.telefone.toUpperCase().replace(/\D/g, ""));
              // Adicione outros campos conforme o retorno da API
            } else {
              Swal.fire({
                title: "Erro!",
                text: "CNPJ não encontrado.",
                icon: "error",
              });
            }
          },
          error: function () {
            Swal.fire({
              title: "Erro!",
              text: "Erro ao buscar dados do CNPJ.",
              icon: "error",
            });
          },
        });
      } else {
        Swal.fire({
          title: "Erro!",
          text: "CNPJ Inválido.",
          icon: "error",
        });
      }
    });

    $("#buscarCepButton").click(function () {
      var cep = $("#cep").val().replace(/\D/g, ""); // Remove caracteres não numéricos
      if (cep !== "") {
        var validacep = /^[0-9]{8}$/;
        if (validacep.test(cep)) {
          $.getJSON(
            "https://viacep.com.br/ws/" + cep + "/json/?callback=?",
            function (dados) {
              if (!("erro" in dados)) {
                $("#logradouro").val(dados.logradouro.toUpperCase());
                $("#bairro").val(dados.bairro.toUpperCase());
                $("#cidade").val(dados.localidade.toUpperCase());
                $("#estado").val(dados.uf.toUpperCase());
                $("#complemento").val(dados.complemento.toUpperCase());
                $("#numero").val("");
                $("#numero").focus();
              } else {
                alert("CEP não encontrado.");
              }
            }
          );
        } else {
          alert("Formato de CEP inválido.");
        }
      }
    });

    // ANTIGO BUSCADOR DE CEP COM O BLUR
    // $("#cep").blur(function () {
    //   var cep = $(this).val().replace(/\D/g, "");
    //   console.log("CEP:", cep);
    //   if (cep != "") {
    //     var validacep = /^[0-9]{8}$/;
    //     if (validacep.test(cep)) {
    //       $.getJSON(
    //         "https://viacep.com.br/ws/" + cep + "/json/?callback=?",
    //         function (dados) {
    //           console.log("Dados do CEP:", dados);
    //           if (!("erro" in dados)) {
    //             $("#logradouro").val(dados.logradouro.toUpperCase());
    //             $("#bairro").val(dados.bairro.toUpperCase());
    //             $("#cidade").val(dados.localidade.toUpperCase());
    //             $("#estado").val(dados.uf.toUpperCase());
    //             $("#complemento").val(dados.complemento.toUpperCase());
    //             $("#numero").val("");
    //             $("#numero").focus();
    //           } else {
    //             alert("CEP não encontrado.");
    //           }
    //         }
    //       );
    //     } else {
    //       alert("Formato de CEP inválido.");
    //     }
    //   }
    // });

    var estados = {
      AC: "Acre",
      AL: "Alagoas",
      AP: "Amapá",
      AM: "Amazonas",
      BA: "Bahia",
      CE: "Ceará",
      DF: "Distrito Federal",
      ES: "Espírito Santo",
      GO: "Goiás",
      MA: "Maranhão",
      MT: "Mato Grosso",
      MS: "Mato Grosso do Sul",
      MG: "Minas Gerais",
      PA: "Pará",
      PB: "Paraíba",
      PR: "Paraná",
      PE: "Pernambuco",
      PI: "Piauí",
      RJ: "Rio de Janeiro",
      RN: "Rio Grande do Norte",
      RS: "Rio Grande do Sul",
      RO: "Rondônia",
      RR: "Roraima",
      SC: "Santa Catarina",
      SP: "São Paulo",
      SE: "Sergipe",
      TO: "Tocantins",
    };

    $("#gerarComandoBtn").click(function () {
      var idFilial = $("#idFilial").val().toUpperCase();
      var nomeFantasia = $("#nomeFantasia").val().toUpperCase();
      var cnpj = $("#cnpj").val().toUpperCase();
      var inscEst = $("#inscEst").val().toUpperCase();
      var razaoSocial = $("#razaoSocial").val().toUpperCase();
      var logradouro = $("#logradouro").val().toUpperCase();
      var numero = $("#numero").val().toUpperCase();
      var complemento = $("#complemento").val().toUpperCase();
      var bairro = $("#bairro").val().toUpperCase();
      var cidade = $("#cidade").val().toUpperCase();
      var estadoSigla = $("#estado").val().toUpperCase();
      var cep = $("#cep").val().toUpperCase();
      var fone = $("#fone").val().toUpperCase();
      var email = $("#email").val().toUpperCase();
      var caixaLoja = $("#caixaLoja").val().toUpperCase();
      var nomeGeral = $("#nomeGeral").val().toUpperCase();

      var estadoNome = estados[estadoSigla].toUpperCase();

      console.log("Dados do formulário:", {
        idFilial,
        nomeFantasia,
        cnpj,
        inscEst,
        razaoSocial,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estadoSigla,
        estadoNome,
        cep,
        fone,
        email,
        caixaLoja,
        nomeGeral,
      });

      var comando =
        "INSERT INTO filial (idFilial,regional,subregional,nomeFantasia,cnpj,inscEst,razaoSocial,logradouro,numero,complemento,bairro,cidade,estado,cep,fone,ramal,fax,email,caixaLoja,status,matriz,NOMEGERAL,filiaispendentes,filiaispendentes1) " +
        "VALUES (" +
        "'" +
        idFilial +
        "', \r\n" +
        "'" +
        estadoNome +
        "', \r\n" +
        "'" +
        cidade +
        "', \r\n" +
        "'" +
        nomeFantasia +
        "', \r\n" +
        "'" +
        cnpj +
        "', \r\n" +
        "'" +
        inscEst +
        "', \r\n" +
        "'" +
        razaoSocial +
        "', \r\n" +
        "'" +
        logradouro +
        "', \r\n" +
        "'" +
        numero +
        "', \r\n" +
        "'" +
        complemento +
        "', \r\n" +
        "'" +
        bairro +
        "', \r\n" +
        "'" +
        cidade +
        "', \r\n" +
        "'" +
        estadoSigla +
        "', \r\n" +
        "'" +
        cep +
        "', \r\n" +
        "'" +
        fone +
        "', \r\n" +
        "'', \r\n" +
        "'', \r\n" +
        "'" +
        email +
        "', \r\n" +
        "'" +
        caixaLoja +
        "', \r\n" +
        "'1', \r\n" +
        "'0', \r\n" +
        "'" +
        nomeGeral +
        "', \r\n" +
        "'0', \r\n" +
        "'0'); \r\n" +
        "GO \r\n" +
        "INSERT INTO CAIXA (CAIXA,STATUS,SALDO) SELECT '" +
        caixaLoja +
        "','1',0 FROM FILIAL WHERE IDFILIAL='" +
        idFilial +
        "'; \r\n" +
        "GO \r\n" +
        "INSERT INTO filialEstoque (prodCodigo,idFilial,qtdDisp,qtdEst,qtdReserv,qtdAssist,qtdPed,entradas,saidas,filiaisPendentes,qtddispbal,qtdconsignacao,qtddev,qtdinicio) SELECT codigograde,'" +
        idFilial +
        "',0,0,0,0,0,0,0,0,0,0,0,0 FROM gradeprod; \r\n" +
        "GO \r\n" +
        "UPDATE FILIAL SET filiaispendentes=filiaispendentes | (SELECT (POWER(2,(SELECT MAX(idfilial)-1 FROM filial))*2)-2) WHERE IDFILIAL='" +
        idFilial +
        "';";

      $("#resultado").text(comando);
    });

    $("#copiarResultadoBtn").click(function () {
      var resultadoText = $("#resultado").text();
      var tempInput = $("<textarea>");
      $("body").append(tempInput);
      tempInput.val(resultadoText).select();
      document.execCommand("copy");
      tempInput.remove();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Comando copiado para área de transferencia!",
        showConfirmButton: false,
        timer: 1500,
      });
    });

    $(".alert button.close").click(function () {
      $(".alert").fadeOut();
    });
  }, 500); // Adiciona um atraso de 500ms
});
