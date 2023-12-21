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
        if (this.type === Station.BUS) {
            let result = this.busCityName;
            if (!this.busCityName.includes(this.busControlCityName))
                result += `<span style="color: #ffa500">(${this.#busControlCityName})</span>`;
            result += " " + this.busId;
            return result;
        }
        return subwayLine[this.subwayId];
    }

    #id;
    get id() {
        return this.#id;
    }
    /** @param {string} value */
    set id(value) {
        if (!value) {
            this.#id = "";
            return;
        }
        this.#id = value.toString();
    }

    #busId;
    get busId() {
        return this.#busId;
    }
    /** @param {string} value */
    set busId(value) {
        if (this.type === Station.BUS) {
            if (isNaN(value)) this.#busId = "00000";
            else this.#busId = value.toString();
        }
    }

    #busCityCode;
    get busCityCode() {
        return this.#busCityCode;
    }
    /** @param {string} value */
    set busCityCode(value) {
        if (this.type === Station.BUS) {
            if (isNaN(value)) this.#busCityCode = "00";
            else this.#busCityCode = value.toString();
        }
    }

    #busCityName;
    get busCityName() {
        return this.#busCityName;
    }
    /** @param {string} value */
    set busCityName(value) {
        if (this.type === Station.BUS) {
            this.#busCityName = value;
        }
    }

    #busControlCityName;
    get busControlCityName() {
        return this.#busControlCityName;
    }
    /** @param {string} value */
    set busControlCityName(value) {
        if (this.type === Station.BUS) {
            this.#busControlCityName = value;
        }
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
        if (!this.#nextStation) this.#nextStation;
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

    apiJson;

    #element;
    get element() {
        if (!this.#element) this.InitStationEliment();
        return this.#element;
    }

    #body;
    get body() {
        if (!this.#body) this.InitStationEliment();
        return this.#body;
    }

    constructor(name, type, id, direction = "") {
        this.name = name;
        this.type = type;
        this.id = id;
        this.direction = direction;
    }

    InitStationEliment() {
        // 다음 Station가 생성자가 호출되는 시점에 없을 가능성 높음
        let element = document.createElement("div");
        element.className = "card mb-3 mx-lg-4";
        element.style.height = "100%";

        let name = this.name;
        var icon = "&#xe530;";

        if (this.type == Station.SUBWAY) {
            name = name + "역";
            icon = "&#xe56f;"
        }

        element.innerHTML = `
        <div class="card-header c-flex justify-content-between bg-transparent">
            <div class="d-flex">
                <span class="material-symbols-outlined fs-1 me-2" alt="${this.type} Station">${icon}</span>
                <div>
                    <h5 class="card-title">${name}</h5>
                    <h6 class="card-subtitle text-muted">${this.info}</h6>
                </div>
            </div>
            <button type="button" class="btn btn-outline-dark c-btn-icon removeStation">
            <span class="material-symbols-outlined"> &#xe872;</span> </button>
        </div>
        <div class="card-body"></div>
        </div>`;
        this.#element = element;
        this.#body = document.createElement("div");
        this.element.querySelector("div .removeStation").addEventListener("click", () => {
            removeStationItem(this);
        });
        element.querySelector(".card-body").appendChild(this.#body);
    }

    async callAPI() {
        let url = "";
        if (this.type === Station.SUBWAY) {
            let apiKey = "52627075506e69783435794c724775";
            url = `http://swopenAPI.seoul.go.kr/api/subway/${apiKey}/json/realtimeStationArrival/0/100/${this.name}`;
        } else {
            let apiKey =
                "dThA7Vda%2BCXPyf%2F8JYxoAQhLdLXM86eSR0siguahdaF8AEWteQHehqPoAVt3wRw2uA8P5UIwQJPHBAHXDWgyHA%3D%3D";
            let queryParams = "?" + encodeURIComponent("serviceKey") + "=" + apiKey; /*Service Key*/
            queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
            queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("10");
            queryParams += "&" + encodeURIComponent("_type") + "=" + encodeURIComponent("json");
            queryParams +=
                "&" + encodeURIComponent("cityCode") + "=" + encodeURIComponent(this.busCityCode);
            queryParams += "&" + encodeURIComponent("nodeId") + "=" + encodeURIComponent(this.id);
            url =
                "https://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList" +
                queryParams;
        }

        const response = await fetch(url);
        let json = await response.json();
        // console.log(json);
        this.apiJson = json;
        return json;
    }

    static BUS = "bus";
    static SUBWAY = "subway";
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

    if (station.type === Station.SUBWAY) {
        name = name + "역";
        icon = "&#xe56f;";
        parameters = "";
    }
    searchItemElement.innerHTML = `
    <div class="card-body d-flex justify-content-between align-items-end">
        <div class="d-flex">
            <span class="material-symbols-outlined fs-1 me-2" alt="${station.type} Station">${icon}</span>
            <div class="d-inline-block">
                <h5 class="card-title">${name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${station.info}</h6>
            </div>
        </div>
        <div class="btnContainer c-flex gap-2">
            <button type="button" class="btn btn-outline-dark c-btn-icon addStation" data-bs-dismiss="modal">
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
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            addStationItem(station);
        });
    }
    if (mapBtn) {
        mapBtn.addEventListener("click", () => {
            showMap(station);
        });
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

function InitStationEliment(start) {
    if (!start) {
        try {
            selectedStations.forEach((id) => {
                removeStationItem(stationDictionary[id], true);
            });
        } catch (e) {
            console.log(e);
        }
    }
    try {
        selectedStations.forEach((id) => {
            addStationItem(stationDictionary[id], true);
        });
    } catch (e) {
        console.log(e);
    }
}

/** @param {Station} station */
function addStationItem(station, init) {
    if (!init && selectedStations.includes(station.id)) {
        return;
    }
    let stationsContainer = document.querySelector("#stationsContainer");

    let colEliment = document.createElement("div");
    colEliment.className = "col mb-3";
    colEliment.appendChild(station.element);

    stationsContainer.appendChild(colEliment);
    if (!init) {
        selectedStations.push(station.id);
        localStorage.setItem("stationIds", selectedStations);
    }
    updateStationArrivalInfo(station);
}

function updateStationArrivalInfo(station) {
    station.callAPI().then((json) => {
        if (station.type === Station.SUBWAY) {
            if (json.errorMessage.status != 200) {
                alert("Subway API Error: " + json.errorMessage.status);
                return;
            }
            let upName;
            let upList = []; // 상행
            let upNext = "";

            let downName;
            let downList = []; // 하행
            let downNext = "";

            for (const [key, value] of Object.entries(json.realtimeArrivalList)) {
                if (value.subwayId == station.subwayId) {
                    let info = { endStation: "", nowStation: "", time: 0, msg: "" };

                    info.endStation = value.bstatnNm;
                    info.nowStation = value.arvlMsg3;
                    info.time = value.barvlDt;

                    let regex = /\[([0-9]+)\]번째 전역/gm;
                    let match = regex.exec(value.arvlMsg2);
                    if (match) {
                        info.msg = match[1] + "번째 전역";
                    } else {
                        info.msg = value.arvlMsg2;
                    }
                    if (value.updnLine == "상행" || value.updnLine == "내선") {
                        if (!upName) {
                            upName = value.updnLine;
                        }
                        if (!upNext) {
                            let trainLineNm = value.trainLineNm.split(" - ");
                            upNext = trainLineNm[1];
                        }
                        upList.push(info);
                    } else {
                        if (!downName) {
                            downName = value.updnLine;
                        }
                        if (!downNext) {
                            let trainLineNm = value.trainLineNm.split(" - ");
                            downNext = trainLineNm[1];
                        }
                        downList.push(info);
                    }
                }
            }

            let body = station.body;
            body.className = "d-grid";
            body.style.gridTemplateColumns = "10fr 1fr 10fr";
            body.style.height = "100%";
            body.innerHTML = "";

            let infos = document.createElement("div");
            infos.innerHTML = `<div style="font-size: 0.9rem">
            <span>${upName}</span></br>
            <span class="text-muted">${upNext}</span>
            </div>`;

            upList.forEach((value) => {
                let info = document.createElement("div");
                info.className = "my-1";
                let time = "";
                if (value.time > 0) {
                    time = `(${value.time}초)`;
                }
                info.innerHTML = `<span>${value.endStation}</span>
                <span style="color: #52a1e9; word-break:keep-all"
                    >${value.msg}</span
                >
                <span
                    class="text-muted text-nowrap"
                    style="font-size: 0.9rem"
                    >${time}</span
                >`;
                infos.appendChild(info);
            });
            body.appendChild(infos);

            let bar = document.createElement("div");
            bar.className = "vr";
            body.appendChild(bar);

            infos = document.createElement("div");
            infos.innerHTML = `<div style="font-size: 0.9rem">
            <span>${downName}</span></br>
            <span class="text-muted">${downNext}</span>
            </div>`;

            downList.forEach((value) => {
                let info = document.createElement("div");
                info.className = "my-1";
                let time = "";
                if (value.time > 0) {
                    time = `(${value.time}초)`;
                }
                info.innerHTML = `<span>${value.endStation}</span>
                <span style="color: #52a1e9; word-break:keep-all"
                    >${value.msg}</span
                >
                <span
                    class="text-muted text-nowrap"
                    style="font-size: 0.9rem"
                    >${time}</span
                >`;
                infos.appendChild(info);
            });
            body.appendChild(infos);
        } else {
            if (!json.response.header.resultCode === "00") {
                alert("Subway API Error: " + json.response.header.resultCode);
                return;
            }
            let item = json.response.body.items.item;
            let body = station.body;
            body.innerHTML = "";

            if (json.response.body.totalCount == 0) {
                body.className = "text-center";
                let noneInfo = document.createElement("span");
                noneInfo.innerHTML = `도착 예정 정보 없음`;
                body.appendChild(noneInfo);
                return;
            }
            if (json.response.body.totalCount == 1) {
                item = [item];
            } else {
                item.sort((obj1, obj2) => {
                    return obj1.arrtime - obj2.arrtime;
                });
            }

            let arrInfo = {};
            for (const [key, value] of Object.entries(item)) {
                let busName = value.routeno.toString();
                if (!arrInfo[busName]) {
                    arrInfo[busName] = [];
                }
                let info = { arrtime: 0, beforeCount: 0, type: "" };
                info["arrtime"] = Number(value.arrtime);
                info["beforeCount"] = value.arrprevstationcnt;
                info["type"] = value.routetp.replace("버스", "");
                arrInfo[busName].push(info);
            }

            for (const [key, value] of Object.entries(arrInfo)) {
                let busInfos = document.createElement("div");
                busInfos.className = "c-flex justify-content-between";
                busInfos.innerHTML = `<div>
                <span class="text-nowrap">${key}</span>
                <span class="text-muted text-nowrap">(${value[0].type})</span>
            </div>`;
                let busArriveInfos = document.createElement("div");
                busArriveInfos.className =
                    "d-flex flex-column flex-md-row gap-sm-2 align-items-end";
                let max = 1;
                if (value.length > 1) {
                    max++;
                }
                for (let i = 0; i < max; i++) {
                    let busInfo = document.createElement("div");
                    busInfo.className = "text-nowrap";
                    let time = parseInt(value[i].arrtime / 60);
                    let timeText = "";
                    if (time == 0) {
                        timeText = "잠시후";
                    } else {
                        timeText = time + "분";
                    }
                    busInfo.innerHTML = `<span style="color:#ff5d5d">${timeText}</span>
                    <span class="text-muted text-nowrap">${value[i].beforeCount}정류장</span>`;
                    busArriveInfos.appendChild(busInfo);
                    if (max - i == 2) {
                        let vr = document.createElement("div");
                        vr.className = "vr d-none d-md-inline-block";
                        busArriveInfos.appendChild(vr);
                    }
                }
                busInfos.appendChild(busArriveInfos);
                body.appendChild(busInfos);
            }
        }
    });
}

function removeStationItem(station, init) {
    let stationsContainer = document.querySelector("#stationsContainer");
    stationsContainer.removeChild(station.element.parentElement);
    let stationIdx;
    selectedStations.forEach((id, idx) => {
        if (id == station.id) {
            stationIdx = idx;
        }
    });

    if (!init) {
        selectedStations.splice(stationIdx, 1);
        localStorage.setItem("stationIds", selectedStations);
    }
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

var selectedStations = [];
if (localStorage.getItem("stationIds", selectedStations)) {
    selectedStations = localStorage.getItem("stationIds").split(",");
    setTimeout(() => InitStationEliment(true), 2000);
}
var stationDictionary = {};
var subwayList = [{ SUBWAY_ID: 1001, STATN_ID: 1001000100, STATN_NM: "소요산", 호선이름: "1호선" }];
var subwayLine = {};

// 철도 데이터 세팅
requestSubwaySheet().then((result) => {
    subwayList = result;
    subwayList.forEach((element) => {
        let station = new Station(element.STATN_NM, Station.SUBWAY, element.STATN_ID, Station.ALL);
        station.subwayId = element.SUBWAY_ID;
        stationDictionary[element.STATN_ID] = station;
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
            let station = new Station(element["정류장명"], Station.BUS, element["정류장번호"]);
            station.latitude = element["위도"];
            station.longitude = element["경도"];
            station.busCityCode = element["도시코드"];
            station.busCityName = element["도시명"];
            station.busControlCityName = element["관리도시명"];
            station.busId = element["모바일단축번호"];
            stationDictionary[element["정류장번호"]] = station;
        });
    });

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

var refreshBtn = document.querySelector("#refreshButton");
refreshBtn.addEventListener("click", () => {
    console.log("refresh");
    InitStationEliment();
    refreshBtn.disabled = true;
    let originalHtml = refreshBtn.innerHTML;
    setTimeout(() => {
        refreshBtn.disabled = false;
    }, 10 * 1000);
    let timeCount = 0;
    timeCount++;
    refreshBtn.innerHTML = `<span>${11 - timeCount}</span>`;
    let btnCounter = setInterval(() => {
        timeCount++;
        refreshBtn.innerHTML = `<span>${11 - timeCount}</span>`;
        if (timeCount > 10) {
            refreshBtn.innerHTML = originalHtml;
            clearTimeout(btnCounter);
        }
    }, 1000);
});

setInterval(() => {
    console.log("refresh");
    InitStationEliment();
}, 300 * 1000); // 5분마다 refresh
