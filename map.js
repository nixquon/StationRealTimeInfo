var container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
var options = {
    //지도를 생성할 때 필요한 기본 옵션
    center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
    level: 1, //지도의 레벨(확대, 축소 정도)
};

var map;
var marker;
var ps;
/**
 *  @param {Station} station
 *  @param {Function} callback
 */
function stationLatLngSearch(keyword, callback) {
    if (ps == undefined) {
        ps = new kakao.maps.services.Places();
    }

    ps.keywordSearch(keyword, callback, { category_group_code: "SW8" });
}

/**
 *  @param {Number} latitude 위도
 *  @param {Number} longitude 경도
 */
function showStation(latitude, longitude) {
    if (map === undefined) {
        map = new kakao.maps.Map(container, options);
        var mapTypeControl = new kakao.maps.MapTypeControl();
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    }
    if (marker === undefined) {
        marker = new kakao.maps.Marker();
    }
    
    let stationLatLon = new kakao.maps.LatLng(latitude, longitude);
    
    map.setLevel(1);
    map.relayout();
    map.setCenter(stationLatLon);

    marker.setPosition(stationLatLon);
    marker.setMap(map);
}
