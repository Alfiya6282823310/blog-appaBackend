const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const {blogmodel}=require("./models/blogs")
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")

 mongoose.connect("mongodb+srv://alfiyakn:alfiyakn@cluster0.l8relji.mongodb.net/blogsdb?retryWrites=true&w=majority&appName=Cluster0")
const app=express()
app.use(cors())
app.use(express.json())

const generateHashPassword=async(password)=>{
  const salt=await bcryptjs.genSalt(10)
  return bcryptjs.hash(password,salt)
}

app.post("/signup",async(req,res)=>{
    let input=req.body
    let hashedPassword=await generateHashPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword
    let blog=new blogmodel (input)
    blog.save()

    res.json({"staus":"success"})
})
app.post("/signin",async(req,res)=>{
    let input =req.body
    blogmodel.find({"email":req.body.email}).then(
        (response)=>{
            if (response.length>0) {
                let dbpassword=response[0].password
                console.log(dbpassword)
                bcryptjs.compare(input.password,dbpassword,(error,isMatch)=>
                    {
                  if (isMatch){
                        jwt.sign({email:input.emailid},"blog-app",{expiresIn:"1d"},
                    (error,token)=>
                         {
                            if (error) {
                                res.json({"status":"unable to create token"})
                            } else {
                                res.json({"status":"success","userid":response[0]._id,"token":token})
                            }
                    }) }else {
                       res.json({"password":"incorrect"}) 
                    }
                
                })
                
            } else {
                res.json({"status":"user not found"})
            }
        }
    ).catch()
})
app.post()
app.listen(8080,()=>{
    console.log("server started")
})