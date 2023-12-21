import { requestSubwaySheet } from "./sheet.js";

class Station {
    name;
    #type;
    get type() {
        return this.#type;
    }
    /** @param {string} value */
    set type(value) {
        if (value === Station.BUS) this.#type = Station.BUS;
        else this.#type = Station.SUBWAY;
    }

    get info() {
        if (this.type === Station.BUS) return this.id;
        return this.nextStation.name + " 방면";
    }

    #id;
    get id() {
        return this.#id;
    }
    /** @param {string} value */
    set id(value) {
        if (isNaN(value)) this.#id = "00000";
        else this.#id = value;
    }

    #subwayId;
    get subwayId() {
        return this.#subwayId;
    }
    /** @param {string} value */
    set subwayId(value) {
        if (this.type === Station.SUBWAY) {
            if (isNaN(value)) this.#subwayId = "0000";
            else this.#subwayId = value.toString();
        }
    }

    #direction;
    get direction() {
        return this.#direction;
    }
    set direction(value) {
        if (this.type === Station.BUS) this.#direction = Station.ALL;
        else if (value === Station.DOWN) this.#direction = Station.DOWN;
        else if (value === Station.UP) this.#direction = Station.UP;
        this.#direction = Station.ALL;
    }

    #nextStation;
    get nextStation() {
        if (!this.#nextStation) this.#nextStation = new Station("2역", Station.SUBWAY, "101");
        return this.#nextStation;
    }

    #latitude;

    /** 위도 */
    get latitude() {
        return this.#latitude;
    }
    /** 위도 */
    set latitude(value) {
        if (isNaN(value)) {
            this.#latitude = 33.450701;
        }
        this.#latitude = Number(value);
    }
    #longitude;
    /** 경도 */
    get longitude() {
        return this.#longitude;
    }
    /** 경도 */
    set longitude(value) {
        if (isNaN(value)) {
            this.#longitude = 126.570667;
        }
        this.#longitude = Number(value);
    }

    #eliemnt;
    get eliemnt() {
        if (!this.#eliemnt) this.InitStationEliment();
        return this.#eliemnt;
    }

    constructor(name, type, id, direction = "") {
        this.name = name;
        this.type = type;
        this.id = id;
        this.direction = direction;
    }

    InitStationEliment() {
        // 생성자에서 실행시 type이 SUBWAY이면 nextStation이 과도하게 호출됨
        // 다음 Station가 생성자가 호출되는 시점에 없을 가능성 높음
        let eliemnt = document.createElement("div");
        eliemnt.className = "card mb-3 mx-lg-4";

        let name = this.name;
        var icon = "&#xe530;";

        if (this.type == Station.SUBWAY) {
            name = name + "역";
        }

        eliemnt.innerHTML = `
        <div class="card-header c-flex bg-transparent">
            <span class="material-symbols-outlined fs-1 me-2" alt="bus Station">${icon}</span>
            <div>
                <h5 class="card-title">${name}</h5>
                <h6 class="card-subtitle text-muted">${this.info}</h6>
            </div>
        </div>
        <div class="card-body"></div>
        </div>`;

        this.#eliemnt = eliemnt;
    }

    static BUS = "bus";
    static SUBWAY = "subway";
    static ALL = "all";
    static UP = "up";
    static DOWN = "down";
}

function clearSearchItem() {
    let searchModalBody = document.querySelector("#searchModal div .modal-body");
    while (searchModalBody.firstChild) {
        searchModalBody.removeChild(searchModalBody.firstChild);
    }
}

/** @param {Station} station */
function addSearchItem(station) {
    let searchItemElement = document.createElement("div");
    let searchModalBody = document.querySelector("#searchModal div .modal-body");
    searchItemElement.className = "card searchItem mb-3";
    let name = station.name;
    var icon = "&#xe530;";
    let parameters = `${station.latitude}, ${station.longitude}`;

    if (station.type == Station.SUBWAY) {
        name = name + "역";
        icon = "&#xe56f";
        parameters = "";
    }
    searchItemElement.innerHTML = `
    <div class="card-body d-flex justify-content-between align-items-end">
        <div class="d-flex">
            <span class="material-symbols-outlined fs-1 me-2" alt="bus Station">${icon}</span>
            <div class="d-inline-block">
                <h5 class="card-title">${name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${station.info}</h6>
            </div>
        </div>
        <div class="btnContainer c-flex gap-2">
            <button type="button" class="btn btn-outline-dark c-btn-icon addStation">
            <span class = "material-symbols-outlined"> &#xe145;</span>
            </button>
            <button type="button" class="btn btn-outline-dark c-btn-icon showMap" data-bs-target="#mapModal" data-bs-toggle="modal">
            <span class="material-symbols-outlined"> &#xe55b;</span>
            </button>
        </div>
    </div>`;
    searchModalBody.appendChild(searchItemElement);
    let addBtn = searchItemElement.querySelector("div .btnContainer .addStation");
    let mapBtn = searchItemElement.querySelector("div .btnContainer .showMap");
    if(addBtn){
        addBtn.addEventListener("click", () => {addStationItem(station)});
    }
    if(mapBtn){
        mapBtn.addEventListener("click", () => {showMap(station)});
    }
}

function showMap(station) {
    if (station.type == Station.SUBWAY && !station.latitude) {
        let keyword = station.name + "역";
        if (subwayLine[station.subwayId]) {
            keyword = keyword + " " + subwayLine[station.subwayId];
        }
        stationLatLngSearch(keyword, (data, status, pagination) => {
            if (status === kakao.maps.services.Status.OK) {
                console.log(data);
                station.latitude = Number(data[0].y);
                station.longitude = Number(data[0].x);
                showStation(station.latitude, station.longitude);
            } else {
                alert("Map search error: " + status);
            }
        });
        return;
    }
    showStation(station.latitude, station.longitude);
}

/** @param {Station} station */
function addStationItem(station) {
    let stationsContainer = document.querySelector("#stationsContainer");

    let colEliment = document.createElement("div");
    colEliment.className = "col";
    colEliment.appendChild(station.eliemnt);

    stationsContainer.appendChild(colEliment);
}

function csvToJSON(csv_string) {
    csv_string = csv_string.replace(/"/g, "");
    const rows = csv_string.split("\r\n");
    const jsonArray = [];

    const header = rows[0].split(",");
    for (let i = 1; i < rows.length; i++) {
        let obj = {};
        let row = rows[i].split(",");
        for (let j = 0; j < header.length; j++) {
            obj[header[j]] = row[j];
        }
        jsonArray.push(obj);
    }
    return jsonArray;
}

function disassembleHangul(hangul) {
    if (!hangul) {
        return [];
    }
    const ga = 44032; // '가'의 유니코드 포인트
    const hih = 28; // 한글 음절당 받침 개수
    const jung = 21; // 한글 음절당 중성 개수
    const chosung = [
        "ㄱ",
        "ㄲ",
        "ㄴ",
        "ㄷ",
        "ㄸ",
        "ㄹ",
        "ㅁ",
        "ㅂ",
        "ㅃ",
        "ㅅ",
        "ㅆ",
        "ㅇ",
        "ㅈ",
        "ㅉ",
        "ㅊ",
        "ㅋ",
        "ㅌ",
        "ㅍ",
        "ㅎ",
    ];
    const jungsung = [
        "ㅏ",
        "ㅐ",
        "ㅑ",
        "ㅒ",
        "ㅓ",
        "ㅔ",
        "ㅕ",
        "ㅖ",
        "ㅗ",
        "ㅘ",
        "ㅙ",
        "ㅚ",
        "ㅛ",
        "ㅜ",
        "ㅝ",
        "ㅞ",
        "ㅟ",
        "ㅠ",
        "ㅡ",
        "ㅢ",
        "ㅣ",
    ];
    const jongsung = [
        "",
        "ㄱ",
        "ㄲ",
        "ㄳ",
        "ㄴ",
        "ㄵ",
        "ㄶ",
        "ㄷ",
        "ㄹ",
        "ㄺ",
        "ㄻ",
        "ㄼ",
        "ㄽ",
        "ㄾ",
        "ㄿ",
        "ㅀ",
        "ㅁ",
        "ㅂ",
        "ㅄ",
        "ㅅ",
        "ㅆ",
        "ㅇ",
        "ㅈ",
        "ㅊ",
        "ㅋ",
        "ㅌ",
        "ㅍ",
        "ㅎ",
    ];

    let result = [];
    for (let i = 0; i < hangul.length; i++) {
        let charCode = hangul.charCodeAt(i);
        if (charCode < ga || charCode > ga + 11171) {
            result.push(hangul[i]);
            continue;
        }
        charCode -= ga;
        let jong = charCode % hih;
        let jungIndex = ((charCode - jong) / hih) % jung;
        let cho = ((charCode - jong) / hih - jungIndex) / jung;
        result.push(chosung[cho], jungsung[jungIndex], jongsung[jong]);
    }
    return result;
}

var stationDictionary = {};
var subwayList = [{ SUBWAY_ID: 1001, STATN_ID: 1001000100, STATN_NM: "소요산", 호선이름: "1호선" }];
var subwayLine = {};

requestSubwaySheet().then((result) => {
    // 철도 데이터 세팅
    subwayList = result;
    subwayList.forEach((element) => {
        let station = new Station(element.STATN_NM, Station.SUBWAY, element.STATN_ID, Station.ALL);
        station.subwayId = element.SUBWAY_ID;
        stationDictionary[element.STATN_NM] = station;
        if (!subwayLine[element.SUBWAY_ID]) {
            subwayLine[element.SUBWAY_ID] = element["호선이름"];
        }
    });
});

fetch("./resource/국토교통부_전국 버스정류장 위치정보_20231016.csv") // 버스 데이터 세팅
    .then((res) => {
        return res.arrayBuffer();
    })
    .then((buffer) => {
        let decoder = new TextDecoder("euc-kr");
        let decodedData = decoder.decode(new Uint8Array(buffer));
        let busJSON = csvToJSON(decodedData);
        busJSON.forEach((element) => {
            let station = new Station(element["정류장명"], Station.BUS, element["모바일단축번호"]);
            station.latitude = element["위도"];
            station.longitude = element["경도"];
            stationDictionary[element["정류장명"]] = station;
        });
    });

// addStationItem(new Station("역 이름", "subway", "201", Station.UP));
// addStationItem(new Station("역 이름", "subway", "k102", Station.DOWN));
// addStationItem(new Station("역 이름", "subway", "203", Station.DOWN));
// addStationItem(new Station("정류장 이름", "bus", "23456"));
// addStationItem(new Station("정류장 이름", "bus", "12345"));
// addStationItem(new Station("정류장 이름", "bus", "98765"));

setTimeout(() => {
    console.log(stationArray);
}, 10 * 1000);

document.querySelector("#searchInput").addEventListener("input", (event) => {
    // 검색 결과
    clearSearchItem();
    let inputText = event.target.value;
    if (!inputText || inputText.length < 2) {
        return;
    }
    let inputTextArr = disassembleHangul(inputText);
    if (inputTextArr[inputTextArr.length - 1] === "") {
        inputTextArr.pop();
    }
    for (const [key, value] of Object.entries(stationDictionary)) {
        let element = value;
        let name = element.name;
        if (element.type === Station.SUBWAY) {
            name = name + "역";
        }
        let elementNameArr = disassembleHangul(name);
        if (elementNameArr.some((v, i, arr) => inputTextArr.every((v2, j) => v2 === arr[i + j]))) {
            addSearchItem(element);
            continue;
        }
        if (!isNaN(inputText)) {
            if (
                element.type == Station.BUS &&
                element.id
                    .toString()
                    .split("")
                    .some((v, i, arr) => inputTextArr.every((v2, j) => v2 === arr[i + j]))
            ) {
                addSearchItem(element);
                continue;
            }
        }
    }
});
