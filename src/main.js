require('dotenv').config();
import  koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser'; // Request body 에 json 형식으로 데이터를 넣어주면, 이를 파싱하여 서버에서 사용할 수 있게함 .
import mongoose from 'mongoose';
import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';

//import fake data
//import createFakeData from './createFakeData';

// eslint-disable-next-line no-undef
const { PORT , MONGO_URI } = process.env;

// Mongno DB 설정 
mongoose
    .connect(MONGO_URI, {useNewUrlParser : true , useFindAndModify : false})
        .then(()=>{
            console.log('Conncected to MongoDB');
        })
        .catch(e => {
            console.log(e);
        })
/////////////////
const app = new koa();
const router = new Router();

// setting Router
router.use('/api',api.routes());

//라우터 설정 전에  bodyParser 적용 
app.use(bodyParser());

// 라우터 설정 전에 token 검증 해줘야함
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods())
 
const port = PORT || 4000;
app.listen(port, () => {
  console.log('Listening port 4000!');
});