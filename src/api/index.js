import Router from 'koa-router';
import posts from './posts';
import auth from './auth'
const api = new Router();


// api.get('/test', ctx => {
//     ctx.body ='ssssss';
// })

api.use('/posts', posts.routes());
api.use('/auth' , auth.routes());

// Export Router
//module.exports= api;
export default api;