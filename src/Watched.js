import React from 'react';
import {useHistory} from 'react-router-dom';

function Watched(data) {
    let arr = localStorage.getItem('watched');
    let history = useHistory();
    if(arr === null){
        arr = [];
        return (
            <div className="watched">
                <div className="noWatched">
                    본 게시물이 없습니다.
                </div>
            </div>
        )
    } else {
        arr = JSON.parse(arr);
        let shoes = data.shoes;

        return (
            <div className="watched">
                {
                    arr.map((item, index)=>{
                        let imgNum = parseInt(item);
                        return(
                            <div onClick={()=>{history.push('/detail/' + item)}}>
                                <img className="watchedImg" src={"http://codingapple1.github.io/shop/shoes" + (imgNum+1) + ".jpg"}></img>
                                <p>{shoes[item].title}</p>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default Watched;