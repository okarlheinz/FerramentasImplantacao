function generateCommand() {
    const idempresa = document.getElementById('idempresa').value.toUpperCase();
    const nomefantasia = document.getElementById('nomefantasia').value.toUpperCase();
    const razaosocial = document.getElementById('razaosocial').value.toUpperCase();
    const cnpj = document.getElementById('cnpj').value.toUpperCase();
    const inscest = document.getElementById('inscest').value.toUpperCase();
    const cep = document.getElementById('cep').value.toUpperCase();
    const logradouro = document.getElementById('logradouro').value.toUpperCase();
    const numero = document.getElementById('numero').value.toUpperCase();
    const bairro = document.getElementById('bairro').value.toUpperCase();
    const complemento = document.getElementById('complemento').value.toUpperCase();
    const cidade = document.getElementById('cidade').value.toUpperCase();
    const estado = document.getElementById('estado').value.toUpperCase();
    const nomegeral = document.getElementById('nomegeral').value.toUpperCase();
    const fone = document.getElementById('fone').value.toUpperCase();
    const celular = document.getElementById('celular').value.toUpperCase();
    const email = document.getElementById('email').value.toUpperCase();
    const caixaloja = document.getElementById('caixaloja').value.toUpperCase();
    const empresavalidacao = document.getElementById('empresavalidacao').value.toUpperCase();
    const senhavalidacao = document.getElementById('senhavalidacao').value.toUpperCase();
    const servidor = document.getElementById('servidor').checked;
    const regime = document.getElementById('regime').value;

    if (!idempresa || !nomefantasia || !razaosocial || !cnpj) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    // Dicionário de estados
    const estados = {
        'AC': 'ACRE',
        'AL': 'ALAGOAS',
        'AP': 'AMAPÁ',
        'AM': 'AMAZONAS',
        'BA': 'BAHIA',
        'CE': 'CEARÁ',
        'DF': 'DISTRITO FEDERAL',
        'ES': 'ESPÍRITO SANTO',
        'GO': 'GOIÁS',
        'MA': 'MARANHÃO',
        'MT': 'MATO GROSSO',
        'MS': 'MATO GROSSO DO SUL',
        'MG': 'MINAS GERAIS',
        'PA': 'PARÁ',
        'PB': 'PARAÍBA',
        'PR': 'PARANÁ',
        'PE': 'PERNAMBUCO',
        'PI': 'PIAUÍ',
        'RJ': 'RIO DE JANEIRO',
        'RN': 'RIO GRANDE DO NORTE',
        'RS': 'RIO GRANDE DO SUL',
        'RO': 'RONDÔNIA',
        'RR': 'RORAIMA',
        'SC': 'SANTA CATARINA',
        'SP': 'SÃO PAULO',
        'SE': 'SERGIPE',
        'TO': 'TOCANTINS'
    };

    const regional = estados[estado] || estado;

    // Determina o valor de CRT
    let crt = '';
    if (regime === 'simples') {
        crt = '1';
    } else if (regime === 'normal') {
        crt = '3';
    }

    const insertEmpresa = `
INSERT INTO empresa (idempresa, nomefantasia, razaosocial, cnpj, inscest, cep, logradouro, numero, bairro, complemento, cidade, estado, fone, fax, email${crt ? ', crt' : ''}) 
VALUES 
(${idempresa},
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
'${fone}',
'${celular}',
'${email}',
${crt ? `'${crt}'` : ''});`;

    const insertFilial = `
INSERT INTO filial (idfilial, status, regional, subregional, nomefantasia, razaosocial, cnpj, inscest, cep, logradouro, numero, bairro, complemento, cidade, estado, nomegeral, fone, fax, email, caixaloja, filiaispendentes, matriz) 
VALUES (${idempresa},
'1',
'${regional}',
'${cidade}',
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
'${caixaloja}',
'0',
${servidor ? '1' : '0'});
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

    const updateServidor = `
UPDATE configuracao SET servidor='${servidor ? '1' : '0'}';
`;

    const output = insertEmpresa + "\ngo\n" + insertFilial + "\ngo\n" + insertCaixa + "\ngo\n" + insertEmpresaValidacao + "\ngo\n" + updateServidor;

    document.getElementById('commandOutput').value = output.trim();
    document.getElementById('copyCommandButton').style.display = 'inline';
    document.getElementById('insertFilialButton').style.display = 'inline';
}


function copyCommandToClipboard() {
    const outputText = document.getElementById('commandOutput').value;
    navigator.clipboard.writeText(outputText).then(function() {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Comando copiado para área de transferencia!",
            showConfirmButton: false,
            timer: 1500
          });
    }, function(err) {
        console.error('Erro ao copiar texto: ', err);
    });
}

function redirectToInsertFilial() {
    $('#conteudo').load('insertFilial.html');
}

function showAlert() {
    const alertBox = $('#floatingNotification');
    alertBox.addClass('show');
    setTimeout(function() {
        alertBox.removeClass('show');
    }, 5000); // 5 segundos
}

$(document).ready(function() {

    setTimeout(()=>{
            // Máscara para o CNPJ
        $('#cnpj').inputmask("99.999.999/9999-99");

        // Limpeza dos campos para apenas números
        $('#fone, #celular, #cep').on('input', function() {
            var valor = $(this).val().replace(/\D/g, '');
            $(this).val(valor);
        });


        $('#cnpj').on('blur', function() {
            var cnpj = $('#cnpj').val().replace(/[^\d]+/g,'');  // Remove máscara para enviar o CNPJ puro
    
            if (cnpj.length === 14) {  // Valida se o CNPJ tem 14 dígitos
                $.ajax({
                    url: `https://www.receitaws.com.br/v1/cnpj/${cnpj}`,
                    method: 'GET',
                    dataType: 'jsonp',
                    success: function(data) {
                        if (data.status === "OK") {
                            // Preenche os campos com os dados retornados
                            $('#nomefantasia').val(data.fantasia.toUpperCase());
                            $('#razaosocial').val(data.nome.toUpperCase());
                            $('#logradouro').val(data.logradouro.toUpperCase());
                            $('#numero').val(data.numero.toUpperCase());
                            $('#cep').val(data.cep.toUpperCase().replace(/\D/g, ''));
                            $('#complemento').val(data.complemento.toUpperCase());
                            $('#bairro').val(data.bairro.toUpperCase());
                            $('#cidade').val(data.municipio.toUpperCase());
                            $('#estado').val(data.uf.toUpperCase());
                            $('#email').val(data.email.toUpperCase());
                            $('#fone').val(data.telefone.toUpperCase().replace(/\D/g, ''));
                            // Adicione outros campos conforme o retorno da API
                        } else {
                            Swal.fire({
                                title: "Erro!",
                                text: "CNPJ não encontrado.",
                                icon: "error"
                              });
                        }
                    },
                    error: function() {
                        Swal.fire({
                            title: "Erro!",
                            text: "Erro ao buscar dados do CNPJ.",
                            icon: "error"
                          });
                    }
                });
            } else {
                Swal.fire({
                    title: "Erro!",
                    text: "CNPJ Inválido.",
                    icon: "error"
                  });
            }
        });

        $('#buscarCepButton').click(function() {
            var cep = $('#cep').val().replace(/\D/g, '');  // Remove caracteres não numéricos
            if (cep !== "") {
                var validacep = /^[0-9]{8}$/;
                if (validacep.test(cep)) {
                    $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function(dados) {
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



        // BUSCA CEP ANTIGO FUNCIONA COM O BLUR E SEM BOTÃO 

        // $('#cep').blur(function() {
        //     var cep = $(this).val();
        //     if (cep != "") {
        //         var validacep = /^[0-9]{8}$/;
        //         if (validacep.test(cep)) {
        //             $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function(dados) {
        //                 if (!("erro" in dados)) {
        //                     $('#logradouro').val(dados.logradouro.toUpperCase());
        //                     $('#bairro').val(dados.bairro.toUpperCase());
        //                     $('#cidade').val(dados.localidade.toUpperCase());
        //                     $('#estado').val(dados.uf.toUpperCase());
        //                     $('#complemento').val(dados.complemento.toUpperCase());
        //                     $('#numero').val('');
        //                     $('#numero').focus();
        //                 } else {
        //                     alert("CEP não encontrado.");
        //                 }
        //             });
        //         } else {
        //             alert("Formato de CEP inválido.");
        //         }
        //     }
        // });
    },500)
});
