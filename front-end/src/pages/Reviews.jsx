import React, { useRef, useState } from "react";
import styled from "styled-components";
import Header from "../components/header/Header";
import {
  BodyLayout,
  MenuTitle,
  ReviewImageBox,
  ReviewItem,
  ReviewTextBox,
} from "../components/body/mixin/Mixin";
import Footer from "../components/footer/Footer";
import Stars from "../components/body/mixin/Stars";
import ReviewsData from "../server/ReviewsData";
import { bake_cookie, read_cookie } from "sfcookies";

const ReviewPageMenuTitle = styled(MenuTitle)`
  width: 72%;
  margin-top: calc(var(--margin-default) * 3);
  margin-bottom: 0;
`;

const ReviewsContainer = styled.ul`
  width: 80vw;
  margin-top: var(--margin-header-to-body);
  overflow-x: hidden;
  white-space: nowrap;
  user-select: none;
  transition: all 0.2s;
  will-change: transform;
  position: relative;
  &:hover {
    cursor: grab;
  }
  &:active {
    cursor: grabbing;
  }
  /* perspective: 800px; */
  /* background: -webkit-linear-gradient(
    left,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0) 20%,
    rgba(0, 0, 0, 0) 80%,
    rgba(0, 0, 0, 0.65) 100%
    ); */
`;

const Slider = styled.div`
  height: 600px;
  display: flex;
  align-items: center;
  transition-duration: 0.3s;
  /* transform: translateX(-32%); */
  transform: translateX(${(props) => props.index * 32 + "%"});
  margin-bottom: calc(var(--margin-default) * 2);
`;

const ProfileBox = styled.div`
  width: 400px;
  height: 100px;
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  width: 60px;
  height: 60px;
  margin: calc(var(--margin-default) / 2) calc(var(--margin-default) / 4);
  overflow: hidden;
  border-radius: 50%;
  background-color: var(--color-bg);
  img {
    width: 100%;
    height: 100%;
  }
`;

const UserInfo = styled.div`
  width: calc(100% - 60px);
`;

const NameAndStar = styled.div`
  display: flex;
`;

const UserName = styled.div`
  width: 48%;
  min-width: 120px;
  font-size: var(--font-size-large);
`;

const UserHistory = styled.div`
  font-size: var(--font-size-normal);
`;

const ArrowBox = styled.div`
  font-size: var(--font-size-title-normal);
  position: absolute;
  top: 56%;
  &:hover {
    cursor: pointer;
    color: var(--color-focus);
  }
  &:active {
    color: var(--color-dark-focus);
  }
`;
const RightArrow = styled(ArrowBox)`
  right: 4%;
`;

const LeftArrow = styled(ArrowBox)`
  left: 4%;
`;

const Reviews = () => {
  const [index, setIndex] = useState(0);
  // 리뷰 데이터
  const reviewsData = ReviewsData();
  const reviewsList = reviewsData[2];
  // console.log(reviewsList);

  // 슬라이더 이펙트
  const isDown = useRef(false);
  const sliderRef = useRef();
  // 슬라이더 이펙트 기준
  let startX;
  let scrollL;

  // 클릭 & 드래그 이벤트
  const startDraging = (e) => {
    // console.log("start~!");
    isDown.current = true;
    startX = e.pageX - sliderRef.current.offsetLeft;
    scrollL = sliderRef.current.scrollLeft;
  };

  const slideReviews = (e) => {
    // console.log("moving!", isDown);
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollL - walk;
  };

  const stopDraging = () => {
    setIndex(0);
    // console.log("stop...", isDown);
    isDown.current = false;
  };

  const setLeftIndex = () => {
    return index === 0 ? setIndex(index) : setIndex(index + 1);
  };
  const setRightIndex = () => {
    // console.log("인덱스", index);
    // console.log("리뷰수", reviewsList.length);
    return index <= (reviewsList.length - 3) * -1
      ? setIndex(index)
      : setIndex(index - 1);
  };

  const showDetailItem = () => {};

  const userId = read_cookie("userId");
  // console.log(userId);

  return (
    <>
      <Header />
      <BodyLayout padding="0">
        <ReviewPageMenuTitle>베스트 리뷰</ReviewPageMenuTitle>
        <LeftArrow onClick={setLeftIndex}>
          <i className="fas fa-chevron-left"></i>
        </LeftArrow>
        <ReviewsContainer
          ref={sliderRef}
          onMouseDown={startDraging}
          onMouseMove={slideReviews}
          onMouseUp={stopDraging}
        >
          <Slider index={index}>
            {reviewsList.map((review) => {
              console.log(review.r_num);
              // console.log(review.resdate.split("/"));
              return (
                <ReviewItem as="li" onClick={showDetailItem}>
                  <h3>{review.name}</h3>
                  <ReviewImageBox>
                    <img
                      src={`${process.env.PUBLIC_URL}/images/reviews/${review.r_num}.jpg`}
                      alt="cafe_review"
                    />
                  </ReviewImageBox>
                  <ReviewTextBox>
                    <p>{review.info}</p>
                  </ReviewTextBox>
                  <ProfileBox>
                    <Icon>
                      <img
                        src={`${process.env.PUBLIC_URL}/images/users/${review.userid}.jpg`}
                        alt="user_icon"
                      />
                    </Icon>
                    <UserInfo>
                      <NameAndStar>
                        <UserName>{review.userid}</UserName>
                        <Stars score={review.score} />
                      </NameAndStar>
                      <UserHistory>
                        {"20" + review.resdate.split("/")[0]}.
                        {review.resdate.split("/")[1]}.
                        {review.resdate.split("/")[2]} 방문
                      </UserHistory>
                    </UserInfo>
                  </ProfileBox>
                </ReviewItem>
              );
            })}
          </Slider>
        </ReviewsContainer>
        <RightArrow onClick={setRightIndex}>
          <i className="fas fa-chevron-right"></i>
        </RightArrow>
      </BodyLayout>
      <Footer />
    </>
  );
};

export default Reviews;
