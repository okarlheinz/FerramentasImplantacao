// Função para ocultar a mensagem de sucesso após um período de tempo
function hideSuccessMessage() {
    $('#successMessage').fadeOut();
}

$(document).ready(function () {
    // Função para carregar os dados da tabela
    function loadTableData() {
        $.getJSON('json/downloads.json', function (data) {
            var tableBody = $('#downloadsTable');
            tableBody.empty(); // Limpa a tabela antes de adicionar novos dados
            $.each(data, function (index, item) {
                var row = $('<tr>').appendTo(tableBody).addClass('highlight-row'); // Adicionando classe para destacar a linha
                $('<td>').text(item.arquivo).appendTo(row); // Alterado para "arquivo"
                $('<td>').html('<a href="' + item.link + '" target="_blank">Download</a>').appendTo(row); // Abre em uma nova guia
            });
        });
    }

    // Carrega os dados da tabela na inicialização
    loadTableData();

});
