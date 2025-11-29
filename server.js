const express=require('express');
const cors=require('cors');
const nodemailer=require('nodemailer');
const path=require('path');
require('dotenv').config();

const app=express();
app.use(express.json());
app.use(cors({origin:true,methods:['GET','POST','OPTIONS'],credentials:false}));
app.options('*',cors());

function isAuthed(req){
  const c=req.headers.cookie||'';
  return c.includes('auth=1');
}

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'index.html'));
});
app.get('/admin.html',(req,res)=>{
  res.sendFile(path.join(__dirname,'admin.html'));
});
app.get('/logout',(req,res)=>{
  res.setHeader('Set-Cookie','auth=; Max-Age=0; Path=/');
  res.redirect('/');
});
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

const otpStore=new Map(); // email -> { code, expires }
const DEFAULT_ADMIN_EMAIL=process.env.ADMIN_EMAIL||'ponnadasridhar05@gmail.com';
const EXP_MS=5*60*1000;

function makeTransport(){
  const host=process.env.SMTP_HOST;
  const port=process.env.SMTP_PORT?Number(process.env.SMTP_PORT):465;
  const user=process.env.SMTP_USER;
  const pass=process.env.SMTP_PASS;
  if(!host||!user||!pass){
    return null;
  }
  const cfg={
    host,
    port,
    secure:port===465,
    auth:{user,pass}
  };
  if(host.includes('gmail')){
    cfg.requireTLS=true;
  }
  return nodemailer.createTransport(cfg);
}

function generate(){
  return String(Math.floor(100000+Math.random()*900000));
}

app.post('/api/send-otp',async(req,res)=>{
  try{
    let {email}=req.body||{};
    if(!email) email=DEFAULT_ADMIN_EMAIL;
    if(!email) return res.status(400).json({ok:false,error:'email required'});
    const code=generate();
    otpStore.set(email,{code,expires:Date.now()+EXP_MS});
    const transporter=makeTransport();
    if(!transporter){
      console.warn('SMTP not configured. OTP for',email,'is',code);
      return res.json({ok:true,preview:true,code});
    }
    const from=process.env.SMTP_FROM||process.env.SMTP_USER;
    try{
      await transporter.sendMail({
        from,
        to:email,
        subject:'Your Admin OTP',
        text:`Your OTP is ${code}. It expires in 5 minutes.`,
      });
      res.json({ok:true});
    }catch(err){
      console.error('SMTP send failed:',err&&err.message?err.message:err);
      res.json({ok:true,preview:true,code});
    }
  }catch(err){
    console.error(err);
    res.status(500).json({ok:false,error:'send_failed'});
  }
});

app.post('/api/verify-otp',(req,res)=>{
  try{
    let {email,code}=req.body||{};
    if(!email) email=DEFAULT_ADMIN_EMAIL;
    if(!email||!code) return res.status(400).json({ok:false,error:'email_and_code_required'});
    const entry=otpStore.get(email);
    if(!entry) return res.status(400).json({ok:false,error:'no_otp'});
    if(Date.now()>entry.expires){
      otpStore.delete(email);
      return res.status(400).json({ok:false,error:'expired'});
    }
    if(entry.code!==code) return res.status(400).json({ok:false,error:'invalid'});
    otpStore.delete(email);
    res.setHeader('Set-Cookie','auth=1; Path=/');
    return res.json({ok:true});
  }catch(err){
    console.error(err);
    res.status(500).json({ok:false,error:'verify_failed'});
  }
});

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
