$('#cep').blur(function() {
    var cep = $(this).val().replace(/\D/g, '');
    console.log("CEP:", cep);
    if (cep != "") {
        var validacep = /^[0-9]{8}$/;
        if (validacep.test(cep)) {
            $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function(dados) {
                console.log("Dados do CEP:", dados);
                if (!("erro" in dados)) {
                    $('#logradouro').val(dados.logradouro.toUpperCase());
                    $('#bairro').val(dados.bairro.toUpperCase());
                    $('#cidade').val(dados.localidade.toUpperCase());
                    $('#estado').val(dados.uf.toUpperCase());
                    $('#complemento').val(dados.complemento.toUpperCase());
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


function generateCommand() {
    const idempresa = document.getElementById('idempresa').value;
    const nomefantasia = document.getElementById('nomefantasia').value;
    const razaosocial = document.getElementById('razaosocial').value;
    const cnpj = document.getElementById('cnpj').value;
    const inscest = document.getElementById('inscest').value;
    const cep = document.getElementById('cep').value;
    const logradouro = document.getElementById('logradouro').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const complemento = document.getElementById('complemento').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const nomegeral = document.getElementById('nomegeral').value;
    const fone = document.getElementById('fone').value;
    const celular = document.getElementById('celular').value;
    const email = document.getElementById('email').value;
    const caixaloja = document.getElementById('caixaloja').value;
    const empresavalidacao = document.getElementById('empresavalidacao').value;
    const senhavalidacao = document.getElementById('senhavalidacao').value;

    if (!idempresa || !nomefantasia || !razaosocial || !cnpj) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const insertEmpresa = `
INSERT INTO empresa (idempresa, nomefantasia, razaosocial, cnpj, inscest, cep, logradouro, numero, bairro, complemento, cidade, estado, fone, fax, email) 
VALUES (${idempresa}, \r\n'${nomefantasia}',\r\n '${razaosocial}',\r\n '${cnpj}',\r\n '${inscest}',\r\n '${cep}',\r\n '${logradouro}',\r\n '${numero}',\r\n '${bairro}',\r\n '${complemento}',\r\n '${cidade}',\r\n '${estado}',\r\n '${fone}',\r\n '${celular}',\r\n '${email}');
    `;

    const insertFilial = `
INSERT INTO filial (idfilial, nomefantasia, razaosocial, cnpj, inscest, cep, logradouro, numero, bairro, complemento, cidade, estado, nomegeral, fone, fax, email, caixaloja) 
VALUES (${idempresa},
'${nomefantasia}',
'${razaosocial}',
'${cnpj}',
'${inscest}',
'${cep}',
'${logradouro}',
'${numero}',
'${bairro}',
'${complemento}',
'${cidade}',
'${estado}',
'${nomegeral}',
'${fone}',
'${celular}',
'${email}',
'${caixaloja}');
`;

    const insertCaixa = `
INSERT INTO CAIXA (CAIXA, STATUS, SALDO) 
SELECT CAIXALOJA, '1', 0 
FROM FILIAL 
WHERE IDFILIAL = ${idempresa};
`;

    const insertEmpresaValidacao = `
INSERT INTO EMPRESAVALIDACAO (FLAG, USUARIO, CHAVE) VALUES ('1','${empresavalidacao}','${senhavalidacao}')
`;

    const output = insertEmpresa + "\ngo\n" + insertFilial + "\ngo\n" + insertCaixa + "\ngo\n" + insertEmpresaValidacao;

    document.getElementById('commandOutput').value = output.trim();
    document.getElementById('copyCommandButton').style.display = 'inline';


}

function copyCommandToClipboard() {
    const outputText = document.getElementById('commandOutput').value;
    navigator.clipboard.writeText(outputText).then(function() {
        showAlert();
    }, function(err) {
        console.error('Erro ao copiar texto: ', err);
    });
}

function showAlert() {
    const alertBox = document.getElementById('floatingNotification');
    alertBox.classList.add('show');
    setTimeout(function() {
        alertBox.classList.remove('show');
    }, 5000); // 5 segundos
}
