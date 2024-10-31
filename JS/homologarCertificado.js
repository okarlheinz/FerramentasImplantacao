// Carrega o JSON de cidades (certifique-se de que está acessível ao JavaScript)
let ibgeCodes;

fetch("/JSON/ibge_cidades.json")
  .then((response) => response.json())
  .then((data) => {
    ibgeCodes = data;
  })
  .catch((error) => {
    console.error("Erro ao carregar o JSON de códigos IBGE:", error);
  });

function generateCommand() {
  const nomefantasia = document
    .getElementById("nomefantasia")
    .value.toUpperCase();
  const razaosocial = document
    .getElementById("razaosocial")
    .value.toUpperCase();
  const cnpj = document.getElementById("cnpj").value.toUpperCase();
  const inscest = document.getElementById("inscest").value.toUpperCase();
  const cep = document.getElementById("cep").value.toUpperCase();
  const logradouro = document.getElementById("logradouro").value.toUpperCase();
  const numero = document.getElementById("numero").value.toUpperCase();
  const bairro = document.getElementById("bairro").value.toUpperCase();
  const complemento = document
    .getElementById("complemento")
    .value.toUpperCase();
  const cidade = document.getElementById("cidade").value.toUpperCase();
  const estado = document.getElementById("estado").value.toUpperCase();
  const idToken = document
    .getElementById("idtoken")
    .value.toUpperCase();
  const CSC = document
    .getElementById("csc")
    .value.toUpperCase();

  if (!nomefantasia || !razaosocial || !cnpj) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  // Dicionário de estados
  const estados = {
    AC: "ACRE",
    AL: "ALAGOAS",
    AP: "AMAPÁ",
    AM: "AMAZONAS",
    BA: "BAHIA",
    CE: "CEARÁ",
    DF: "DISTRITO FEDERAL",
    ES: "ESPÍRITO SANTO",
    GO: "GOIÁS",
    MA: "MARANHÃO",
    MT: "MATO GROSSO",
    MS: "MATO GROSSO DO SUL",
    MG: "MINAS GERAIS",
    PA: "PARÁ",
    PB: "PARAÍBA",
    PR: "PARANÁ",
    PE: "PERNAMBUCO",
    PI: "PIAUÍ",
    RJ: "RIO DE JANEIRO",
    RN: "RIO GRANDE DO NORTE",
    RS: "RIO GRANDE DO SUL",
    RO: "RONDÔNIA",
    RR: "RORAIMA",
    SC: "SANTA CATARINA",
    SP: "SÃO PAULO",
    SE: "SERGIPE",
    TO: "TOCANTINS",
  };

  const regional = estados[estado] || estado;


  // Buscar o código IBGE da cidade
  const cidadeEntry = ibgeCodes.find(
    (entry) => entry.Nome.toUpperCase() === cidade && entry.Uf === estado
  );
  const codMunicip = cidadeEntry ? cidadeEntry.Codigo : null;

  if (!codMunicip) {
    alert("Código IBGE da cidade não encontrado.");
    return;
  }

  // Comando de inserção com CodMunicip
  const updateEmpresa = `
UPDATE EMPRESA SET
NOMEFANTASIA='${nomefantasia}',
RAZAOSOCIAL='${razaosocial}',
CNPJ='${cnpj}',
INSCEST='${inscest}',
CEP='${cep}',
LOGRADOURO='${logradouro}',
NUMERO='${numero}',
BAIRRO='${bairro}',
COMPLEMENTO='${complemento}',
CIDADE='${cidade}',
ESTADO='${estado}',
CODMUNICIP='${codMunicip}'
`;

  const updateConfiguracao = `
update configuracao set idtoken='${idToken}', token='${CSC}'
`;

  const updateHistoricoNF = `
UPDATE HISTORICONF SET 
PENDENTE='0',IDNOTANFE='',
NRECIBONFE='',NPROTOCOLONFE='', 
DTEMISSAO=(select Convert(varchar(10),getdate(),3)), 
DTSAIDA=(select Convert(varchar(10),getdate(),3)),
datahoraEmissao=(select getdate())
`;

  const updateNotaAvulsa = `
update NOTAAVULSA set dataNotaAvulsa=GETDATE() where dataNotaAvulsa in 
(select top 10 dataNotaAvulsa from NOTAAVULSA order by dataNotaAvulsa desc)
`;

  const updateVenda = `
update venda set dataVenda=GETDATE() where idvenda in 
(select idoperacao from historiconf)
    `;

  const output =
    "-- OBS: ESTE COMANDO DEVERÁ SER UTILIZADO APENAS NO BANCO DE DADOS DE HOMOLOGAÇÃO. CONSULTE O SETOR DE IMPLANTAÇÃO" +
    "\n\n" +
    updateEmpresa +
    "go" +
    updateConfiguracao +
    "go" +
    updateHistoricoNF +
    "go" +
    updateNotaAvulsa + 
    "go" +
    updateVenda;

  document.getElementById("commandOutput").value = output.trim();
  document.getElementById("copyCommandButton").style.display = "inline";
}

function copyCommandToClipboard() {
  const outputText = document.getElementById("commandOutput").value;
  navigator.clipboard.writeText(outputText).then(
    function () {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Comando copiado para área de transferencia!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    function (err) {
      console.error("Erro ao copiar texto: ", err);
    }
  );
}


function showAlert() {
  const alertBox = $("#floatingNotification");
  alertBox.addClass("show");
  setTimeout(function () {
    alertBox.removeClass("show");
  }, 5000); // 5 segundos
}

$(document).ready(function () {
  setTimeout(() => {
    // Máscara para o CNPJ
    $("#cnpj").inputmask("99.999.999/9999-99");

    // Limpeza dos campos para apenas números
    $("#fone, #celular, #cep").on("input", function () {
      var valor = $(this).val().replace(/\D/g, "");
      $(this).val(valor);
    });

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
              $("#nomefantasia").val(data.fantasia.toUpperCase());
              $("#razaosocial").val(data.nome.toUpperCase());
              $("#logradouro").val(data.logradouro.toUpperCase());
              $("#numero").val(data.numero.toUpperCase());
              $("#cep").val(data.cep.toUpperCase().replace(/\D/g, ""));
              $("#complemento").val(data.complemento.toUpperCase());
              $("#bairro").val(data.bairro.toUpperCase());
              $("#cidade").val(data.municipio.toUpperCase());
              $("#estado").val(data.uf.toUpperCase());
              $("#email").val(data.email.toUpperCase());
              $("#fone").val(data.telefone.toUpperCase().replace(/\D/g, ""));
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
  }, 500);
});
