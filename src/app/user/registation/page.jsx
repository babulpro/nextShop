 "use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function Page(){
    const router =useRouter()
    const [data,setData]=useState({name:"",email:"",mobile:"",password:""})
    const InputChange=(name,value)=>{
        setData(pre=>({
            ...pre,
            [name]:value
        }))
    }

 const FormSubmitHandler = async(e)=>{
    e.preventDefault()
    if(data.email.trim()===""){
        alert("Please enter a valid email")
    }
    else if(data.password.trim()===""){
        alert("please enter a valid password")
    }
    else{
        try{
            const config={
                method:"post",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify(data)
            }

            const response = await fetch("/api/user/createUser",config,{cache:"no-cache"})
            if(!response.ok){
                alert("user already exists")
            }
            const json = await response.json()
            if(json.status === "success"){
                // setData({name:"",email:"",password:"",mobile:""})
                alert("Congratulation to our Home of knowledge")
                router.push("/dashboard/pages")

            }

        }
        catch(e){
            alert("try again later")

        }
    }
 }

    return(
        <div className=" bg-slate-700 min-h-screen flex justify-center items-center ">
            <div className=" md:w-1/2 shadow-xl md:p-10  p-2">
                 
                      <div className="">
                            <form onSubmit={FormSubmitHandler}>

                                <label htmlFor="email">Enter Your Name</label><br/>
                                <input type='text' placeholder='name' value={data.name} onChange={(e)=>InputChange("name",e.target.value)} className="inputClass text-left w-full" id="email"/> <br/><br/>

                                <label htmlFor="email">Enter Your Email</label><br/>
                                <input type='email' placeholder='email' value={data.email} onChange={(e)=>InputChange("email",e.target.value)} className="inputClass text-left w-full" id="email"/> <br/><br/>

                                <label htmlFor="password">Enter Your Password</label><br/>
                                <input type="password" placeholder="********" value={data.password} onChange={(e)=>InputChange("password",e.target.value)} className="inputClass w-full" id="password"/> <br/><br/>

                                <label htmlFor="email">Enter Your Mobile Number</label><br/>
                                <input type='text' placeholder='Mobile number' value={data.mobile} onChange={(e)=>InputChange("mobile",e.target.value)} className="inputClass text-left w-full" id="email"/> <br/><br/>

                                <div className="mt-8 ">
                                  <div className="">
                                      <input type='submit' value='Register' className="p-1 hover:text-slate-500 "/><br/>
                                  </div>

                                  <div className="flex justify-between">
                                    <Link href="/" className="text-xs p-1 hover:text-slate-500 shadow-2xl">Login Your Account!</Link>
                                    <Link href="/user/forgetpassword" className="text-xs p-1 hover:text-slate-500 shadow-2xl">Forget password?</Link>
                                  </div>
                                   

                                </div>
                            </form>
                        

                </div>
            </div>
        </div>
    )
}