"use client"

import {  useState } from "react"
// import {useRouter} from 'next/navigation'
import Link from 'next/link'
 


export default function Page(){
    
    const [data,setData]=useState({email:"",password:""})
    // const router= useRouter()
    

    const InputChange =(name,value)=>{
        setData(pre=>({
            ...pre,
            [name]:value
        }))
    }

    
    const FormSubmitHandler = async (e) => {
        e.preventDefault();
    
        if (data.email.trim() === "") {
            alert("Please enter a valid email.");
        } else if (data.password.trim() === "") {
            alert("Please enter a valid password.");
        } else {
            try {
                const config = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                };
    
                const response = await fetch("/api/user/loginUser", config, { cache: "no-cache" });
                
                if (!response.ok) {
                    alert("No user found")
                }
    
    
                const json = await response.json();
                 
    
                if (json.status === "success") {
                    
                   alert('Well come To Home of Knowledge')
                    
                    window.location.replace("/")
                    // router.push("/")
                } else {
                    alert("Please provide valid email and password");
                }
            } catch (error) {
                alert("Please provide valid email and password");

            }
        }
    };
    
 
    return(
        <div className=" bg-slate-700 min-h-screen flex justify-center items-center ">
            <div className=" md:w-1/2 shadow-xl md:p-10  p-2">
                 
                      <div className="">
                            <form onSubmit={FormSubmitHandler}>
                                <label htmlFor="email">Enter Your Email</label><br/>
                                <input type='email' placeholder='email' value={data.email} onChange={(e)=>InputChange("email",e.target.value)} className="inputClass text-left w-full" id="email"/> <br/><br/>
                                <label htmlFor="password">Enter Your Password</label><br/>
                                <input type="password" placeholder="********" value={data.password} onChange={(e)=>InputChange("password",e.target.value)} className="inputClass w-full" id="password"/> <br/>
                                <div className="mt-8 ">
                                  <div className="flex justify-between">
                                      <div>
                                        <input type='submit' value='login' className="p-1 hover:text-slate-500 "/><br/>
                                      </div>
                                      
                                  </div>
                                  <div className="flex justify-between">
                                    <Link href="/user/registation" className="text-xs p-1 hover:text-slate-500 shadow-2xl">Don't have account?</Link>
                                    <Link href="/user/forgetpassword" className="text-xs p-1 hover:text-slate-500 shadow-2xl">Forget password?</Link>
                                  </div>
                                   

                                </div>
                            </form>
                        

                </div>
            </div>
        </div>
    )
}