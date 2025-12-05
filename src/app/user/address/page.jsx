"use client"

import {  useState } from "react"
// import {useRouter} from 'next/navigation'
import Link from 'next/link'
 


export default function Page(){
    
    const [data,setData]=useState({firstName:"",lastName:"",street:"",city:"",state:"",zipCode:"",country:"",phone:""})
    // const router= useRouter()
    

    const InputChange =(name,value)=>{
        setData(pre=>({
            ...pre,
            [name]:value
        }))
    }

    
    const FormSubmitHandler = async (e) => {
        e.preventDefault();
    
         
            try {
                const config = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                };
    
                const response = await fetch("/api/secrect/address/createAddress", config, { cache: "no-cache" });
                
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
        
    };
    
 
    return(
        <div className=" bg-slate-700 min-h-screen flex justify-center items-center mt-20">
            <div className=" md:w-1/2 shadow-xl md:p-10  p-2">
                 
                      <div className="">
                            <form onSubmit={FormSubmitHandler}>
                                <label htmlFor="firstName">Enter Your First Name</label><br/>
                                <input type='text' placeholder='Babul' value={data.firstName} onChange={(e)=>InputChange("firstName",e.target.value)} className="inputClass text-left w-full" id="firstName"/> <br/><br/>

                                <label htmlFor="lastName">Enter Your Last Name</label><br/>
                                <input type='text' placeholder='Hossain' value={data.lastName} onChange={(e)=>InputChange("lastName",e.target.value)} className="inputClass text-left w-full" id="lastName"/> <br/><br/>

                                <label htmlFor="street">Enter Your Street</label><br/>
                                <input type='text' placeholder='121/03' value={data.street} onChange={(e)=>InputChange("street",e.target.value)} className="inputClass text-left w-full" id="street"/> <br/><br/>

                                <label htmlFor="city">Enter Your City</label><br/>
                                <input type='text' placeholder='Dhaka' value={data.city} onChange={(e)=>InputChange("city",e.target.value)} className="inputClass text-left w-full" id="city"/> <br/><br/>

                                <label htmlFor="zipCode">Enter Your ZipCode</label><br/>
                                <input type='text' placeholder='1450' value={data.zipeCode} onChange={(e)=>InputChange("zipCode",e.target.value)} className="inputClass text-left w-full" id="zipCode"/> <br/><br/>

                                <label htmlFor="country">Enter Your country</label><br/>
                                <input type='text' placeholder='Bangladesh' value={data.country} onChange={(e)=>InputChange("country",e.target.value)} className="inputClass text-left w-full" id="country"/> <br/><br/>

                                <label htmlFor="phone">Enter Your phone</label><br/>
                                <input type='text' placeholder='01920000000' value={data.phone} onChange={(e)=>InputChange("phone",e.target.value)} className="inputClass text-left w-full" id="country"/> <br/><br/>

                                <div className="mt-8 ">
                                  <div className="flex justify-between">
                                      <div>
                                        <input type='submit' value='submit' className="p-1 hover:text-slate-500 "/><br/>
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