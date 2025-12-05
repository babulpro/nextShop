// components/Header.js
import Link from 'next/link'

const getData = async()=>{
    try{
        let res= await fetch(`http://localhost:3000/api/secrect/product/category/getCategory`, { method: "GET" } ,{cache: 'force-cache' })
        const data = await res.json()
        return data.categories

    }
    catch(e){
        return []
    }
}


export default async function MainNavbar() {
  const data = await getData()
   
  
  return (
    <div className="w-full">
      <div className="navbar bg-white shadow-md border-b border-gray-200 fixed top-0 z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-gray-600 hover:text-slate-600 hover:bg-slate-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-box z-50 mt-3 w-56 p-3 shadow-xl border border-gray-100">
              <li><Link href={`/`} className="text-gray-800 hover:text-slate-600 hover:bg-slate-50 font-medium py-2">Products</Link></li>
              <li>
                <details>
                  <summary className="text-gray-800 hover:text-slate-600 font-medium py-2">Categories</summary>
                  <ul className="bg-white border-t border-gray-100">
                    { data.length>0 &&

                        data.map((value,index)=>{
                          return(

                            <li key={index} ><Link href={`/pages/categoryPage/${value.name}`} className="text-gray-600 hover:text-slate-600 hover:bg-slate-50 py-2 w-full">{value.name}</Link></li>
                          )
                        })
                    }
                    
                  </ul>
                </details>
              </li>
              <li><a className="text-gray-800 hover:text-slate-600 hover:bg-slate-50 font-medium py-2">Deals</a></li>
            </ul>
          </div>
          <Link href="/" className="text-3xl font-extrabold text-slate-500 hover:text-slate-600 px-4 py-3 transition-colors duration-200">
            NextShop
          </Link>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-2 px-1">
            <li><Link href={`/`} className="text-gray-700 hover:text-slate-600 hover:bg-slate-50 font-medium px-4 py-2 rounded-lg transition-all">Products</Link></li>
            <li>
              <details>
                <summary className="text-gray-700 hover:text-slate-600 font-medium w-full px-4 py-2 rounded-lg transition-all">Categories</summary>
                <ul className="bg-white border-t border-gray-100">
                    { data.length>0 &&

                        data.map((value,index)=>{
                          return(

                            <li key={index} ><Link href={`/pages/categoryPage/${value.name}?id=${value.id}`}  className="text-slate-600 hover:text-slate-900 hover:bg-slate-500 py-2 w-40 text-s">{value.name}</Link></li>
                          )
                        })
                    }
                    
                  </ul>
              </details>
            </li>
            <li><a className="text-gray-700 hover:text-slate-600 hover:bg-slate-50 font-medium px-4 py-2 rounded-lg transition-all">Deals</a></li>
          </ul>
        </div>
        
        <div className="navbar-end gap-1">
          {/* cart item */}
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-gray-600 hover:text-slate-600 hover:bg-slate-50 transition-all">
                <div className="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> 
                  </svg>
                  <span className="badge badge-xs indicator-item bg-error text-white border-0 rounded-sm px-1 min-w-4 h-4">0</span>
                </div>
              </div>
              <div
                tabIndex={0}
                className="card card-compact dropdown-content bg-white z-50 mt-3 w-80 shadow-xl border border-gray-200">
                <div className="card-body p-4">
                  <span className="text-lg font-bold text-gray-900">Your Cart is Empty</span>
                  <span className="text-slate-600 font-semibold">Add items to get started</span>
                  <div className="card-actions mt-2">
                    <button className="btn bg-slate-600 text-white hover:bg-slate-700 btn-block font-medium">Start Shopping</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* profile */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:bg-slate-50 transition-all">
              <div className="w-10 rounded-full border-2 border-slate-100">
                <img
                  alt="Profile"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                  className="hover:scale-105 transition-transform"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-box z-50 mt-3 w-56 p-3 shadow-xl border border-gray-200">
              <li>
                <a className="text-gray-800 hover:text-slate-600 hover:bg-slate-50 justify-between font-medium py-2">
                  Profile
                  <span className="badge bg-slate-600 text-white border-0 text-xs">New</span>
                </a>
              </li>
              <li><a className="text-gray-700 hover:text-slate-600 hover:bg-slate-50 py-2">Settings</a></li>
              <li><a className="text-gray-700 hover:text-slate-600 hover:bg-slate-50 py-2">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}