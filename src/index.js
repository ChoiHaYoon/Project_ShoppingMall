import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// 라우터 셋팅(from뒤에 ./가 없고 이름만있다? >> 라이브러리 이름이라고 보면 된다(설치한 라이브러리))
import {BrowserRouter} from 'react-router-dom';

// redux셋팅하기
// 1. Import Provider하기
// store는 state의 보관통이라고 생각을 하면 된다
import {Provider} from 'react-redux';
import { createStore, combineReducers } from 'redux';

// state초기값
let defaultState = [
  { id: 0, name : 'Good신발', quan : 2},
  { id: 1, name : '멋진신발', quan : 3 }
]

// redux수정방법 정의(셋팅)! >> reducer함수를 정의
// state초기 값도 원래는 이 함수에 넣어둬야한다
function reducer(state = defaultState, action){
  // reducer함수는 state값을 뱉어야 한다(항상)
  // 그래야 reducer를 쓴 곳에 정상적으로 값이 나오게 된다
  // 아무것도 변경이 되지않을때는 기본 state를 뱉게끔 하기 때문
  // state = defaultState >> 이 문법은 default parameter문법이다(es6)
  // 데이터 초기값을 넣는 방식이다

  // 데이터 수정방법 미리정의하기
  // 수정이 됐을 경우 modifyState가 수정이 안됐을 경우에는 state가 나가게끔 하기
  // if문에는 수정되는 조건을 적어주면 된다
  // >> action.type(데이터가 수정되는 조건)
  // 이제 '증가'라는것은 수정버튼이 있는곳에서 onClick을 하면 증가가 여기로 오게끔 하면 된다
  // 데이터 수정은 여기서 해주면 된다
  // 값이 추가 될 때 state에 값을 추가하기
  if( action.type === 'plusInfo' ){
    // state안에 값을 찾아주는 함수 >> findIndex
    // 이 함수는 조건이 true이면 몇번째에 그값이 있는지 return 해 준다
    let indexNum = state.findIndex(function(a){
      // a는 array안에 있는 하나하나의 데이터를 이야기 한다
      return a.id === action.data.id
    })

    let modifyState = [...defaultState];

    if(indexNum >= 0){
      modifyState[indexNum].quan++;
    } else {
      modifyState.push(action.data)
    }
    
    return modifyState;
  } else if(action.type === '증가'){
    // Cart에서 payload라는 키값으로 보낸 데이터를 받고싶을때는?
    // action에 저장되어있기 때문에 거기서 받아쓰면된다
    let modifyState = [...defaultState];
    modifyState[action.number].quan++;
    return modifyState
  } else if(action.type === '감소') {
    let modifyState = [...defaultState];
    modifyState[action.number].quan--;
    if(modifyState[action.number].quan <= 0){
      modifyState[action.number].quan = 0;
    }
    return modifyState
  } else {
    return state;
  }
  

}

// 만약 reducer를 하나 더 만들어야한다면?
// 하나 더 만들면 되지!?
// state하나 더 만들기
let closeDefault = true;

function reducer2 (state = closeDefault, action){
  if(action.type === 'close'){
    let modifyClose = false;
    return modifyClose;
  } else {
    return closeDefault;
  }
}

// 만든 reducer를 모두다 추가하는 방법
// 원래 하나만 보낼때는? 
// let store = createStore(reducer);
// 두개 이상 보낼때는? >> combineReducers  
let store = createStore(combineReducers({reducer, reducer2})); 

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename="/test_shoppingmall/">
    {/* BrowserRouter태그를 사용하게 되면 
    >> /abc로 접속하면 A페이지를 보여주고 /def로 접속하면 B페이지를 보여주는 형식 
    
    두가지 방법이 있다
    1. BrowserRouter >> #기호 없이 동작
    2. HashRouter >> #기호를 이용해서 동작
    HashRouter는 라우팅을 안전하게 할 수 있음 
    >> 주소창은 서버에게 요청하는 것인데 주소창에 #/ 이 뒷부분은 서버에 절대 요청을 하지 않는것을 의미한다
    BrowserRouter는 라우팅을 리액트가 아닌 서버에게 요청할 수 있어서 위험하다(페이지가 없다고 뜰 수도 있음)
    즉, BrowserRouter는 서버가 있을 때 사용 / HashRouter는 서버가 없을 때 사용한다
    만약 BrowserRouter를 서버 없이 사용할 때 사용하고 싶으면 서버라우팅방지를 하는 API를 작성해야함
    */}
    {/* 
      redux셋팅 2. App컴포넌트를 Provider로 감싸기
      이렇게 감싸진애들을 props없이도 state공유가 가능하다
      state는 index.js에 만들어도 된다
      위에 만들어진 state를 props로 전송
     */}
    <Provider store={store}>
      <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// PWA란?
// Progressive Web App
// 구글에서 밀고있는 것으로 웹사이트를 안드로이드/ios모바일 앱처럼 사용할 수 있게 만든 일종의 웹개발 기술
// 웹사이트를 모바일 앱으로 발행해서 쓸 수 있게하는것
// 앱으로 발행하는게 아니라 웹사이트 자체를 스마트폰 홈화면에 설치를 하는 것
// 1. 장점
// 1) 스마트폰, 태블릿 바탕화면에 웹사이트를 설치 가능하게 한다
// (상단에 Url이 없는 크롬 브라우저가 뜬다 >> 앱이랑 구별x)
// 2) 오프라인에서도 동작가능 (service-worker.js)라는 파일과 브라우저의 Cache storage덕분에
// >> 자바스크립트로 게임을 만들 때 유용하다
// 3) 설치유도비용이 적다(최근에 쇼핑몰에서 사용을 많이 한다)

// PWA화 하려면?
// manifest.json과 service-worker.js가 필요하다
// 2020.10.30일이후로 service-worker를 create-react-app을 제작할 때 만들어 주질않는다
// 직접만들어도 된다...ㅠ
// 혹은 npx create-react-app 프로젝트명 --template cra-template-pwa
// 처음부터 프로젝트를 만들 때 저 명령어를 사용하면 된다
