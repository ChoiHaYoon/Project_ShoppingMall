// 장바구니 페이지 만들기
import React, {useState, useEffect, useContext} from 'react';
import {Table} from 'react-bootstrap';
import { connect } from 'react-redux';

// 성능잡기
// 1. 함수나 오브젝트는 콜백함수로 바로 사용하지말고 선언해서 쓰는것이 좋다
// >> 메모리 할당때문에
// 콜백함수나 이름없는 함수들은 재렌더링시 새로 메모리에 할당을해줘야하기때문에 바빠질 수 있음
// 그걸 방지하기위해 컴포넌트 밖에 선언
// 단 밑에처럼 Props를 받아와야하면 어쩔 수 없이 컴포넌트안에서 하는 수 밖에?
let style = { color : 'white' }
// 2. 애니메이션을 줄 때 레이아웃 변경 애니메이션은 좋지않다
// 레이아웃? width, height, margin, padding등등
// 자바스크립트나 transition을 이용한 레이아웃변경은 브라우저한테 큰 부담을 주는것(렌더링시간이 오래걸림)
// 그렇게 때문에 transform이나 opacity를 이용해서 애니메이션을 주는게 좋음
// 3. App.js에서 컴포넌트 import할 때 lazy loding하자
// App.js방문 시 import한 컴포넌트들을 미리 로드를 시켜놓는다 >> 부담이 된다
// Lazy loding? 컴포넌트가 필요 할 때만 가져올 수 있게 한다
// 즉, Detail컴포넌트를 처음부터가 아닌 필요할 때만 가져오게끔하는 방법
// import대신 lazy + Suspense(컴포넌트)를 사용하자
// 1) react라이브러리에서 lazy와 Suspense를 가져온다.
// 2) lazy사용법
// >> let 컴포넌트명 = lazy(()=>{ return import(컴포넌트 경로명)});
// 3) 사용을 원하는 컴포넌트명을 Suspense태그로 감싸준다
// 4) Suspense 속성으로 fallback = {html문구}를 적어준다
// fallback? 컴포넌트를 로딩전까지 보여줄 html문구를 적어주는 속성(임시 메세지 정도??)

function Cart(props){
    let state = props.state;
    // 밑에서 지정한 function에서 props화 시켜주었기 때문에 매개변수로 받아와야한다

    function closeAlert () {
        props.dispatch({ type : 'close' })
    }
    return (
        <div>
            <Table striped bordered hover variant="dark">
                <tr>
                    <th>#</th>
                    <th>상품명</th>
                    <th>수량</th>
                    <th>변경</th>
                </tr>
                {
                    state.map((item, i)=> {
                        return (
                            <tr key={i}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.quan}</td>
                                <td>
                                    {/* 
                                        redux를 쓰는 이유 두번째
                                        state 데이터 관리가능
                                        - redux에선 state데이터의 수정방법을 미리 정의한다
                                        
                                        모든것을 셋팅 후 여기서 클릭을 하면 수정하게 하는방법은?
                                        props명.dispatch() >> dispatch는 고정이기때문에 외워야한다
                                        (데이터 수정요청)
                                        dispatch({ type : 원하는 값을 입력 })
                                        >> 여기서는 버튼 클릭 시 증가라는 값이 입력이 되어 
                                        reduxer에 있는 action.type에 증가라는 값이 입력이 되게끔했다

                                        만약 데이터를 보내고 싶을때는 payload : 보낼데이터 
                                        >> 이런식으로 데이터를 보낼 수 있다
                                        reduc store에 같이 보내진다
                                    */}
                                    <button onClick={()=>{
                                        props.dispatch({ type: '증가' , number : item.id })
                                    }}>+</button>
                                    <button onClick={()=>{
                                        props.dispatch({ type: '감소', number : item.id })
                                    }}>-</button>
                                </td>
                                
                            </tr>
                        )
                    })
                }
            </Table>

            {
                props.openState === true ? 
                (<div className="my-alert2">
                <p>
                    지금 구매하시면 신규할인 20%
                    <button className="close" onClick={closeAlert}>
                        <span aria-hidden = 'true'>&times;</span>
                    </button>
                </p>
                </div>) : null
            }

        </div>
    )
}

// redux를 이용해서 전체범위의 state를 셋팅해줘야한다
// >> index.js에서 createstore로 이용해서 만든 state데이터를 셋팅
// redux store안에 있던 데이터들을 가져오는 역할의 함수
// props로 변환해주는 함수이다 / state를 props화
function data (state){
    // object를 리턴
    return {
        // store데이터를 Props로 등록하는 법
        // name : state[0].name
        // 또는 이런식으로도 가능하다
        // (store안에 있던 데이터들을 전부 state라는 이름의 Props로 바꿔주세요)
        // state : state
        // 위에꺼는 1개의 Object만일때
        // 만약 2개 이상은?
        state : state.reducer,
        openState : state.reducer2

    }
}

// redux를 사용하는 라이브러리 사용법 >> 나중에 배운다
export default connect(data)(Cart);

// export default Cart;