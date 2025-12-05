import React from 'react';
import ProductsGrid from './../lib/component/product/AllProduct/AllProduct';
import SubMenu from '@/lib/component/Navbar/SubMenu/SubMenu';

const getData = async()=>{
    try{
        let res= await fetch(`http://localhost:3000/api/secrect/product/newProduct/getProduct`, { method: "GET" } ,{cache: 'no-store' })
        const data = await res.json()
        return data.data

    }
    catch(e){
        return []
    }
}

const Page = async() => {
  const products= await getData() 
   

  return (
    
        <div className="mt-18 bg-white text-slate-600 min-height-screen">
        {/* <div className="md:col-span-2 mr-2">
            <SubMenu/>
        </div> */}

        
        <div className="navbar-center flex justify-center">
         <ProductsGrid products={products}/>

       

      </div>
    </div>
  );
};

export default Page;