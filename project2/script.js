window.onload = (e) => { document.querySelector("#search").onclick = searchButtonClicked };


function searchButtonClicked() {
    const ART_URL_SEARCH = "https://api.artic.edu/api/v1/artworks/search"
    const ART_URL_Image = "https://www.artic.edu/iiif/2/";
    const ART_URL_FOOTER = "/full/843,/0/default.jpg"

    let url = ART_URL_SEARCH;


    let displayTerm = "";
    let term = document.querySelector("#searchterm").value;
    displayTerm = term = term.trim();

    term = encodeURIComponent(term);

    url += "?q=" + term;

    //console.log(url);

    fetch(url)

        .then(response => {
            if (!response.ok) throw new Error("Network error");
            return response.json();
        })
        .then(json => {
            const results = json.data;
            if (!results || !results.length) {
                console.log("No results found");
                return;
            }
            const resultsURL = results.map(item => item.api_link);
            const resultsTitle = results.map(item => item.title);

            results.forEach(item => {
                let resultsURL = (item.api_link);
            });


            Promise.all(
                resultsURL.map(link =>
                    fetch(link)
                        .then(response => response.json())
                        .then(image => ART_URL_Image + image.data.image_id + ART_URL_FOOTER)
                )
            )

                .then(imageURLS => {
                    //console.log(imageURLS)
                    display(imageURLS, resultsTitle)
                })
        })
}

function display(imageURLS, resultsTitle) {

    const container = document.querySelector("#content");
    container.innerHTML = "";
    for (let i = 0; i < imageURLS.length; i++) {
        let line = `<div class='result'>`;
        line += `<img src='${imageURLS[i]}' alt='Art Image ${i + 1}' />`;
        line += `<p>${resultsTitle[i]}</p>`
        line += `</div>`;
        container.innerHTML += line;
    }
}






