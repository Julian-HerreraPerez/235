window.onload = (e) => {
    document.querySelector("#search").onclick = searchButtonClicked,
        document.querySelector("#fav-button").onclick = favoriteOnClick,
        document.querySelector("#description-button").onclick = minimizeOnClick,
        document.querySelector("#deltFav-button").onclick = deleteOnClick;
}


document.addEventListener('DOMContentLoaded', function () {
    const elems = document.querySelectorAll('select');
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

    const savedSearch = localStorage.getItem("Search");
    if (savedSearch) {
        document.querySelector("#searchterm").value = savedSearch;
    }
});

function searchButtonClicked() {
    const ART_URL_SEARCH = "https://api.artic.edu/api/v1/artworks/search"
    const ART_URL_Image = "https://www.artic.edu/iiif/2/";
    const ART_URL_FOOTER = "/full/843,/0/default.jpg"

    let url = ART_URL_SEARCH;


    let displayTerm = "";
    let term = document.querySelector("#searchterm").value;
    localStorage.setItem("Search", term);
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


            Promise.all(
                resultsURL.map(link =>
                    fetch(link)
                        .then(response => response.json())
                        .then(data => {
                            return {
                                imgURL: ART_URL_Image + data.data.image_id + ART_URL_FOOTER,
                                artist: data.data.artist_display,
                                alt: data.data.thumbnail?.alt_text ?? "No Description",
                                description: data.data.description ?? "No description available."
                            };
                        })
                )
            )
                .then(fullData => {
                    //console.log(imageURLS)
                    const imageURLS = fullData.map(x => x.imgURL);
                    const resultsArtist = fullData.map(x => x.artist);
                    const resultsAltTitle = fullData.map(x => x.alt)
                    const resultsDescription = fullData.map(x => x.description)
                    display(imageURLS, resultsTitle, resultsArtist, resultsAltTitle, resultsDescription)
                })
        })

}

let carouselMoving = false;

function display(imageURLS, resultsTitle, resultsArtist, resultsAltTitle, resultsDescription) {

    const container = document.querySelector("#content");

    container.classList.add("carousel");
    container.innerHTML = "";

    for (let i = 0; i < imageURLS.length; i++) {
        let line = `
        <a class="carousel-item" data-title='${encodeURIComponent(resultsTitle[i])}'
        data-description='${encodeURIComponent(resultsDescription[i])}'>
        <img src="${imageURLS[i]}" alt="${resultsAltTitle[i]} ${i + 1}" onclick="enlargeImg(this)">
        <p class="artDetail">${resultsTitle[i]}</p>
        <p class="artDetail">${resultsArtist[i]}</p>
        </a>
        `;
        container.innerHTML += line;
    }

    let elems = document.querySelectorAll('.carousel');
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

        let activeImg = document.querySelector(".carousel-item.active img");
        let isZoomed = activeImg && activeImg.classList.contains("zoomed");

        switch (event.key) {
            case "ArrowLeft":
                if (!isZoomed) {
                    instance.prev();
                }
                break;
            case "ArrowRight":
                if (!isZoomed) {
                    instance.next();
                }
                break;
        }
    });
    updateFrameVisibility();
}

function enlargeImg(imgElemt) {
    const frame = document.querySelector("#frame");
    const descriptionOverlay = document.querySelector("#description-overlay");
    const descriptionText = document.getElementById('description-text');

    const parentItem = imgElemt.closest(".carousel-item");

    if (!parentItem.classList.contains("active")) return;

    const description = decodeURIComponent(parentItem.dataset.description);
    const cleanDescription = description
        .replace(/<p[^>]*>/gi, "")
        .replace(/<\/p>/gi, "")
        .replace(/<a[^>]*>/gi, "")
        .replace(/<\/a>/gi, "")
        .replace(/<em[^>]*>/gi, "")
        .replace(/<\/em>/gi, "");
    if (!parentItem.classList.contains("active")) return;
    if (!imgElemt.classList.contains("zoomed")) {
        imgElemt.classList.add("zoomed");

        frame.style.visibility = "hidden";
        frame.classList.add("hidden");

        descriptionText.textContent = cleanDescription;
        descriptionOverlay.style.display = "flex";
    }
    else {
        imgElemt.classList.remove("zoomed");
        frame.style.visibility = "visible";
        frame.classList.remove("hidden");

        descriptionOverlay.style.display = "none";
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
    let Title = decodeURIComponent(activeImgTitle.dataset.title);

    let alreadyAdded = favContainer.querySelector(`img[src="${imgURL}"]`);
    if (alreadyAdded) {
        return;
    }

    let line = `
                    <a class="favorite-item">
                        <img src="${imgURL}" alt="${imgURL.alt_text}" />
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

function updateFrameVisibility() {
    const imgs = document.querySelectorAll('.carousel-item img');
    const frame = document.getElementById('frame');

    if (imgs.length == 0) {
        frame.classList.add('hidden');
    }
    else {
        frame.classList.remove('hidden');
        frame.classList.add('visible')
    }
}

function minimizeOnClick() {
    const descriptionOverlay = document.querySelector("#description-overlay");
    descriptionOverlay.style.display = "none";
}