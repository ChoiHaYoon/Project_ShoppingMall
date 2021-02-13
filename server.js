// node.js에 연결하기 위한 필수요소
const express = require('express');
const path = require('path');
const app = express();

const http = require('http').createServer(app);
http.listen(8080, function () {
  console.log('listening on 8080')
}); 

// 2. express라이브러리 설치해야한다
// 3. npm init
// 4. node server.js실행

app.use(express.static(path.join(__dirname, 'build/static')));

app.get('/react', function(request, response){
    response.sendFile(path.join(__dirname, 'build/index.html')); // html파일 보내기

})

app.get('*', function(request, response){
  response.sendFile(path.join(__dirname, 'build/index.html')); // html파일 보내기

})