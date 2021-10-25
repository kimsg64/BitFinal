<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<style>
#mainDiv {
	width: 72%;
	margin: 0 auto;
	color: #00282e;
	text-align: center;
}

#mainDiv>h1 {
	margin-bottom: 30px;
	text-align: left;
}

#banner {
	width: 100%;
}

#viewDiv {
	float: center;
	background-color: #f5ebe3;
	border: 1px solid #efcac3;
	padding: 30px;
	border-radius: 6px;
}

#infoDiv {
	margin-left: 30%;
	text-align: left;
}

#infoDiv li {
	width: 80%;
	height: 40px;
	line-height: 40px;
	border-bottom: 1px solid #f5ebe3;
}
#map{margin:0 auto; border: 1px solid #0e595f}
</style>
<!-- services와 clusterer, drawing 라이브러리 불러오기 -->
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=ed6c268bc17af15a75755708f3c3d0a9&libraries=services,clusterer,drawing"></script>

<div id="mainDiv">
	<h1>장소 상세보기</h1>
	<!-- <img src="imgs/banner/place.jpg" id="banner"/>  -->

	<div id="viewDiv">
		<h4>No.${vo.pcode }</h4>
		<br />
		<h1>${vo.name }</h1>
		<br /> <br />

		<div id="map" style="width:600px;height:350px;"></div>
		<br /> <br />

		<div id="infoDiv">
			<ul>
				<li><b>종류 : </b>${vo.datesort }</li>
				<li><b>주소 : </b>${vo.addr }</li>
				<li><b>연락처 : </b>${vo.tel }</li>
				<li><b>영업시간 : </b>${vo.time }</li>
				<li><b>링크 : </b>${vo.link }</li>
				<li><b>정보 : </b>${vo.info }</li>
			</ul>
		</div>
	</div>
</div>

<script>
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };  

// 지도를 생성합니다    
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소로 좌표를 검색합니다
geocoder.addressSearch("${vo.addr}", function(result, status) {

    // 정상적으로 검색이 완료됐으면 
     if (status === kakao.maps.services.Status.OK) {

        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: coords
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: '<div style="width:150px;text-align:center;padding:6px 0;">'+"${vo.name}"+'</div>'
        });
        infowindow.open(map, marker);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
    } 
});    
</script>