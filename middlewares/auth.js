const jwt = require('jsonwebtoken');
const user_model = require('../model/user');

const verifySignUpBody =async (req,res,next)=>{
  try{
  //check for the name
    if(!req.body.username)
    {
      return res.status(400).send({
        message: "failed ! Name was not provided in the request body"
      })
    }
  //check for the email
  if(!req.body.email)
  {
    return res.status(400).send({
      message: "failed ! Name was not provided in the request body"
    })
  }
  //check for the userId
  if(!req.body.password)
  {
    return res.status(400).send({
      message: "failed ! Name was not provided in the request body"
    })
  }
  //check if the same userId is present
const user = await user_model.findOne({email  : req.body.email})
if(user)
{
  return res.status(400).send({
    message : "failed ! user with same userId is already present"
  })
}
next()
}
  catch(err)
  {
    console.log("Error while validating the request object",err)
    res.status(500).send({
      message: "Error while validating the request body"
    })
  }
}



const verifyLogIn=async (req,res,next)=>{
  if(!req.body.email)
  {
    return res.status(400).send({
      message: "failed ! Name was not provided in the request body"
    })
  }
  if(!req.body.password)
  {
    return res.status(400).send({
      message: "failed ! password was not provided in the request body"
    })
  }
  next()
}
const verifyToken=(req,res,next)=>{
 //Check if token is present in the header
    const token= req.headers("x-access-token")

    if(!token){
      return res.status(403).send({
        message: "No token found : unauthorized"
      })
    }
  
  //if it's the valid token
  jwt.verify(token,auth_config.secret ,async(err,decoded)=>{
    if(err)
    {
      return res.status(401).send({
        message : "unauthorized !"
      })
    }
    const user = await user_model.findOne({email : decoded.email})
    if(!user){
      return res.status(400).send({
        message: "unauthorized,the user for this token doe not exist"
      })
    }
    next()
  })

  //Then move to the next token
}
module.exports = {
  verifySignUpBody : verifySignUpBody,
  verifyLogIn : verifyLogIn,
  verifyToken      : verifyToken
}
