import Joi from 'joi';
import User from '../../models/user';

/* register */
export const register = async (ctx) => {
  // request body validation
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });

  //const result = Joi.validate(ctx.request.body, schema);
  const result = Joi.assert(ctx.request.body, schema);
  console.log(result);
  // if (result.error) {
  //   ctx.status = 400;
  //   ctx.body = result.error;
  //   return;
  // }

  const { username, password } = ctx.request.body;
  try {
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409; //conflict
      return;
    }

    const user = new User({
      username,
    });

    await user.setPassword(password);
    await user.save();

    ctx.body = user.serialize();

    //token to Cookie setting
    const token  = user.generateToken();
    ctx.cookies.set('access_token',token, {
        maxAge : 1000 *  60 * 60 * 24 * 7, //7days
        httpOnly : true
    });


  } catch (e) {
    ctx.throw(500, e);
  }
};

/// login
export const login = async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 401; // Unauthorized
    return;
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }                           
    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.stauts = 401;
      return;
    }

    ctx.body = user.serialize();

   const token = user.generateToken();
   ctx.cookies.set('access_token', token, {
     maxAge: 1000 * 60 * 60 * 24 * 7, //7days
     httpOnly: true,
   });    

  } catch (error) {
      ctx.throw(500,error);
  }
};
/// check
export const check = async ctx => {
    const {user} = ctx.state;
    if(!user){
        ctx.stauts =401;
        return;
    }
    ctx.body = user;
};

/// logout
export const logout = async ctx => {
    ctx.cookies.set('access_token');
    ctx.stauts = 204;
};
