$(document).ready(function() {
    $.getJSON("/JSON/videos.json", function(data) {
        let videosContainer = $("#videos-container");
        data.forEach(function(video) {
            // Extrair o ID do vídeo do URL
            let videoId = video.url.split('v=')[1] || video.url.split('/').pop();
            let videoCard = `
                <div class="col-md-4 mb-4">
                    <div class="card video-card" data-video-id="${videoId}" data-video-title="${video.title}">
                        <iframe class="card-img-top" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        <div class="card-body">
                            <h5 class="card-title">${video.title}</h5>
                        </div>
                    </div>
                </div>
            `;
            videosContainer.append(videoCard);
        });

        // Adicionar evento de clique aos cards
        $('.video-card').on('click', function() {
            let videoId = $(this).data('video-id');
            let videoTitle = $(this).data('video-title');
            $('#videoModalLabel').text(videoTitle);
            $('#videoFrame').attr('src', `https://www.youtube.com/embed/${videoId}`);
            $('#videoModal').modal('show');
        });

        // Limpar o src do iframe quando o modal é fechado
        $('#videoModal').on('hidden.bs.modal', function () {
            $('#videoFrame').attr('src', '');
        });
    });
});
