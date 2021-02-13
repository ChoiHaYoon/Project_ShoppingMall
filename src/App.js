/* enlint-disable */

import React,{useState, useContext, lazy, Suspense} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Button, Jumbotron } from 'react-bootstrap';
import shoesData from './shoesData.js'; // ./경로 >> ./은 현재경로라는 뜻
// 만약 보낸 변수가 많다면 가져오는 Js에서 지정한 export [ {변수1, 변수2} ] >> 이걸 그대로 써줘야한다
// 페이지 라우팅하기 1단계
import { Link, Route, Switch } from 'react-router-dom';

// ajax를 사용하기 위한 axios라이브러리 다운 받은 후 import
import axios from 'axios';
import Cart from './Cart.js';

import Watched from './Watched.js';

// import DetailPage from './Detail.js';
// lazy사용하기
let DetailPage = lazy(()=>{ return import('./Detail.js')});

// context만들기
// 만약 다른 파일에서도 사용하고 싶으면? >> 앞에 export를 사용하기
export let stockContext = React.createContext();

function App() {

  // 데이터 바인딩 하기
  // 중요한 데이터들은 App컴포넌트(부모컴포넌트)에 지정해주고 pros로 보내주는 것이 좋다 or redux파일에 보관
  let [shoes, setshoes] = useState(shoesData);

  // 재고 데이터
  let [stock, setStock] = useState([10, 20, 15]);

  return (
    <div className="App">
      {/* 상단바 */}
      <Navbar bg="light" expand="lg" className="navBar">
        <Navbar.Brand><Link to="/">Shopping_Mall</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {/* 라우터라이브러리인 라우터안에 Link태그를 이용해서 페이지 이동하게 만들기 */}
            {/* to속성 >> 경로를 지정해준다 */}
            {/* Link태그처럼 사용해 주세요 >> as={Link} */}
            <Nav.Link as={Link} to="/">HOME</Nav.Link>
            <Nav.Link as={Link} to="/cart">CART</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* 대문만들기 */}
      <Jumbotron className="main">
        <h1>2021 New Collection</h1>
        <p>
          This is a simple hero unit, a simple jumbotron-style component for calling
          extra attention to featured content or information.
        </p>
        <p>
          <Button variant="primary">Learn more</Button>
        </p>
      </Jumbotron>

      {/* 
        라우팅 2단계 >> 즉, 라우트태그를 이용해서 보여지는 페이지를 나눠주는 방식이다 
        나는 detail만 보고싶은데 메인페이지가 보이는 이유?
        맨 처음 Path에 적힌 /는 모든 path에 /가 있으면 들어가게 된다
        이것을 주어진 경로와 정확히 맞는 Route만 보여주기
        >> exact
        매칭되는 첫번째 Route만 보여주기
        >> Switch
        여기서 exact는 중복으로 Route가 보여질 수 있다 >> 경로가 정확히 맞는것만 보여주기때문에 중복가능
        but Switch는 매칭되는 첫!번!째!만 보여지기 때문에 한개의 Route만 보여진다
      */}


      <Switch>
        <Route exact path="/">
          <Watched shoes={shoes}/>
          {/* 상품진열 */}
          {/* 컴포넌트화 해도 된다 */}
          <div className="container">

            <stockContext.Provider value={stock}>

            <div className="row">
              {/* 
                className이 container와 row는 부트스트랩 문법이다 
                row >> 12개의 컬럼(세로로)으로 쪼개겠다라는 뜻 
                acontainer >> 좌우여백을 알맞게 맞추겠다라는 뜻
                col-md-4 >> 4컬럼씩 차지하는 div를 만들겠다(+md는 모바일에서 세로로 정렬이 가능함)
              */}
              {/* <div className="col-md-4">
                <img src="http://codingapple1.github.io/shop/shoes1.jpg" width="100%"/>
                <h4>{shoes[0].title}</h4>
                <p>{shoes[0].content}</p>
                <p>{shoes[0].price}</p>
              </div> */}
              {
                shoes.map(function(info, index){
                  return (
                    <ShoesInfo shoes={info} i={index+1} key={index}/>
                  )
                })
              }
            </div>

            </stockContext.Provider>
            
            {/* ajax를 이용하여 데이터 더 가져오기 */}
            <button className="btn btn-primary" onClick={() => {
              // 서버한테 get요청을 함(ajax사용)
              // 참고로 지금 받아온 것은 object가 아닌 따옴표가 있는 Json

              
              // 1. axios이용
              // axios.get('url')
              // .then(콜백함수) >> ajax가 서버요청에 성공을 하면 실행하는 코드($.ajax에서 success와 같은 방식)
              // .catch(콜백함수) >> 요청실패(error)
              // axios는 json을 자동적으로 object로 변환하여 출력해 준다
              axios.get('https://codingapple1.github.io/shop/data2.json')
              .then((data)=>{
                // 내가 알던 ajax와 같게 매개변수로 data를 받아오면서 그값을 이용해서 제작하면 된다.
                // 파라미터는 ajax요청을 하고 나서의 성공결과 모든것(왜성공했는지 까지)을 담고 있다
                // 내가 받아오는 값만 출력하고싶으면? >> 파라미터명.data를 하면 받아오는 값만 출력이 가능
                
                // 더보기 클릭하면 더 나오게 하기
                // 방법1
                // let newShoes = [...shoes];
                // for(let i = 0; i < data.data.length; i++){
                //   newShoes.push(data.data[i]);
                // }

                // 방법2
                let newShoes = [...shoes, ...data.data];
                // 대괄호를 벗기고 다시 대괄호 안에 넣는방법 >> ...변수명

                setshoes(newShoes);

              })
              .catch(()=>{
                console.log("실패")
              })

              // 2. 쌩 자바스크립트를 이용한 ajax >> fetch
              // axios와 유사하다 >> fetch(url).then(콜백함수).catch(콜백함수)
              // fetch는 axios처럼 json을 자동적으로 object화 시켜주지 않는다
              // fetch('https://codingapple1.github.io/shop/data2.json')
              // .then((data)=>{
              //   console.log(data);
              // })
              // .catch(()=>{

              // })

              // 3. 서버를 Post로 전송하는 법 >> axios.post('url', 전달 데이터);
              // 요청시 header 설정도 가능하다


            }}>더보기</button>
          </div>
        </Route>

        {/* 디테일 페이지 */}
        {/* <Route path="/detail">
          {/* <div className="container">
            <div className="row">
              <div className="col-md-6">
                <img src="https://codingapple1.github.io/shop/shoes1.jpg" width="100%" />
              </div>
              <div className="col-md-6 mt-4">
                <h4 className="pt-5">상품명</h4>
                <p>상품설명</p>
                <p>120000원</p>
                <button className="btn btn-danger">주문하기</button> 
              </div>
            </div>
          </div>  */}
          {/* 컴포넌트 따로 파일만들어서 불러오기
          <DetailPage shoes={shoes}/>
        </Route> */}
        {/* 만약 route를 깔끔하게 컴포넌트로 보여주고싶다? */}
        {/* <Route path="/detail2" component={컴포넌트명}></Route> */}


        {/* 각페이지에 여러개의 detail보여주기 */}
        <Route path="/detail/:id">
          <Watched shoes={shoes}/>
          {/* 
            path에 :id의 의미 
            >> /모든문자 라는 경로를 의미한다(아무문자열을 적었을 때 이 컴포넌트를 보여주세요 라는 의미)
            1. 콜론뒤에는 마음대로 작명
            2. 여러개 사용가능(/:id/:id)
          */}

          {/* 재고변경 함수도 props로 보내는거 쌉가넝! */}
          {/* 만약 Context를 detail에서도 사용하고 싶으면? 
            >> 간단하게 <context변수명.Provider>를 감싸주면 된다!
          */}
          <stockContext.Provider>
            {/* fallback? detailPage컴포넌트를 로딩 전까지 띄울 html을 넣어준다 */}
            <Suspense fallback={<div>로딩중이에요</div>}>
              <DetailPage shoes={shoes} stock={stock} setStock={setStock}/>
            </Suspense>
          </stockContext.Provider>
        </Route>

        <Route path="/cart">
          <Cart></Cart>
        </Route>

        <Route path="/:id"> 
          {/* path에 :id의 의미 >> /모든문자 라는 경로를 의미한다(아무문자열을 적었을 때 이 컴포넌트를 보여주세요 라는 의미) */}
          <div>아무거나 호호호호</div>
        </Route>

      </Switch>

    </div>
  );
}

function ShoesInfo(data){

  // 이미지 경로 가져오기
  let imageRode = "http://codingapple1.github.io/shop/shoes" + data.i + ".jpg";
  // 부모 컴포넌트에서 context로 보낸 값을 사용하기 
  // >> useContext훅을 사용해야한다(상단에 import로 useContext를 받아와야한다)
  let stock = useContext(stockContext);

  return (
    <div className="col-md-4">
      <Link to={"/detail/"+ (data.i-1)}>
      <img src={imageRode} width="100%"/>
      <h4>{data.shoes.title}</h4>
      <p>{data.shoes.content}</p>
      <p>{data.shoes.price}</p>
      {/* 
        여기에 재고표시를 위한 컴포넌트가 하나 더 있고 재고데이터바인딩을 해야한다면?
        >> 보통은 props를 이용해서 보낸다(data.재고데이터key이름)
        이렇게 하면 귀찮기 때문에 문법하나를 이용하여 쉽게 사용한다
        contextAPI >> 리액트의 내장문법
        props를 사용하지 않아도 하위 컴포넌터들이 부모의 값을 사용가능하게 해준다(공유)

        - context만들기 -
        1. App컴포넌트 위에 React.createContext문법을 쓴다
          >> createContext은 범위를 생성해주는 문법이다. >> 같은값을 공유할 범위
        2. 변수에 문법을 저장한다 (ex. let 변수명 = React.creat블라)
        3. 범위를 잘 기억한 후 같은 값을 공유할 html을 범위로 감싸맨다
          >> 어디에 해도 상관없다 그저 감싸주기만 하면된다
          사용방법은 <context변수명.Provider>여기 안에는 하위컴포넌트가 들어가 있으면 된다</context변수명.provider>
          안에 속성으로는 value가 있는데 공유하고 싶은 값을 넣어주면된다 value = {공유를 원하는 변수명}
        이런식으로 지정을 해주면 props로 따로 보내지 않아도 Provider안에서는 보낸 value를 사용할 수 있다
        !주의! 여기서 value는 key이름이 아닌 속성명이다

        여기서 보낸 value를 사용하려면 함수내 지역함수로 지정해줘야한다
        >> useContext사용
        ex) let 변수명 = useContext(만든context변수명)
        useContext는 훅이기 때문에 import필수

        간단한 데이터 전송은 props를 사용하는것이 좋다
        하지만 밑에처럼 하위컴포넌트 안에 하위컴포넌트가 있으면?
        >> 이경우에는 useContext를 사용하면된다
        >> 이미 1차하위컴포넌트가 Provider안에 있기 때문에 2차하위컴포넌트도 들어가있는 셈이다
        >> 대신 2차하위컴포넌트에서도 useContext를 지정해주어서 사용해야한다
       */}
       <Test index={data.i-1}></Test>
      </Link>
    </div>
  )
}

function Test(data){

  let stock = useContext(stockContext);

  return <p>재고 : {stock[data.index]}</p>
}

export default App;

// React Router1
// 라우팅이란? 페이지를 나누는 것을 이야기한다(주문페이지, 상세페이지 등등)
// 리액트에서는 react-router-dom이라는 라이브러리를 이용한다 >> yarn add react-router-dom


// 컴포넌트의 LifeCycle
// >> 컴포넌트의 인생(컴포넌트는 어떻게 살다가 죽는 것인가?) 
// 컴포넌트 등장 -> 업데이트(재렌더링) -> 퇴장
// 중간중간마다 훅을 걸 수 있다(낚시바늘 후크 생각하면 됨)
// 컴포넌트가 생성되기 전에 훅을 걸 수 있다(요청) or 삭제되기전에 훅을 걸 수 있다.
// 즉, Hook으로 컴포넌트의 인생 중간에 명령을 줄 수 있다.


// useContext말고도 Redux라는 것이 있다(라이브러리)
// Redux란?
// 모든 컴포넌트 파일들이 같을 값을 공유할 수 있는 저장공간을 생성해준다(props 대신)
// + state데이터 관리 기능도 있다
