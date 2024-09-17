import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import {
  Button,
  BodyLayout,
  MenuTitle,
  ToolTipBox,
  ToolTip,
  PointLetter,
} from "../components/body/mixin/Mixin";
import PageSlider from "../components/body/mixin/PageSlider";
import CustomTMap from "../components/body/map/CustomTMap";
import GoogleMapSettings from "../components/body/map/GoogleMapSettings";
import axios from "axios";
import { read_cookie } from "sfcookies";

const MenuTitleWithMargin = styled(MenuTitle)`
  margin-bottom: var(--margin-default);
`;

const Slider = styled.div`
  width: 100vw;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
`;

const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  & h1 {
    margin: var(--margin-default) 0;
  }
  & > img {
    margin-top: var(--margin-default);
  }
`;

const ButtonContainer = styled.div`
  width: 400px;
  margin-top: var(--margin-default);
  display: flex;
  justify-content: center;
`;

const LineContianer = styled.div`
  width: 800px;
  height: 40px;
  margin-top: calc(var(--margin-default) * 2);
  display: flex;
  align-items: center;
  position: relative;
`;

const LineSpan = styled.span`
  width: 370px;
  height: 4px;
  background-color: var(--color-focus);
  position: relative;
  right: 2px;
`;

const Circle = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 4px solid var(--color-focus);
  border-radius: 50%;
  right: 2px;
  font-weight: bold;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.fontColor};
  &:hover {
    cursor: pointer;
    color: var(--color-dark-focus);
    background-color: var(--color-blur);
  }
`;

const PlaceInfoWindow = styled.div`
  width: 800px;
  height: 300px;
  display: flex;
`;
const ImageSection = styled.div`
  width: 400px;
  height: 300px;
  overflow: hidden;
  border-radius: 12px 0 0 12px;
  & img {
    width: 100%;
    height: 100%;
  }
`;

const InfoSection = styled.div`
  width: 400px;
  height: 300px;
  padding: var(--padding-default);
  border: 2px solid var(--color-green);
  border-left: none;
  border-radius: 0 12px 12px 0;
  background-color: var(--color-light-bg);
  & h2 {
    margin-bottom: var(--margin-default);
  }
  & h3 {
    margin-bottom: calc(var(--margin-default) / 4);
  }
`;

const ForecastBox = styled.div`
  margin: calc(var(--margin-default) / 2) 0;
  & h2 {
    margin-bottom: var(--margin-default);
  }
`;

const SmallFont = styled.span`
  font-size: 16px;
  &:hover {
    cursor: pointer;
    color: var(--color-focus);
  }
`;

// 코스 정보 받아와서 > 장소1, 장소2, 장소3 주소를 티맵으로 보내서 찍기
const Result = ({ location, history }) => {
  const [idx, setIdx] = useState(0);
  const [startPoint, setStartPoint] = useState();
  // "서울특별시 마포구 서교동 332 33 1층"
  const [wayPoint, setWayPoint] = useState();
  // "서울특별시 마포구 서교동 홍익로6길 15"
  const [endPoint, setEndPoint] = useState();
  // "서울특별시 마포구 서교동 와우산로21길 31-10"

  // 장소 표시하기
  const [isSelected1, setIsSelected1] = useState(false);
  const [isSelected2, setIsSelected2] = useState(false);
  const [isSelected3, setIsSelected3] = useState(false);

  // 야매 코디 추천
  const [recommended, setRecommended] = useState("");
  const [recommendedKor, setRecommendedKor] = useState("");

  // 검색 결과 받아와서 찍기
  const courseResults = location.props.result;
  const weather = location.props.weather;
  const resdate = location.props.resdate;
  const sort = location.props.sort;
  const c_num = courseResults[0]?.c_num;
  // console.log("결과 객체", courseResults);
  // console.log("코스번호", c_num);
  // console.log("날씨 객체", weather);
  // console.log("날짜 스트링", resdate);
  // console.log(recommended);
  useEffect(() => {
    weather[0]?.icon === "01d" ||
    weather[0]?.icon === "01n" ||
    weather[0]?.icon === "02d" ||
    weather[0]?.icon === "02n"
      ? setRecommended("trench")
      : weather[0]?.icon === "03d" ||
        weather[0]?.icon === "03n" ||
        weather[0]?.icon === "04d" ||
        weather[0]?.icon === "04n"
      ? setRecommended("fleece")
      : weather[0]?.icon === "09d" ||
        weather[0]?.icon === "09n" ||
        weather[0]?.icon === "10d" ||
        weather[0]?.icon === "10n"
      ? setRecommended("umbrella")
      : setRecommended("nothing");

    weather[0]?.icon === "01d" ||
    weather[0]?.icon === "01n" ||
    weather[0]?.icon === "02d" ||
    weather[0]?.icon === "02n"
      ? setRecommendedKor("트렌치 코트")
      : weather[0]?.icon === "03d" ||
        weather[0]?.icon === "03n" ||
        weather[0]?.icon === "04d" ||
        weather[0]?.icon === "04n"
      ? setRecommendedKor("후리스")
      : weather[0]?.icon === "09d" ||
        weather[0]?.icon === "09n" ||
        weather[0]?.icon === "10d" ||
        weather[0]?.icon === "10n"
      ? setRecommendedKor("우산")
      : setRecommendedKor("없음");
  }, []);
  // console.log("날짜 스트링", resdate);
  // console.log("순서", sort);
  useEffect(() => {
    // console.log("코스 검색을 통해 들어오면 마운트, 각 포인트 설정");
    // console.log(courseResults[0]?.addr1);
    // console.log(courseResults[0]?.addr2);
    // console.log(courseResults[0]?.addr3);
    setStartPoint(courseResults[0]?.addr1);
    setWayPoint(courseResults[0]?.addr2);
    setEndPoint(courseResults[0]?.addr3);
  }, [courseResults]);
  // console.log("startPoint: ", startPoint);
  // console.log("wayPoint: ", wayPoint);
  // console.log("endPoint: ", endPoint);
  // 구글맵에서 지오코딩하기
  const coords = GoogleMapSettings({ startPoint, wayPoint, endPoint });
  // console.log("coords[0]: ", coords[0]);
  // console.log("coords[1]: ", coords[1]);
  // console.log("coords[2]: ", coords[2]);

  const onClickPlace1 = (e) => {
    setIsSelected1(true);
    setIsSelected2(false);
    setIsSelected3(false);
  };
  const onClickPlace2 = (e) => {
    setIsSelected1(false);
    setIsSelected2(true);
    setIsSelected3(false);
  };
  const onClickPlace3 = (e) => {
    setIsSelected1(false);
    setIsSelected2(false);
    setIsSelected3(true);
  };

  // 전화번호 스타일링
  const CheckPhoneNumber = (tel) => {
    if (tel !== null && !tel.includes("-")) {
      switch (tel.length) {
        case 11:
          return `${tel.substring(0, 3)}-${tel.substring(3, 7)}-${tel.substring(
            7,
            11
          )}`;
        case 10:
          return `${tel.substring(0, 2)}-${tel.substring(2, 6)}-${tel.substring(
            6,
            10
          )}`;
        case 9:
          return `${tel.substring(0, 2)}-${tel.substring(2, 5)}-${tel.substring(
            5,
            9
          )}`;
        case 8:
          return `${tel.substring(0, 3)}-${tel.substring(3, 8)}`;
      }
    }
  };

  // 주소 스타일링
  const DevideAddr = (addr) => {
    return addr.split("구");
  };

  // 링크 타고 넘어가기
  const onClickLink = (e) => {
    // console.log(e.target.innerText.split("링크: ")[1]);
    if (e.target.innerText !== "링크: ") {
      e.stopPropagation();
      window.open(e.target.innerText.split("링크: ")[1]);
    }
  };

  // 페이지 넘기기
  const onClickNext = () => {
    setIdx((prevIdx) => prevIdx + 1);
  };
  const onClickPrev = () => {
    setIdx((prevIdx) => prevIdx - 1);
  };
  // console.log("coords: ", coords);

  // 예약 확정해서 DB로 보내기
  const onClickConfirm = () => {
    const body = {
      userid: read_cookie("userId"),
      c_num: c_num,
      resdate: resdate,
    };
    // console.log("예약 확정이요~", body);
    axios
      .post("/wherewego/insertRes", body)
      .then((response) => {
        // console.log(response.data);
        alert("예약이 완료되었습니다!");
        history.push("/mypage");
      })
      .catch((error) => {
        // console.log(error)
      });
  };

  return (
    <>
      <Header />
      <BodyLayout>
        <MenuTitleWithMargin>{courseResults[0].name}</MenuTitleWithMargin>
        {coords.length === 3 ? (
          <CustomTMap
            startPoint={coords[0]}
            wayPoint={coords[1]}
            endPoint={coords[2]}
          />
        ) : null}
        <Slider>
          <PageSlider idx={idx} rate={-50}>
            <Container>
              <LineContianer>
                {isSelected1 ? null : isSelected2 ? null : isSelected3 ? null : (
                  <ToolTipBox fromTop="-44px" fromLeft="-36px">
                    각 장소의 상세 설명을 보시려면 아래 버튼을 클릭해 주세요!
                    <ToolTip />
                  </ToolTipBox>
                )}
                <Circle
                  onClick={onClickPlace1}
                  bgColor={isSelected1 ? "var(--color-focus)" : "white"}
                  fontColor={isSelected1 ? "white" : "var(--color-font)"}
                >
                  1
                </Circle>
                <LineSpan />
                <Circle
                  onClick={onClickPlace2}
                  bgColor={isSelected2 ? "var(--color-focus)" : "white"}
                  fontColor={isSelected2 ? "white" : "var(--color-font)"}
                >
                  2
                </Circle>
                <LineSpan />
                <Circle
                  onClick={onClickPlace3}
                  bgColor={isSelected3 ? "var(--color-focus)" : "white"}
                  fontColor={isSelected3 ? "white" : "var(--color-font)"}
                >
                  3
                </Circle>
              </LineContianer>
              {isSelected1 ? (
                <>
                  <h1>{courseResults[0]?.name1}</h1>
                  <PlaceInfoWindow>
                    <ImageSection>
                      <img
                        src={`${process.env.PUBLIC_URL}/images/places/${
                          sort[0] === "카페"
                            ? "cafe1.jpg"
                            : sort[0] === "식당"
                            ? "food1.jpg"
                            : "etc1.jpg"
                        }`}
                        alt="first"
                      />
                    </ImageSection>
                    <InfoSection>
                      <h2>{courseResults[0]?.name1}</h2>
                      <h3>
                        주소: {DevideAddr(courseResults[0]?.addr1)[0] + "구"}
                        <br />
                        {DevideAddr(courseResults[0]?.addr1)[1]}
                      </h3>
                      <h3>
                        연락처: {CheckPhoneNumber(courseResults[0]?.tel1)}
                      </h3>

                      {courseResults[0]?.link1 === null ? null : (
                        <h3 onClick={onClickLink}>
                          링크: <SmallFont>{courseResults[0]?.link1}</SmallFont>
                        </h3>
                      )}
                      {courseResults[0]?.info1 === null ? null : (
                        <h3>기타: {courseResults[0]?.info1}</h3>
                      )}
                    </InfoSection>
                  </PlaceInfoWindow>
                </>
              ) : isSelected2 ? (
                <>
                  <h1>{courseResults[0]?.name2}</h1>
                  <PlaceInfoWindow>
                    <ImageSection>
                      <img
                        src={`${process.env.PUBLIC_URL}/images/places/${
                          sort[1] === "카페"
                            ? "cafe2.jpg"
                            : sort[1] === "식당"
                            ? "food2.jpg"
                            : "etc2.jpg"
                        }`}
                        alt="first"
                      />
                    </ImageSection>
                    <InfoSection>
                      <h2>{courseResults[0]?.name2}</h2>
                      <h3>
                        주소: {DevideAddr(courseResults[0]?.addr2)[0] + "구"}
                        <br />
                        {DevideAddr(courseResults[0]?.addr2)[1]}
                      </h3>
                      <h3>
                        연락처: {CheckPhoneNumber(courseResults[0]?.tel2)}
                      </h3>
                      {courseResults[0]?.link2 === null ? null : (
                        <h3 onClick={onClickLink}>
                          링크: <SmallFont>{courseResults[0]?.link2}</SmallFont>
                        </h3>
                      )}
                      {courseResults[0]?.info2 === null ? null : (
                        <h3>기타: {courseResults[0]?.info2}</h3>
                      )}
                    </InfoSection>
                  </PlaceInfoWindow>
                </>
              ) : isSelected3 ? (
                <>
                  <h1>{courseResults[0]?.name3}</h1>
                  <PlaceInfoWindow>
                    <ImageSection>
                      <img
                        src={`${process.env.PUBLIC_URL}/images/places/${
                          sort[2] === "카페"
                            ? "cafe1.jpg"
                            : sort[2] === "식당"
                            ? "food2.jpg"
                            : "etc2.jpg"
                        }`}
                        alt="first"
                      />
                    </ImageSection>
                    <InfoSection>
                      <h2>{courseResults[0]?.name3}</h2>
                      <h3>
                        주소: {DevideAddr(courseResults[0]?.addr3)[0] + "구"}
                        <br />
                        {DevideAddr(courseResults[0]?.addr3)[1]}
                      </h3>
                      <h3>
                        연락처: {CheckPhoneNumber(courseResults[0]?.tel3)}
                      </h3>
                      {courseResults[0]?.link3 === null ? null : (
                        <h3 onClick={onClickLink}>
                          링크: <SmallFont>{courseResults[0]?.link3}</SmallFont>
                        </h3>
                      )}
                      {courseResults[0]?.info3 === null ? null : (
                        <h3>기타: {courseResults[0]?.info3}</h3>
                      )}
                    </InfoSection>
                  </PlaceInfoWindow>
                </>
              ) : null}
            </Container>
            <Container>
              <img
                src={`http://openweathermap.org/img/wn/${weather[0]?.icon}@2x.png`}
                alt={weather[0]?.description}
              />
              <ForecastBox>
                <h2>
                  <PointLetter>
                    {`${resdate?.substring(0, 4)}년 ${resdate?.substring(
                      5,
                      7
                    )}월 ${resdate?.substring(8, 10)}일`}
                  </PointLetter>
                  의 날씨: {weather[0]?.description}
                </h2>
              </ForecastBox>

              <PlaceInfoWindow>
                <ImageSection>
                  <img
                    src={`${process.env.PUBLIC_URL}/images/shoppings/${recommended}1.jpg`}
                    alt="first"
                  />
                </ImageSection>
                <InfoSection>
                  <h2>
                    추천 아이템:
                    <PointLetter> {recommendedKor}</PointLetter>
                  </h2>
                  <a
                    href={`https://search.musinsa.com/search/musinsa/integration?type=&q=${recommendedKor}`}
                    target="_blank"
                  >
                    <SmallFont>사러 가기</SmallFont>
                  </a>
                </InfoSection>
              </PlaceInfoWindow>
            </Container>
          </PageSlider>
        </Slider>
        {idx === 0 ? (
          <ButtonContainer>
            <Button onClick={onClickNext}>다음</Button>
            <Link to={"/planning"}>
              <Button>다시 선택하기</Button>
            </Link>
          </ButtonContainer>
        ) : idx === 1 ? (
          <ButtonContainer>
            <Button onClick={onClickPrev}>이전</Button>
            <Button onClick={onClickConfirm}>예약 확정하기</Button>
          </ButtonContainer>
        ) : null}
      </BodyLayout>
      <Footer />
    </>
  );
};

export default Result;
