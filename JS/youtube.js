$(document).ready(function() {
    $.getJSON("/JSON/videos.json", function(data) {
        let videosContainer = $("#videos-container");
        data.forEach(function(video) {
            // Extrair o ID do vídeo do URL
            let videoId = video.url.split('v=')[1] || video.url.split('/').pop();
            let videoCard = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <iframe class="card-img-top" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        <div class="card-body">
                            <h5 class="card-title">${video.title}</h5>
                        </div>
                    </div>
                </div>
            `;
            videosContainer.append(videoCard);
        });
    });
});
