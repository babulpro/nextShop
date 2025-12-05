 
import ProductsGrid from '@/lib/component/product/AllProduct/AllProduct';
import getProduct from '@/lib/component/ProductById';
import React from 'react';



const Page = async({params, searchParams}) => {
    // Await searchParams first (required in some Next.js versions)
    const awaitedSearchParams = await searchParams;
    const product=[]
    // // const { name } = params;
    const id = awaitedSearchParams?.id; 

    const  products= await getProduct(id)   
    return (
        <div className="mt-18 bg-white text-slate-600 min-height-screen">
            <div className="navbar-center flex justify-center">
                <ProductsGrid products={products}/>
                 
             </div>
            
            {/* Render your products here */}
        </div>
    );
};

export default Page;