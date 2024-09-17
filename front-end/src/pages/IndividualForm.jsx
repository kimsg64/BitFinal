import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Form from "../components/body/mixin/Form";
import CheckBoxSet from "../components/body/mixin/CheckBoxSet";
import { BodyLayout, Button, MenuTitle } from "../components/body/mixin/Mixin";
import {
  ErrorMsg,
  FormInput,
  ItemContainer,
  Label,
  SubmitButton,
  LineWrapper,
  CenterWrapper,
} from "../components/body/registrationForm/FormMixin";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import { read_cookie } from "sfcookies";

const BottomSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SubmitSection = styled.section`
  width: 40em;
  height: 80px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

const CheckInput = styled.input`
  width: 24em;
  margin: 0 var(--margin-default) calc(var(--margin-default) / 4) 0;
  padding: calc(var(--padding-small) * 2) calc(var(--padding-default) * 2);
  font-size: var(--font-size-small);
  text-align: left;
  border: 2px solid var(--color-bg);
  background-color: var(--color-bg);
  &:focus {
    outline: none;
  }
  &:invalid:not(:focus):not(:placeholder-shown) {
    border: 2px solid var(--color-focus);
  }
  border: 2px solid ${(props) => (props.check ? "none" : "var(--color-focus)")};
`;

const IndividualForm = ({ history }) => {
  const [userId, setUserId] = useState("");
  const [idCheck, setidCheck] = useState(false);
  const [pwd, setPwd] = useState("");
  // 비밀번호 체크용(userPwd2)
  const [isSame, setIsSame] = useState(false);
  const [name, setName] = useState("");
  const [num, setNum] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  // 임시값
  // const [zip, setZip] = useState("12345");
  const [addr, setAddr] = useState("");
  // const [addrDetail, setAddrDetail] = useState("");
  const [startdate, setStartdate] = useState("");
  const [opt, setOpt] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userData, setUserData] = useState(null);

  // 휴대폰 인증
  const [checkNum, setCheckNum] = useState(0);
  const [check, setCheck] = useState(true);
  const [ranInt, setRanInt] = useState(0);

  useEffect(() => {
    // 마이페이지에서 수정하러 왔을 때만 axios에서 유저 정보 받아오기
    if (read_cookie("userId").length > 0) {
      // 쿠키 읽어서 유저 아이디가 있다면 서버에서 정보 받아오기
      const userId = read_cookie("userId");
      const body = {
        userId: userId,
      };
      axios
        .post("/wherewego/getUserData", body)
        .then((response) => {
          // console.log(response.data);
          setUserData(response.data);
          setIsLoaded(true);
        })
        .catch((error) => {
          // console.log(error)
        });
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      // console.log("다 받았으니 세팅하자");
      // 할 일
      // 1. 고정값: 아이디(중복 체크 버튼 제거), 이름, 주민번호
      // 2. 수정 가능 값: 연락처, 이메일, 주소, 우편번호, 상세주소, 기념일, 관심사
      // 3. 초기화 값: 비밀번호, 비밀번호 확인
      // 4. 회원가입 => 수정 완료로 변경
      setUserId(userData.userId);
      setName(userData.name);
      setNum(userData.num);
      setTel(userData.tel);
      // setZip(userData.zip);
      // 날짜
      if (userData.startdate === null) {
        return;
      } else {
        const year = userData.startdate.substring(0, 4);
        const month = userData.startdate.substring(5, 7);
        const date = userData.startdate.substring(8, 10);
        setStartdate(`${year}-${month}-${date}`);
      }
      // 로/동을 기준으로 addr, addrDetail로 나누기
      setAddr(userData.addr);
      // userData.addr.includes("동")
      //   ? setAddr(userData.addr.split("동")[0] + "동")
      //   : userData.addr.includes("로")
      //   ? setAddr(userData.addr.split("로")[0] + "로")
      //   : setAddr("");
      // userData.addr.includes("동")
      //   ? setAddrDetail(userData.addr.split("동")[1])
      //   : userData.addr.includes("로")
      //   ? setAddrDetail(userData.addr.split("로")[1])
      //   : setAddrDetail("");
      setEmail(userData.email);
      // 옵션 잘라서 넣기
      setOpt(userData?.opt?.split("#"));
    }
  }, [isLoaded]);

  // console.log("시작");
  // console.log(opt);

  // 기념일은 최댓값이 오늘
  const setMaxDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    // console.log(`${year}-${month}-${day}`);
    return `${year}-${month}-${day}`;
  };

  // 비밀번호 더블체크
  const checkPwd = (e) => {
    // console.log(e.target.value);
    // console.log(pwd);
    if (e.target.value === "") return;
    return pwd === e.target.value ? setIsSame(true) : setIsSame(false);
  };

  // 하이픈 자동 입력
  const insertHyphen = (e, num) => {
    // console.log(e.target.value.length, num);
    // console.log("키코드", e.keyCode);
    return e.target.value.length === num && e.keyCode !== 8 && e.keyCode !== 46
      ? (e.target.value += "-")
      : e.target.value;
  };

  const onClickTelCheck = async () => {
    // console.log("사용자 입력 넘버", checkNum);
    // axios
    //   .post("/wherewego/telcheck", { tel: tel })
    //   .then((response) => {
    //     // console.log(response.data);
    //     // 전달받은 데이터의 ranInt === checkNum이면 setCheck true => valid!
    //     setRanInt(response.data);
    //   })
    //   .catch((error) => {
    //     // console.log(error)
    //   });

    const response = await axios.post("/wherewego/telcheck", { tel: tel });
    setRanInt(response.data);
  };

  useEffect(() => {
    if (ranInt !== 0 && checkNum !== 0) {
      ranInt === checkNum ? setCheck(true) : setCheck(false);
    }
  }, [ranInt, checkNum]);
  // console.log(check);
  // console.log(checkNum);
  // console.log(ranInt);

  const onClickDoubleCheck = async () => {
    // axios
    //   .post("/wherewego/idDoubleCheck", { userId: userId })
    //   .then((response) => {
    //     // console.log(response.data);
    //     // 결과가 0이 아니면 중복(false)
    //     if (response.data === 0) {
    //       setidCheck(true);
    //       alert(`${userId}를 사용할 수 있습니다!`);
    //     } else {
    //       setidCheck(false);
    //       alert("동일한 아이디가 존재합니다!");
    //     }
    //   })
    //   .catch((error) => {
    //     // console.log(error)
    //   });

    const response = await axios.post("/wherewego/idDoubleCheck", {
      userId: userId,
    });
    if (response.data === 0) {
      setidCheck(true);
      alert(`${userId}를 사용할 수 있습니다!`);
    } else {
      setidCheck(false);
      alert("동일한 아이디가 존재합니다!");
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (check && idCheck) {
      const url = isLoaded ? "/wherewego/editUser" : "/wherewego/registerUser";

      const body = {
        userId: userId,
        pwd: pwd,
        name: name,
        num: num,
        tel: tel,
        email: email,
        // zip: zip,
        // addr: addr + " " + addrDetail,
        addr: addr,
        startdate: startdate,
        opt: opt.join("#"),
      };
      // console.log("바디", body);

      axios
        .post(url, body)
        .then((response) => {
          // console.log("response : ", response.data);
          if (response.data > 0) {
            isLoaded
              ? alert("회원정보 수정이 완료되었습니다!")
              : alert("회원가입이 완료되었습니다!");
            isLoaded ? history.push("/mypage") : history.push("/login");
          } else {
            isLoaded
              ? alert("회원정보 수정에 실패하였습니다...!")
              : alert("회원가입에 실패하였습니다...!!!");
          }
        })
        .catch((error) => {
          // console.log("failed", error);
          isLoaded
            ? alert("회원정보 수정에 실패하였습니다...!")
            : alert("회원가입에 실패하였습니다...");
        });
    } else if (!check && idCheck) {
      alert("인증번호가 일치하지 않습니다!");
    } else {
      alert("중복된 아이디가 존재합니다!");
    }
  };

  return (
    <>
      <Header />
      <BodyLayout>
        <MenuTitle>{isLoaded ? "회원정보 수정" : "회원가입"}</MenuTitle>
        <Form onSubmit={onSubmitForm} encType="multipart/form-data">
          <CenterWrapper>
            <LineWrapper>
              <ItemContainer>
                <Label htmlFor="userId">아이디</Label>
                {isLoaded ? (
                  <FormInput type="text" value={userId} disabled />
                ) : (
                  <FormInput
                    type="text"
                    required
                    minLength="6"
                    maxLength="14"
                    pattern="[A-Za-z]{1}\w{5,14}"
                    placeholder="아이디"
                    onKeyUp={(e) => setUserId(e.target.value)}
                  />
                )}
                <ErrorMsg>
                  아이디는 6~14자의 영문 대소문자, 숫자로 이루어져야 하며, 첫
                  글자는 영문자만 입력할 수 있습니다.
                </ErrorMsg>
              </ItemContainer>
              {isLoaded ? null : (
                <Button
                  type="button"
                  position="absolute"
                  fromTop="60px"
                  fromLeft="240px"
                  onClick={onClickDoubleCheck}
                >
                  중복 확인
                </Button>
              )}
            </LineWrapper>
            <LineWrapper>
              <ItemContainer>
                <Label htmlFor="pwd">비밀번호</Label>
                <FormInput
                  type="password"
                  required
                  minLength="8"
                  maxLength="16"
                  pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$"
                  placeholder="비밀번호"
                  onKeyUp={(e) => setPwd(e.target.value)}
                />
                <ErrorMsg>
                  비밀번호는 8자 이상이어야 하며, 숫자, 영문 대소문자,
                  특수문자를 모두 포함해야 합니다.
                </ErrorMsg>
              </ItemContainer>
              <ItemContainer>
                <Label htmlFor="userPwd2">비밀번호 확인</Label>
                <FormInput
                  type="password"
                  required
                  maxLength="16"
                  placeholder="비밀번호 확인"
                  onKeyUp={checkPwd}
                  className="check"
                  isSame={isSame}
                  autoComplete="new-password"
                />
                <ErrorMsg>비밀번호가 일치하지 않습니다.</ErrorMsg>
              </ItemContainer>
            </LineWrapper>
            <LineWrapper>
              <ItemContainer>
                <Label htmlFor="name">이름</Label>
                {isLoaded ? (
                  <FormInput type="text" value={name} disabled />
                ) : (
                  <FormInput
                    type="text"
                    required
                    minLength="2"
                    maxLength="8"
                    placeholder="이름"
                    pattern="^[가-힣]{2,8}$"
                    onKeyUp={(e) => setName(e.target.value)}
                  />
                )}
                <ErrorMsg>올바른 이름을 입력해 주세요.</ErrorMsg>
              </ItemContainer>
              <ItemContainer>
                <Label htmlFor="num">주민등록번호</Label>
                {isLoaded ? (
                  <FormInput type="password" value={num} disabled />
                ) : (
                  <FormInput
                    type="text"
                    required
                    maxLength="14"
                    placeholder="ex) 000000-0000000"
                    pattern="^[0-9]{2}[01]{1}[0-9]{1}[0-3]{1}[0-9]{1}-[0-9]{7}$"
                    onKeyDown={(e) => insertHyphen(e, 6)}
                    onKeyUp={(e) => setNum(e.target.value)}
                  />
                )}
                <ErrorMsg>올바른 주민등록번호를 입력해 주세요.</ErrorMsg>
              </ItemContainer>
            </LineWrapper>
            <LineWrapper>
              <ItemContainer>
                <Label htmlFor="tel">연락처</Label>
                {isLoaded ? (
                  <FormInput
                    type="text"
                    required
                    minLength="9"
                    maxLength="11"
                    placeholder="ex) 01012349874"
                    pattern="^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$"
                    onKeyUp={(e) => setTel(e.target.value)}
                    onChange={(e) => setTel(e.target.value)}
                    value={tel}
                  />
                ) : (
                  <FormInput
                    type="text"
                    required
                    minLength="9"
                    maxLength="11"
                    placeholder="ex) 01012349874"
                    pattern="^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$"
                    onKeyUp={(e) => setTel(e.target.value)}
                  />
                )}
                <Button
                  type="button"
                  position="absolute"
                  fromTop="60px"
                  fromLeft="240px"
                  onClick={onClickTelCheck}
                >
                  본인 인증
                </Button>
                <ErrorMsg>올바른 연락처를 입력해 주세요.</ErrorMsg>
              </ItemContainer>
              <ItemContainer>
                <Label htmlFor="check">인증번호</Label>
                <CheckInput
                  type="text"
                  required
                  minLength="4"
                  maxLength="4"
                  placeholder="인증번호 네 자리를 입력해 주세요"
                  pattern="\d{4}"
                  onKeyUp={(e) => setCheckNum(parseInt(e.target.value))}
                  check={check}
                />
              </ItemContainer>
            </LineWrapper>
            <LineWrapper>
              {/* <ItemContainer width="16.5em">
                <Label htmlFor="zip">우편번호</Label>
                {isLoaded ? (
                  <FormInput
                    type="text"
                    width="16em"
                    className="optional"
                    onChange={(e) => setZip(e.target.value)}
                    value={zip}
                    minLength="5"
                    maxLength="5"
                  />
                ) : (
                  <FormInput
                    type="text"
                    width="16em"
                    className="optional"
                    minLength="5"
                    maxLength="5"
                  />
                )}
              </ItemContainer>
              <Button
                type="button"
                position="absolute"
                fromTop="60px"
                fromLeft="152px"
                width="54px"
              >
                검색
              </Button> */}
              <ItemContainer>
                <Label htmlFor="addr">주소</Label>
                {isLoaded ? (
                  <FormInput
                    type="text"
                    width="51em"
                    className="optional"
                    onKeyUp={(e) => setAddr(e.target.value)}
                    onChange={(e) => setAddr(e.target.value)}
                    value={addr}
                  />
                ) : (
                  <FormInput
                    type="text"
                    width="51em"
                    className="optional"
                    onKeyUp={(e) => setAddr(e.target.value)}
                  />
                )}
              </ItemContainer>
            </LineWrapper>
            <LineWrapper>
              {/* </LineWrapper>
            <LineWrapper> */}
              {/* <ItemContainer>
                <Label htmlFor="addrDetail">상세주소</Label>
                {isLoaded ? (
                  <FormInput
                    type="text"
                    width="28em"
                    className="optional"
                    onKeyUp={(e) => setAddrDetail(e.target.value)}
                    onChange={(e) => setAddrDetail(e.target.value)}
                    value={addrDetail}
                  />
                ) : (
                  <FormInput
                    type="text"
                    width="28em"
                    className="optional"
                    onKeyUp={(e) => setAddrDetail(e.target.value)}
                  />
                )}
              </ItemContainer> */}
              <ItemContainer>
                <Label htmlFor="email">이메일</Label>
                {isLoaded ? (
                  <FormInput
                    type="email"
                    required
                    placeholder="ex) abc@naver.com"
                    pattern="^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$"
                    onKeyUp={(e) => setEmail(e.target.value)}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                ) : (
                  <FormInput
                    type="email"
                    required
                    placeholder="ex) abc@naver.com"
                    pattern="^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$"
                    onKeyUp={(e) => setEmail(e.target.value)}
                  />
                )}
                <ErrorMsg>올바른 이메일 주소를 입력해 주세요.</ErrorMsg>
              </ItemContainer>
              <ItemContainer>
                <Label htmlFor="startdate">기념일</Label>
                {isLoaded ? (
                  <FormInput
                    type="date"
                    max={setMaxDate()}
                    className="optional"
                    onChange={(e) => setStartdate(e.target.value)}
                    value={startdate}
                  />
                ) : (
                  <FormInput
                    type="date"
                    max={setMaxDate()}
                    className="optional"
                    onChange={(e) => setStartdate(e.target.value)}
                  />
                )}
              </ItemContainer>
            </LineWrapper>
          </CenterWrapper>
          <BottomSection>
            <ItemContainer margin="calc(var(--margin-default) / 2) 84px 0 0">
              <Label>관심사</Label>
              <CheckBoxSet opt={opt} setOpt={setOpt} />
            </ItemContainer>
            <SubmitSection>
              <SubmitButton type="submit">
                {isLoaded ? "수정완료" : "회원가입"}
              </SubmitButton>
            </SubmitSection>
          </BottomSection>
        </Form>
      </BodyLayout>
      <Footer />
    </>
  );
};

export default IndividualForm;
