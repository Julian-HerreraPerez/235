window.onload = (e) => {
    document.querySelector("#search").onclick = searchButtonClicked,
        document.querySelector("#fav-button").onclick = favoriteOnClick,
        document.querySelector("#deltFav-button").onclick = deleteOnClick;
}


document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);

    const saved = localStorage.getItem('Favorites');
    if (saved) {
        document.querySelector('.favorites-container').innerHTML = saved;
    }

    const savedTitles = localStorage.getItem("FavoriteTitles");
    if (savedTitles) {
        document.querySelector('#list-favs').innerHTML = savedTitles;
        const select = document.querySelector("#list-favs");
        M.FormSelect.init(select);
    }
});

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

    if (limit.value == 5) {
        url += "&query[term][is_public_domain]=true";
    }
    if (limit.value == 10) {
        url += "&query[term][classification_titles.keyword]=sculpture";

    }
    if (limit.value == 15) {
        url += "&query[term][classification_titles.keyword]=modern%20and%20contemporary%20art";
    }
    if (limit.value == 20) {
        url += "&query[term][classification_titles.keyword]=painting";
    }


    console.log(url);

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

    container.classList.add("carousel");
    container.innerHTML = "";

    for (let i = 0; i < imageURLS.length; i++) {
        let line = `
        <a class="carousel-item" data-title="${resultsTitle[i]}">
        <img src="${imageURLS[i]}" alt="Art Image ${i + 1}" onclick="enlargeImg(this)">
        <p>${resultsTitle[i]}</p>
        </a>
        `;
        container.innerHTML += line;
    }

    var elems = document.querySelectorAll('.carousel');
    M.Carousel.init(elems, {
        fullWidth: false,
        indicators: false
    });

    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return;
        }

        let instance = M.Carousel.getInstance(document.querySelector('.carousel'));
        if (!instance) return;

        switch (event.key) {
            case "ArrowLeft":
                instance.prev();
                break;
            case "ArrowRight":
                instance.next();
                break;
        }
    });
}

function enlargeImg(imgElemt) {
    if (!imgElemt.classList.contains("zoomed")) {
        imgElemt.classList.add("zoomed");

    }
    else {
        imgElemt.classList.remove("zoomed");
    }

}


function favoriteOnClick() {
    let instance = M.Carousel.getInstance(document.querySelector('.carousel'));
    if (!instance) return;


    let favContainer = document.querySelector(".favorites-container");
    if (!favContainer) return;
    let activeImg = document.querySelector(".carousel-item.active img");
    let activeImgTitle = document.querySelector(".carousel-item.active");
    if (!activeImg) return;
    let imgURL = activeImg.src;
    let Title = activeImgTitle.dataset.title;

    let alreadyAdded = favContainer.querySelector(`img[src="${imgURL}"]`);
    if (alreadyAdded) {
        return;
    }

    let line = `
                    <a class="favorite-item">
                        <img src="${imgURL}" />
                        <p>${Title}</p>
                    </a>
                `;
    favContainer.innerHTML += line;

    const divToSave = document.querySelector('.favorites-container');
    localStorage.setItem('Favorites', divToSave.innerHTML);

    const select = document.querySelector("#list-favs");
    const option = document.createElement("option")
    option.textContent = Title;
    option.value = Title;
    select.appendChild(option);

    localStorage.setItem("FavoriteTitles", select.innerHTML);

    M.FormSelect.init(select);


}

function deleteOnClick() {
    const select = document.querySelector("#list-favs");
    const value = select.value.trim();
    const saved = document.querySelector('.favorites-container');

    if (!saved) return;

    const items = saved.querySelectorAll(".favorite-item");

    for (let item of items) {
        const title = item.querySelector("p").textContent.trim();

        if (title == value) {
            item.remove();
            select.remove(select.selectedIndex);

            localStorage.setItem('Favorites', saved.innerHTML);
            localStorage.setItem("FavoriteTitles", select.innerHTML);
            M.FormSelect.init(select);
            return;
        }
    }
}





