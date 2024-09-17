import React, { useState } from "react";
import { Link } from "react-router-dom";
import { bake_cookie, delete_cookie, read_cookie } from "sfcookies";
import axios from "axios";
import styled from "styled-components";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import {
  BodyLayout,
  Checkbox,
  CheckboxLabel,
} from "../components/body/mixin/Mixin";
import ToggleButton from "../components/body/mixin/ToggleButton";

const LoginForm = styled.form`
  width: 480px;
  height: auto;
  padding: calc(var(--padding-default) * 2);
  margin-top: var(--margin-header-to-body);
  background-color: var(--color-bg);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0px 2px 4px 2px grey;
  h1 {
    margin-top: var(--margin-default);
    font-weight: 800;
  }
`;

const InputContainer = styled.div`
  position: relative;
  ::after {
    content: "로그인 정보가 일치하지 않습니다!";
    font-size: var(--font-size-normal);
    color: var(--color-focus);
    font-weight: 800;
    position: relative;
    top: 40px;
    left: 20%;
    visibility: ${(props) => props.visibility};
  }
`;

const InputBox = styled.input`
  width: 100%;
  font-size: var(--font-size-large);
  margin-top: calc(var(--margin-default) / 2);
  padding: calc(var(--padding-default) / 2);
  border: 2px solid white;
  border-radius: 4px;
  &:focus {
    outline: none;
    border: 2px solid var(--color-font);
    /* 잘못된 입력 발생시 pink */
  }
`;

const RadioContainer = styled.div`
  width: 100%;
  margin-right: 0;
  margin-top: var(--margin-default);
  display: flex;
  justify-content: flex-end;
`;

const CheckboxLabelWithoutMargin = styled(CheckboxLabel)`
  justify-content: flex-end;
  margin: calc(var(--margin-line-space) * 2) 0 0 0;
`;
const CheckboxWithoutMargin = styled(Checkbox)`
  margin-left: 0;
`;

const SubmitButton = styled(InputBox)`
  margin-top: calc(var(--margin-default) * 1.5);
  background-color: var(--color-green);
  border: 2px solid var(--color-green);
  border-radius: 4px;
  color: white;
  transition-duration: 0.2s;
  :hover {
    cursor: pointer;
    /* transform: scale(1.02); */
    color: var(--color-light-green);
  }
  &:active {
    background-color: var(--color-dark-green);
    color: var(--color-green);
  }
`;

const NormalButton = styled(SubmitButton)`
  margin-top: calc(var(--margin-default) / 2);
`;

const Login = ({ history }) => {
  const [classification, setClassification] = useState("individual");
  const [userId, setUserId] = useState("");
  const [pwd, setPwd] = useState("");
  const [keepSession, setKeepSession] = useState(false);
  // 스타일 변경을 위한 props
  const [isSucceeded, setIsSucceeded] = useState(true);

  // console.log("당신의 상태는?", classification);

  const onClickKeepSession = () => {
    setKeepSession(!keepSession);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    delete_cookie("userId");
    delete_cookie("b_id");
    // console.log(classification);
    // console.log(keepSession);
    // console.log(userId);

    const url =
      classification === "individual"
        ? "/wherewego/user/userLogin"
        : "/wherewego/business/businessLogin";
    // console.log(url);
    const body =
      classification === "individual"
        ? {
            userId: userId,
            pwd: pwd,
          }
        : {
            b_id: userId,
            pwd: pwd,
          };
    // console.log(body);

    axios
      .post(url, body)
      .then((response) => {
        // console.log("response : ", response.data);
        if (response.data > 0) {
          // 그냥 경고 띄우기용
          setIsSucceeded(true);
          // console.log("ㅜㅜ");
          // 로그인 성공시 쿠키 설정 후 다시 백으로 보내서 세션에 등록
          if (classification === "individual") {
            // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
            // if (userId === "admin") {
            //   window.location.href = "http://localhost:9090/wherewego";
            // }
            // 일반 사용자
            bake_cookie("userId", userId);
            // 사업자는 삭제
            delete_cookie("b_id");
            axios.get("/wherewego/user/checkSession").then((res) => {
              // console.log(res.data);
              // 로컬터널 이용, 임시 공개용 주소
              // 백 주소는
              res.data ? history.push("/memberhome") : alert("로그인 실패...");
            });
          } else {
            // console.log("흐허허...");
            // 일반 사용자는 삭제
            delete_cookie("userId");
            // 사업자
            bake_cookie("b_id", userId);

            // 쿠키 들어갔는지 확인
            // console.log(read_cookie("b_id"));

            // axios.get("/wherewego/business/checkSession").then((res) => {
            //   console.log("세션 체크 결과", res.data);
            //   res.data
            //     ? (window.location.href =
            //         "http://192.168.0.63:9090/wherewego/business/gohome")
            //     : alert("로그인 실패...");
            // });

            axios
              .post("/wherewego/business/checkSession", { userId: userId })
              .then((res) => {
                // console.log(res.data);
                window.location.href =
                  "http://192.168.0.63:9090/wherewego/business/gohome";
                // "http://localhost:9090/wherewego/business/gohome";
              });
          }
        } else {
          setIsSucceeded(false);
        }
      })
      .catch((error) => {
        // console.log("failed", error);
        setIsSucceeded(false);
      });
  };
  // 로그인 실패시 회원가입 버튼에 포인트 주기?
  return (
    <>
      <Header />
      <BodyLayout>
        <LoginForm onSubmit={onSubmitForm}>
          <h1>Sign in</h1>
          <InputContainer visibility={isSucceeded ? "hidden" : "visible"}>
            <RadioContainer>
              <ToggleButton setClassification={setClassification} />
              {/* <CheckboxLabelWithoutMargin>
                <CheckboxWithoutMargin
                  type="radio"
                  name="classification"
                  required
                  value="individual"
                  onChange={(e) => setClassification(e.target.value)}
                  checked={classification === "individual" ? true : false}
                />
                개인
              </CheckboxLabelWithoutMargin>
              <CheckboxLabelWithoutMargin>
                <CheckboxWithoutMargin
                  type="radio"
                  name="classification"
                  required
                  value="company"
                  onChange={(e) => setClassification(e.target.value)}
                  checked={classification === "company" ? true : false}
                />
                사업자
              </CheckboxLabelWithoutMargin> */}
            </RadioContainer>
            <InputBox
              type="text"
              placeholder="ID"
              name="userId"
              id="userId"
              required
              maxLength="20"
              onKeyUp={(e) => setUserId(e.target.value)}
            />
            <InputBox
              type="password"
              placeholder="Password"
              name="pwd"
              id="pwd"
              required
              maxLength="20"
              onKeyUp={(e) => setPwd(e.target.value)}
            />
            <CheckboxLabelWithoutMargin>
              <CheckboxWithoutMargin
                type="checkbox"
                name="keepSession"
                value={keepSession}
                onClick={onClickKeepSession}
              />
              로그인 유지하기
            </CheckboxLabelWithoutMargin>
          </InputContainer>
          <SubmitButton type="submit" value="로그인" />
          <Link to={"/registration"}>
            <NormalButton type="button" value="회원가입" />
          </Link>
          <NormalButton type="button" value="ID, 비밀번호 찾기" />
        </LoginForm>
      </BodyLayout>
      <Footer />
    </>
  );
};

export default Login;
