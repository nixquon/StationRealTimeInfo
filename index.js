var station = function (name = "", info = "") {
    return {
        name: name,
        info: info,
    };
};
function AddSearchItem(station) {
    let searchItemHtml = document.createElement("div");
    let searchModalBody = document.querySelector("#searchModal div .modal-body");
    searchItemHtml.className = "card searchItem mb-3";
    searchItemHtml.innerHTML = `
    <div class="card-body d-flex justify-content-between align-items-end">
        <div>
            <h5 class="card-title">${station.name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${station.info}</h6>
        </div>
        <!--<p class="card-text"></p>-->
        <div class="btnContainer c-flex gap-2">
            <button type="button" class="btn btn-outline-dark c-btn-icon">
            <span class = "material-symbols-outlined"> &#xe145;</span>
            </button>
            <button type="button" class="btn btn-outline-dark c-btn-icon">
            <span class="material-symbols-outlined"> &#xe55b;</span>
        </div>
        </button>
    </div>`;
    console.log(searchItemHtml);
    searchModalBody.appendChild(searchItemHtml);
}
AddSearchItem(new station("정류장 이름", "00000"));
AddSearchItem(new station("역 이름", "XX방면"));
