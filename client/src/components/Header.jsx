import { CiSearch, CiUser, CiShoppingCart, CiLogout } from "react-icons/ci";
import { useEffect, useState } from "react"
import HeaderSearch from "./HeaderSearch";

const Header = () => {

     const userLoggedIn = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'))

    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(false)

        const fetchData = async() => {
        setIsLoading(true)
        try{
            const res = await fetch("http://localhost:3000/api/auctionItems")

            if(!res.ok){
                throw new Error("Error while fetching data")
            }

            const data = await res.json()
            setItems(data.result)
            // console.log(data.result);
        }catch(err){
            console.error(err.message)
        }finally{
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchData()
    },[])
    
    const handleClearStorage = () => {
    sessionStorage.removeItem('userData');
    localStorage.removeItem('userData');
    window.location.reload();
    };

    return ( 
        <div className="w-full p-2 flex items-center justify-between gap-4 **:transition-all *:transition-all">
            <a href="/" className="hover:ring-1 w-1/4 transition-all rounded-md">
                <img
                src="http://localhost:3000/api/uploads/app_logo.png"
                alt="App Logo"
                className="h-10 w-32 object-center cursor-pointer"
                />
            </a>

            <HeaderSearch items = {items}/>

            {userLoggedIn ? 
                <div className="flex gap-2 md:gap-4 md:w-[230px] justify-end ">
                    {/* <form className="flex gap-2 max-w-sm md:hidden" action="#">
                        <input className='w-full' type="search" name="mobile_search" placeholder="Search" />
                        <button className="p-2 ring-1 rounded-md cursor-pointer flex items-center gap-2 ">
                         <CiSearch className="size-6"/>
                        </button>
                    </form> */}
                    <a href={`/user/${userLoggedIn.username}`} className=" ring-1 group cursor-pointer hover:ring-1 rounded-md p-2 flex items-center gap-2">
                        <p className=" hidden group-hover:block">
                        {userLoggedIn.username}
                        </p>
                        <CiUser className="size-6" title="User" />
                    </a>

                    <a href="/user/cart" className=" ring-1 group cursor-pointer hover:ring-1 rounded-md p-2 flex items-center gap-2">
                        <p className=" hidden group-hover:block">Cart</p>
                        <CiShoppingCart className="size-6" title="Cart" />
                    </a>

                    <button
                    onClick={handleClearStorage}
                     className=" ring-1 group cursor-pointer hover:ring-1 rounded-md p-2 flex items-center gap-2">
                        <p className=" hidden group-hover:block">Logout</p>
                        <CiLogout className="size-6" title="Logout" />
                    </button>
                </div> 
                :
                <div className="flex items-center gap-2">
                    <button>
                        <a className="px-5 py-2 outline-1 rounded-md hover:bg-black hover:text-white dark:hover:text-black dark:hover:bg-white active:scale-95 " href="/login">Login</a>
                    </button>
                    |
                    <button>
                        <a className="px-5 py-2 outline-1 rounded-md hover:bg-black hover:text-white dark:hover:text-black dark:hover:bg-white active:scale-95 " href="/register">Register</a>
                    </button>
                </div>
            }

        </div>
     );
}
 
export default Header;