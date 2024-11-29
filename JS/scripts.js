$(document).ready(function () {
    $('.submenu').hide();

    $('.menu-link').on('click', function (event) {
        event.preventDefault();

        if ($(this).attr('id') === 'moreMenu') {
            $(this).next('.submenu').slideToggle();
        } else {
            $('.menu-link').removeClass('active');
            $(this).addClass('active');
            var href = $(this).attr('href');
            
            $('#conteudo').load(href, function(response, status, xhr) {
                // Verifica se a página carregada é a 'areaRestrita.html'
                if (href.includes('areaRestrita.html')) {
                    // Exibe o SweetAlert apenas para a página 'areaRestrita.html'
                    Swal.fire({
                        title: "Autenticação Necessária",
                        text: "Por favor, insira a senha para continuar:",
                        input: 'password',
                        inputPlaceholder: 'Digite a senha',
                        showCancelButton: false,
                        confirmButtonText: 'Entrar',
                        inputValidator: (value) => {
                            if (!value) {
                                return 'Você precisa digitar a senha!';
                            }
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const senha = result.value;

                            if (senha === "Z$fs05c3") { 
                                Swal.fire({
                                    title: 'Bem-vindo à Área Restrita!',
                                    text: 'Você está acessando a área restrita do site.',
                                    icon: 'info',
                                    confirmButtonText: 'Ok',
                                    timer: 1500, // 3000 milissegundos = 3 segundos
                                    timerProgressBar: true, // opcional, mostra uma barra de progresso
                                });
                                // Mostra o conteúdo da página
                                document.getElementById("pageContent").style.display = "block";
                            } else {
                                // Exibe uma mensagem de erro e recarrega a página
                                Swal.fire({
                                    icon: "error",
                                    title: "Senha incorreta!",
                                    text: "Por favor, tente novamente.",
                                }).then(() => {
                                    location.reload();
                                });
                            }
                        }
                    });
                }
            });
        }
    });
});
