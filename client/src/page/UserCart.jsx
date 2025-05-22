import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const UserCart = () => {
    const userLoggedIn = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'))

    const navigate = useNavigate()
    if(!userLoggedIn) navigate('/')

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
            console.log(data.result);
        }catch(err){
            console.error(err.message)
        }finally{
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchData()
    },[])

    return ( 
         <div className="dark:bg-[#1E1E1E] dark:text-white bg-[#fff] min-h-screen flex flex-col">
            <div className="flex-grow flex flex-col justify-between items-center space-y-4 w-full max-w-4xl mx-auto px-4 lg:p-0">
                <Header />

                <main className="flex-grow flex flex-col items-start w-full space-y-4">
                    {isLoading && <p className="text-2xl text-white"> Loading ... please wait</p>}
                    <div>
                        <h2 className="text-2xl lg:text-4xl">Current Bids</h2>

                        {items
                        .filter(el => el.recent_bidder === userLoggedIn.username)
                        .map(el => (
                            <div className="flex gap-2 ring-1 p-2">
                                <div className=" size-1/2">
                                    <img className="w-full h-full object-cover" src={el.image_url} alt={el.title} />
                                </div>
                               <div className="flex flex-col justify-between">
                                    <div>
                                        <a href={`/item/${el.title + "=it_id" + el.id}`} className="text-2xl hover:underline">{el.title}</a>
                                        <p>{el.description}</p>
                                        <p>Posted by : {el.seller_name}</p>
                                    </div>
                                    <div>
                                        <p>Ends at: {new Date(el.ends_at).toLocaleString()}</p>
                                        {/* <a href="#">Contact Owner</a> */}
                                    </div>
                               </div>
                            </div>
                        ))}
                    </div>

                </main>
                
            </div>
            </div>
        )
}
 
export default UserCart;