const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const {blogmodel}=require("./models/blogs")
const bcryptjs=require("bcryptjs")

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

app.listen(8080,()=>{
    console.log("server started")
})