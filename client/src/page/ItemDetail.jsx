import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import ItemDetailComponent from "../components/ItemDetailComponent";
import ItemSuggestion from "../components/ItemSuggestion";

const ItemDetail = () => {

    const userLoggedIn = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'))

    const {id} = useParams()
    const [itemData, setItemData] = useState([])
    const [suggestedItems, setSuggestItems] = useState([]) 

    const fetchItemData = async() =>{
        const fetchUrl = `http://localhost:3000/api/item/${id.split('=it_id')[1]}`

        try{
            const req = await fetch(fetchUrl)

            if(!req.ok){
                throw new Error("Failed Fetching Item Details!")
            }
            const data = await req.json()

            setItemData(data.item)
            console.log(data.item);
        }catch(err){
            console.error(err.message)
        }
    }

    const fetchSuggestedItem = async(tagsArray) =>{
        if(!tagsArray || tagsArray.length === 0) return;

        const tagString = tagsArray.join(',')
        const fetchUrl = `http://localhost:3000/api/suggested-items/${tagString}`

        try{
            const res = await fetch(fetchUrl)

            if(!res.ok){
                throw new Error("Error Fetching Data")
            }

            const data = await res.json()
            setSuggestItems(data?.result)
            console.log(data?.result);
        }catch(err){
            console.error(err.message)
        }
    }
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)

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

    useEffect(()=>{
        fetchData();
    },[])


    useEffect(() => {
        fetchItemData();
    }, [id]);

    useEffect(() => {
    if (itemData?.tags) {
        fetchSuggestedItem(itemData.tags);
        }
    }, [itemData]);


    return ( 
        <div className="dark:bg-[#1E1E1E] dark:text-white bg-[#fff] min-h-screen flex flex-col">
        <div className="flex-grow flex flex-col justify-between items-center space-y-4 w-full max-w-4xl mx-auto px-4 lg:p-0">

                <Header userLoggedIn = {userLoggedIn} items = {items}/>
            
            {/* main content */}
            <main className="flex-grow flex flex-col items-start w-full space-y-4">

            {/* item detail */}
            {itemData && <ItemDetailComponent onUpdate = {fetchItemData} data = {itemData} userLoggedIn={userLoggedIn}/>}

            {/* suggested item */}
            {suggestedItems && <ItemSuggestion data={suggestedItems} itemId ={itemData.id} userLoggedIn ={userLoggedIn}/>}
            
            </main>

            <Footer/>
        </div>
        </div>
     );
}
 
export default ItemDetail;