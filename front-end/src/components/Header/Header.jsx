import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { read_cookie, delete_cookie } from "sfcookies";
import { PointLetter } from "../body/mixin/Mixin";
import BorderEffect from "../body/mixin/BorderEffect";

const Observer = styled.div`
  position: relative;
`;

const Criteria = styled.div`
  width: 100%;
  height: 1px;
  position: absolute;
  top: 2px;
`;

const HeaderContainer = styled.header`
  width: calc(100% - 16px);
  height: var(--header-height);
  display: flex;
  justify-content: center;
  background-color: ${(props) => props.bgColor};
  position: fixed;
  z-index: 2;
  color: ${(props) => props.fontColor};
  border-bottom: 1px solid hsl(0, 0%, 90%);
`;

const HeaderSizeController = styled.div`
  width: 72%;
  min-width: 1024px;
  display: flex;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  position: relative;
  font-size: var(--font-size-title-large);
  font-weight: bold;
  a {
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
`;

const MenuSection = styled.section`
  width: 72%;
  display: flex;
  justify-content: flex-end;
`;

const MenuContainer = styled.ul`
  width: 80%;
  min-width: 460px;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: var(--font-size-normal);
  & > li {
    margin-right: var(--margin-default);
  }
  & > li:hover {
    color: var(--color-focus);
  }
`;

const LoginButtonContainer = styled.div`
  width: 20%;
  min-width: 152px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  font-size: var(--font-size-small);
  & > div {
    position: relative;
  }
  & > div:hover {
    color: var(--color-blur);
  }
`;

const SubMenuContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const SubMenu = styled.ul`
  min-width: 152px;
  height: ${(props) => props.heightOfSub};
  transition-duration: 0.3s;
  overflow: hidden;
  background-color: white;
  position: absolute;
  top: 60px;
  left: -48px;
  box-shadow: ${(props) =>
    props.heightOfSub === "0" ? "none" : "0px 1px 4px 1px grey"};
`;

const SubMenuItem = styled.li`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-font);
  position: relative;
  border-top: none;
  &:hover {
    cursor: pointer;
    color: var(--color-focus);
  }
`;

const Header = () => {
  const [heightOfSub, setHeightOfSub] = useState("0");
  const [homeWidth, setHomeWidth] = useState("0");
  const [profileWidth, setProfileWidth] = useState("0");
  const [recommendWidth, setRecommendWidth] = useState("0");
  const [reviewWidth, setReviewWidth] = useState("0");
  const [likeWidth, setLikeWidth] = useState("0");
  // 헤더 색 변화시키기
  const [bgColor, setBgColor] = useState("white");
  const [fontColor, setFontColor] = useState("var(--color-font)");
  const headerRef = useRef(null);

  // 로그아웃
  const onClickLogout = () => {
    delete_cookie("userId");
    delete_cookie("b_id");
    delete_cookie("popup");
  };

  // intersection observer로 헤더의 변화에 따라 색깔 변화시키기
  useEffect(() => {
    // console.log("옵저버 생성(첫 마운트 후)");

    const createObserver = () => {
      const options = {
        // null은 뷰포트 기준
        root: null,
        rootMargin: "0px",
        // thresold가 1이면 타겟이 전부 보일때 콜백 호출(전부 보이기 전에는 호출 X)
        // 0이면 1px이라도 보이면 콜백 호출
        thresold: [0, 1],
      };
      // console.log("옵션", options);

      const makeHeaderTransparent = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio === 1) {
            setBgColor("white");
            setFontColor("var(--color-font)");
          } else {
            setBgColor("var(--color-font)");
            setFontColor("white");
          }
        });
      };
      const observer = new IntersectionObserver(makeHeaderTransparent, options);
      // console.log("옵저버", observer);

      const target = headerRef.current;
      observer.observe(target);
      // console.log("타겟", target);
      // console.log(bgColor, fontColor);
    };

    createObserver();
  }, []);
  // console.log("첫 마운트");

  return (
    <Observer>
      <Criteria id="criteria" ref={headerRef} />
      <HeaderContainer bgColor={bgColor} fontColor={fontColor}>
        <HeaderSizeController>
          <LogoContainer>
            <Link to={`/`}>
              Plan.<PointLetter>D</PointLetter>
            </Link>
          </LogoContainer>
          <MenuSection>
            {read_cookie("userId").length > 0 ? (
              <MenuContainer>
                <li>
                  <Link to={`/memberhome`}>Home</Link>
                </li>
                <li>
                  <Link to={`/planning`}>Course</Link>
                </li>
                <li>
                  <Link to={`/searchplace`}>Place</Link>
                </li>
                <li>
                  <Link to={`/reviews`}>Reviews</Link>
                </li>
                <li>
                  <Link to={`/userrecommendation`}>Recommend</Link>
                </li>
                <li>
                  {/* <a href="http://192.168.0.63:9090/wherewego/pointshopList"> */}
                  <a href="http://localhost:9090/wherewego/pointshopList">
                    PointShop
                  </a>
                </li>
              </MenuContainer>
            ) : null}
            <LoginButtonContainer>
              <SubMenuContainer
                onMouseOver={() => setHeightOfSub("200px")}
                onMouseOut={() => setHeightOfSub("0")}
              >
                {read_cookie("userId").length > 0 ? (
                  <>
                    <div>Mypage</div>
                    <SubMenu heightOfSub={heightOfSub}>
                      <Link to={"/mypage"}>
                        <SubMenuItem
                          onMouseOver={() => setHomeWidth("152px")}
                          onMouseOut={() => setHomeWidth("0")}
                        >
                          MyHome
                          <BorderEffect spanWidth={homeWidth} />
                        </SubMenuItem>
                      </Link>
                      <Link to={"/individualform"}>
                        <SubMenuItem
                          onMouseOver={() => setProfileWidth("152px")}
                          onMouseOut={() => setProfileWidth("0")}
                        >
                          Profile
                          <BorderEffect spanWidth={profileWidth} />
                        </SubMenuItem>
                      </Link>
                      {/* <Link to={"/mydibs"}> */}
                      <SubMenuItem
                        onMouseOver={() => setLikeWidth("152px")}
                        onMouseOut={() => setLikeWidth("0")}
                      >
                        Reviews
                        <BorderEffect spanWidth={likeWidth} />
                      </SubMenuItem>
                      {/* </Link> */}
                      <Link to={"/myhistory"}>
                        <SubMenuItem
                          onMouseOver={() => setReviewWidth("152px")}
                          onMouseOut={() => setReviewWidth("0")}
                        >
                          History
                          <BorderEffect spanWidth={reviewWidth} />
                        </SubMenuItem>
                      </Link>
                      <Link to={"/myrecommendation"}>
                        <SubMenuItem
                          onMouseOver={() => setRecommendWidth("152px")}
                          onMouseOut={() => setRecommendWidth("0")}
                        >
                          Recommendations
                          <BorderEffect spanWidth={recommendWidth} />
                        </SubMenuItem>
                      </Link>
                    </SubMenu>
                  </>
                ) : (
                  <Link to={`/registration`}>Sign up</Link>
                )}
              </SubMenuContainer>
              <div>
                {read_cookie("userId").length > 0 ? (
                  <Link to={`/`} onClick={onClickLogout}>
                    LogOut
                  </Link>
                ) : (
                  <Link to={`/login`}>Sign in</Link>
                )}
              </div>
            </LoginButtonContainer>
          </MenuSection>
        </HeaderSizeController>
      </HeaderContainer>
    </Observer>
  );
};

export default Header;
