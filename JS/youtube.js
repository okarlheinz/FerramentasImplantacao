$(document).ready(function() {
    // Carregar vídeos a partir do JSON
    $.getJSON("/JSON/videos.json", function(data) {
        let videosContainer = $("#videos-container");
        
        // Função para renderizar os vídeos
        function renderVideos(videos) {
            videosContainer.empty();
            videos.forEach(function(video) {
                let videoId = video.url.split('v=')[1] || video.url.split('/').pop();
                let videoCard = `
                    <div class="col-md-4 mb-4 video-card" data-title="${video.title.toLowerCase()}">
                        <div class="card" data-video-id="${videoId}" data-video-title="${video.title}">
                            <iframe class="card-img-top" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                            <div class="card-body">
                                <h5 class="card-title">${video.title}</h5>
                            </div>
                        </div>
                    </div>
                `;
                videosContainer.append(videoCard);
            });

            // Adicionar evento de clique aos vídeos
            $('.video-card').on('click', function() {
                let videoId = $(this).find('.card').data('video-id');
                let videoTitle = $(this).find('.card').data('video-title');
                $('#videoModalLabel').text(videoTitle);
                $('#videoFrame').attr('src', `https://www.youtube.com/embed/${videoId}`);
                $('#videoModal').modal('show');
            });

            // Limpar o src do iframe quando o modal é fechado
            $('#videoModal').on('hidden.bs.modal', function () {
                $('#videoFrame').attr('src', '');
            });
        }

        // Inicialmente renderizar todos os vídeos
        renderVideos(data);

        // Função para filtrar os vídeos com base na busca
        $('#searchField').on('keyup', function () {
            var searchTerm = $(this).val().toLowerCase();
            let filteredVideos = data.filter(video => video.title.toLowerCase().includes(searchTerm));
            renderVideos(filteredVideos);
        });
    });
});
