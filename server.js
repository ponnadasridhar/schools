const express=require('express');
const cors=require('cors');
// nodemailer removed
const path=require('path');
require('dotenv').config();

const app=express();
app.use(express.json());
app.use(cors({origin:true,methods:['GET','POST','OPTIONS'],credentials:false}));
app.options('*',cors());

// cookie gating removed

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'index.html'));
});
app.get('/admin.html',(req,res)=>{
  res.sendFile(path.join(__dirname,'admin.html'));
});
// logout route removed
app.use(express.static(path.join(__dirname)));

const adminCreds={
  username:process.env.ADMIN_USER||'admin',
  password:process.env.ADMIN_PASS||'Admin@123'
};

app.post('/api/admin/login',(req,res)=>{
  try{
    const {username,password}=req.body||{};
    if(username===adminCreds.username && password===adminCreds.password){
      res.setHeader('Set-Cookie','auth=1; Path=/');
      return res.json({ok:true});
    }
    return res.status(401).json({ok:false,error:'invalid_credentials'});
  }catch(err){
    res.status(500).json({ok:false,error:'login_failed'});
  }
});

app.post('/api/admin/change',(req,res)=>{
  try{
    const {oldUsername,oldPassword,newUsername,newPassword}=req.body||{};
    if(oldUsername!==adminCreds.username || oldPassword!==adminCreds.password){
      return res.status(400).json({ok:false,error:'invalid_old_credentials'});
    }
    if(newUsername){adminCreds.username=String(newUsername)}
    if(newPassword){
      if(String(newPassword).length<4){
        return res.status(400).json({ok:false,error:'password_too_short'});
      }
      adminCreds.password=String(newPassword);
    }
    return res.json({ok:true});
  }catch(err){
    res.status(500).json({ok:false,error:'change_failed'});
  }
});

// OTP store removed

// SMTP transport removed

// OTP generator removed

// send-otp removed

// verify-otp removed

const BASE_PORT=Number(process.env.PORT||3000);
function listen(port){
  const server=app.listen(port,()=>{
    console.log('OTP server listening on http://localhost:'+port);
  });
  server.on('error',err=>{
    if(err && err.code==='EADDRINUSE'){
      const next=port+1;
      console.warn('Port '+port+' in use, trying '+next);
      listen(next);
    }else{throw err}
  });
}
listen(BASE_PORT);
