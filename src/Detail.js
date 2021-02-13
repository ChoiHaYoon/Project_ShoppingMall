// 컴포넌트 파일을 만들때는 무조건 대문자로 시작
import React, { useContext, useEffect, useState } from 'react';
// react Bootstrap
import { Navbar, Nav } from 'react-bootstrap';
import {useHistory, useParams} from 'react-router-dom';
// component가 많아지면 css작성이 고민이 많아짐(class이름을 중복으로 지정해놓는다거나...)
// 그래서 class선없없이 컴포넌트에 css를 직접 장착하는 방법이 있다 >> css in js
import styled from 'styled-components';
import './Detail.scss';

// react-transition-group >> 컴포넌트의 등장/업데이트시 transition을 쉽게 줄 수 있음
import {CSSTransition} from 'react-transition-group'; 

// 다른 파일에서 context를 받아오면 무조건 export와 import를 해와야한다
import {stockContext} from './App.js';

// redux사용하기
import { connect } from 'react-redux';

// 컴포넌트에 직접 스타일 넣어서 스타일링 하기
let Boxing = styled.div`
    padding: 20px;
`;
let 제목 = styled.h4`
    font-size : 25px;
    color : ${ data => data.색상 }
`;
// styled-components 유용한 문법 하나 더!
// -> 만약 비슷한 ui가 몇개 더 필요할 경우? ${변수명} >> 을 사용해서 쓴다
// 우리가 부모컴포넌트에서 자식컴포넌트로 props를 보내는 것처럼
// key = {value} >> 이런식으로 보내고
// 받을때는 변수명 => 변수명.key 로 받아오면 된다



// 컴포넌트의 LifeCycle
// >> 컴포넌트의 인생(컴포넌트는 어떻게 살다가 죽는 것인가?) 
// 컴포넌트 등장 -> 업데이트(재렌더링) -> 퇴장
// 중간중간마다 훅을 걸 수 있다(낚시바늘 후크 생각하면 됨)
// 컴포넌트가 생성되기 전에 훅을 걸 수 있다(요청) or 삭제되기전에 훅을 걸 수 있다.
// 즉, Hook으로 컴포넌트의 인생 중간에 명령을 줄 수 있다.

// // Lifecycle Hook의 몇개 / 원래는 class컴포넌트들만 사용가능
// class Detail2 extends React.Component {
//     // 자주사용하는 라이프사이클 훅
//     // 1. detail2컴포넌트가 mount(등장)되었을 때 실행할 코드
//     componentDidMount() {
//         // detail2가 딱 보일때(렌더링 될 때) 이 안에 있는 코드들이 실행된다
//         // 보통은 ajax를 이런곳에서 자주 사용한다.
//     }

//     // 2. detail2컴포넌트가 unmount(퇴장)되었을 때 실행할 코드
//     componentWillUnmount() {
//         // detail2가 사라질 때 이 안에 있는 코드들이 실행된다
//     }
// }


// 하지만 react 16.~부터는 위에꺼보다 더 쉽게 작성이 가능하다
function Detail(data) {
    // 더쉽게 사용하는 hook >> useEffect
    // 라이프 사이클과 같은 hook이다
    // 하지만 더 자주 사용된다
    // 1) 컴포넌트가 보일때(Mount) / 2) 컴포넌트가 update될 때
    // 특정 코드를 실행 할 수 있음

    // alert의 유무보여주기
    let [alertYN, setAlert] = useState(true);
    let [test, setTest] = useState('임시이다');

    // context받아오기
    // 사용방법은 같다
    let stock = useContext(stockContext);

    useEffect(() => {
        // my-alert2창이 2초후에 사라지게 하기
        // 몇초 후에 사라지게 하는 함수 >> setTimeout(()=>{}, 초수);
        let timemmer = setTimeout(() => {
            if(alertYN === true){
                setAlert(false);
                // setTimeout 쓸 때 주의점
                // >> 지정한 초전에 뒤로가기로 하게 되면 값이 이상하게 들어갈 수 있다.
                // >> 그렇기 때문에 Unmount될 때 타이머 해제를 시켜줘야한다
            }
        }, 2000);
        // 위에꺼만 사용하게 되면 의도치 않은 버그가 생길 수 있다.(컴포넌트가 업데이트가 된다면 또 나타날 수 있다)
        // 예를 들어 밑에있는 input에 값을 넣으면 useState값이 변경되기 때문에 재렌더링(Update)이 된다
        // 만약 이 useEffect는 맨처음 detail로드 할때만 실행시키고 싶은데 여기서 더이상 작성을 하지 않으면 계속해서 렌더링이 되고있기때문에 잘못된 코드이다.
        // 이럴 때 사용하는게 중괄호 다음에 , [실행조건]을 넣어줘서 사용을 하면된다
        // 즉, 특정 state가 변경될때만 실행시켜달라는 조건을 넣는 것 이다.
        console.log("useEffect가 계속 실행된다!!") // useEffect가 실행되는지 보기위한 log

        // 3) 컴포넌트가 사라질 때 코드를 실행 시킬 수 도 있음(unmount)
        // return function 함수명 () { 실행할 코드 } >> 이 코드는 detail이라는 컴포넌트가 사라질 때 실행되는 코드라는 것을 이야기해줌
        return function bye () {
            console.log("지성빠이! 웅!");
            // 타이머 해제스킬쓰기 >> 타이머 제거하기
            clearTimeout(timemmer);
        }
        // 4) 여러개를 사용하고 싶을때는?
        // 하나의 useEffect안에 여러개를 써도 되지만 useEffect를 여러개 사용해도 좋다!
        // 대신 순서대로 진행되기 때문에 순서에 주의하자!
    }, []); // alertYN이 변경될 때만 실행이 되는 조건을 건것이다.(여러개 가능)
                   // 조건을 안넣을 경우는? 
                   // >> 공허한 state가 변경이 되면 실행해 주세요 
                   // >> 즉, detail 업데이트를 해도 실행이 안되는것
                   // >> 페이지가 로드 됐을 때만 사용된다
    
    // 뒤로가기 함수쓰기
    // useHistory와 useState는 Hook 
    // react-router-dom v5이상 / react v16.3이상에서만 사용가능
    // 방문했던 모든 기록들을 저장해놓은 object라고 할 수 있다.
    let history = useHistory();

    // useParams >> 파라미터값을 저장해서 변수로 만들어 줄 수 있다.
    let { id } = useParams(); 
    // 변수에 넣으면 object가 들어가게 된다 >> 사용자가 입력한 URL파라미터들이 들어가게된다
    // 즉, /:id자리에 사용자가 입력한 값이 들어가게 되는 것이다.
    let findContent = data.shoes.find(function(cont){
        // cont.id와 같은 id의 shoes번호(shoes객체를 findContent에 반환한다)
        return cont.id == id;
    })

    // 몇번째 tab을 눌렀는지 저장할 state만들기
    let [tabNum, setTab] = useState(0);

    // transition 스위치 상태변경
    let [tabSwitch, setSwitch] = useState(false);



    // 최근 본 상품들 보여주게 하기
    // 다시한번 useEffect란? 컴포넌트 로드 시 무언가를 실행시켜주는 함수
    useEffect(()=>{
        
        // 일단 아무것도 없지만 꺼내보자!
        var arr = localStorage.getItem('watched');
        if(arr === null){
            arr = [];
        } else {
            // arr은 array이기 때문에 setItem시 json으로 넣어진다 그렇기 때문에 받을때 json을 풀어줘야한다
            arr = JSON.parse(arr);
        }
        
        // 여기에는 누르면 detail페이지로 넘어가게 할꺼기 때문에 현재페이지의 상품에 id값을 넣어주면 된다
        // 중복이 될 수 있기 때문에 할 필요가 없다. >> set을 써서 중복제거 해주면 된다(set특성 : 순차저장x 중복저장x)
        arr.push(id);
        arr = new Set(arr); 
        // set을 다시 arr로 저장해주면 중복저장 안된당!(깊은복사)
        arr = [...arr];

        localStorage.setItem('watched', JSON.stringify(arr));

    }); // [] >> 재렌더링시 실행안되게 하는방법


    return(
        <div className="container">
            {/*
                위에서 styled를 이용해서 미리 css를 입힌 div가 생성되는 것 
            */}
            <Boxing>
                {/* <제목 색상='black' >Detail</제목> */}
                <제목 className="titleName">Detail</제목>
                {/* 여기서는 색상이 key값이 되는것이다(중괄호 안하고 따옴표만 해줘도 된다) */}
            </Boxing>

            {/* <input value={test} onChange={(e) => {setTest(e.target.value);}} /> */}
            
            {/* 알림창 */}
            {
                alertYN === true ? 
                ( <div className="my-alert2">
                    <p>재고가 얼마 남지 않았습니다.</p>
                </div> ) 
                : null
            }

            <div className="row">
                <div className="col-md-6">
                    <img src={"https://codingapple1.github.io/shop/shoes" + (findContent.id+1) +".jpg"} width="100%" />
                </div>
                <div className="col-md-6 mt-4">
                {/* 
                    여기서 data.shoes[:id자리에 있던 값] 
                    >> 안에 들어가는 변수는? useParams훅
                */}
                    <h4 className="pt-5">{findContent.title}</h4>
                    <p>{findContent.content}</p>
                    <p>{findContent.price}</p>

                    {/* 재고 데이터 컴포넌트 불러오기 */}
                    <StockInfo stock={data.stock} index={findContent.id}></StockInfo>

                    {/* onClick을 이용해서 재고데이터 수정하기(-1) */}
                    {/* 재고데이터는 array이기 때문에 깊은복사를 하여서 복사본을 수정 후에 변경함수를 이용하여 바꿔줘야한다 
                    >> 하지만 변경함수는? app.js에 있다
                    >> props로 넘겨주면 된다! */}
                    <button className="btn btn-danger" onClick={()=>{ 
                        // 재고변경하기
                        let newStock = [...data.stock];
                        newStock[findContent.id] -= 1;
                        data.setStock(newStock);
                        // 버튼클릭 시 cart에 추가하기
                        data.dispatch({type : 'plusInfo', data : {id : findContent.id, name : findContent.title, quan : 1}})
                        // 원래 이상태로 끝내면 페이지 이동이되면서 redux도 리셋이 되기때문에 아무것도 나타나질 않는다
                        history.push('/cart');
                        // history.push(url)
                        // 라우터 쓰는법 >> useHistory훅 >> 페이지 이동을 강제로 시켜준다
                    }}>주문하기</button>
                    &nbsp;
                    {/* Link말고도 다음페이지로 이동하게 만들 수 있다. */}
                    <button className="btn btn-danger" onClick={() => {
                        // useHistory 훅안에 goBack이라는 함수사용해서 뒤로가기
                        history.goBack();
                        // 특정경로로 이동도 가능하다
                    //   history.push("/"); >> push함수로 원하는 경로를 넣으면 그경로로 이동하게 해준다
                    }}>뒤로가기</button> 
                </div>
            </div>

            {/* 
                탭기능 만들기 >> 예전에 만들었던 UI제작방법이랑같음(useState이용) 
                탭기능은 true false가 아닌 몇번째 버튼을 눌렀는지를 따지게 하기

                부트스트랩을 이용
                - evnetKey : 버튼들 마다 유니크한 값을 부여하는 것
                - defaultactiveKey : 어떤 키값을 default(기본)으로 할것인지(방문시)

                몇번째 버튼을 눌렀는지 저장할 state를 만들어줘야한다(eventKey값 저장)
            */}
            <Nav className="mt-5" variant="tabs" defaultActiveKey="tap-0">
                <Nav.Item>
                    <Nav.Link eventKey="tap-0" onClick={() => {setSwitch(false); setTab(0)}}>탭1</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="tap-1" onClick={() => {setSwitch(false); setTab(1)}}>탭2</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="tap-2" onClick={() => {setSwitch(false); setTab(2)}}>탭3</Nav.Link>
                </Nav.Item>
            </Nav>

            {/* 삼항연산자는 3개이상은 못하기때문에 따로 컴포넌트를 사용하여서 해줘야한다 */}
            <CSSTransition in={tabSwitch} classNames="wow" timeout={500}>
            <TabCon tabNumber={tabNum} setSwitch={setSwitch}/>
            </CSSTransition>
            {/* 
                애니메이션은 css로 똑같이 만들면 된다 + 또는 라이브러리 사용도 가능
                >> yarn add / npm add react-transition-group  
                >> 컴포넌트의 등장/업데이트시 transition을 쉽게 줄 수 있음
                1. 애니메이션을 주고싶은곳에 <CSSTransition>을 감싸면 된다
                * 속성들 *
                - in : 애니메이션 동작 스위치(true일때만 애니메이션이 부여됨)
                - classNames : 애니메이션 이름을 지정(className)
                - timeout : 몇초동안 동작하는지 의미(fade out) >> 없으면 큰일남
                2. 이렇게 하면 셋팅은 완료 >> 디자인을 클래스명대로 작성하면 된다(css)
                3. 원할 때 스위치 켜기 >> 이것또한 state로 저장 해서 쓰기
                4. useEffect를 이용해서 탭이 나올때 마다 true로 나오게하기
                + 다른탭을은 false로 만들어줘야하기때문에 onClick에 setSwitch(false)도 해주기
                >> setTab보다 먼저해줘야 이전탭의 내용이 사라지게 된다

                다른 변경들도 많기때문에 react-transition-group라이브러리 이용법 검색해보기
            */}

        </div> 
    )
}
// 탭 컴포넌트
function TabCon(data){

    useEffect(() => {
        data.setSwitch(true)
    })

    if(data.tabNumber === 0){
        return <div className="tabBox">11111</div>
    } else if(data.tabNumber === 1){
        return <div className="tabBox">22222</div>
    } else if(data.tabNumber === 2){
        return <div className="tabBox">33333</div>
    }
}


// 재고 컴포넌트
function StockInfo(data) {
    return (
        <p>재고 : {data.stock[data.index]}</p>
    )
}


// redux 함수 지정
function data (state) {
    return {
        state : state.reducer,
        openState : state.reducer2
    }
}

export default connect(data)(Detail);