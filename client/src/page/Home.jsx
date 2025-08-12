import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Item from "../components/Item";
import Loading from "../components/Loading";
import LatestFeature from "../components/LatestFeature";
import GetUserInterest from "../components/GetUserInterest";
import UserInterests from "../components/UserInterests";

const Home = () => {
    const userLoggedIn = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'))

    const [items, setItems] = useState([])
    const [filterTags, setFilterTags] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [filteredItems, setFilteredItems] = useState([]); 
    const [selectedTag, setSelectedTag] = useState('');     
    const [sortOption, setSortOption] = useState('default');
    const listToDisplay = selectedTag ? filteredItems : items;
    const [userInterestedItems, setUserInterestedItems] = useState([])

    const filterItem = (dataItems) => {
    if (!userLoggedIn?.user_interest || !Array.isArray(dataItems)) return [];

    const userInterests = Array.isArray(userLoggedIn.user_interest)
        ? userLoggedIn.user_interest
        : userLoggedIn.user_interest.split(',').map(i => i.trim());

    const filteredInterests = dataItems.filter(item => {
        if (!item.user_interest) return false;

        const itemInterests = Array.isArray(item.user_interest)
            ? item.user_interest
            : item.user_interest.split(',').map(i => i.trim());

        return itemInterests.some(interest => userInterests.includes(interest));
    });

    return filteredInterests;
    };

    const handleTagFilter = (e) => {
        setSelectedTag(e.target.value);
    };

    const fetchData = async() => {
        setIsLoading(true)
        try{
            const res = await fetch("http://localhost:3000/api/auctionItems")

            if(!res.ok){
                throw new Error("Error while fetching data")
            }

            const data = await res.json()
            
            setItems(data.result)
            setFilterTags(['All', ...new Set(data.result.flatMap(el => el.tags))]);
        }catch(err){
            console.error(err.message)
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        fetchData()
    },[])

    useEffect(() => {
    let result = selectedTag && selectedTag !== 'All'
        ? items.filter(el => el.tags.includes(selectedTag))
        : [...items];

    switch (sortOption) {
        case 'price-asc':
        result.sort((a, b) => a.current_price - b.current_price);
        break;
        case 'price-desc':
        result.sort((a, b) => b.current_price - a.current_price);
        break;
        case 'date-desc':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
        case 'date-asc':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
        default:

        break;
    }

    setFilteredItems(result);
    }, [selectedTag, sortOption, items]);

    if(isLoading) return <Loading/>
    
    return ( 
        <div className="dark:bg-[#1E1E1E] dark:text-white bg-[#fff] min-h-screen flex flex-col">

        {/* user interest */}
        {userLoggedIn && (!userLoggedIn.user_interest || userLoggedIn.user_interest.length === 0) && (
        <div className="overflow-hidden z-10 absolute w-full h-screen grid place-content-center backdrop-blur-[2px]">
            <GetUserInterest tags={filterTags} />
        </div>
        )}

            <div className="flex-grow flex flex-col justify-between items-center space-y-4 w-full max-w-4xl mx-auto px-4 lg:p-0">
                <Header/>

                {/* home hero */}
                <div className="ring-1 w-full">
                    <img className=" object-contain w-full max-h-[350px]" src='http://localhost:3000/api/uploads/app_logo.png' alt="" />
                </div>

                {/* content */}
                <main className="flex-grow flex flex-col items-start w-full space-y-4">

                    {/* similar user defined items */}
                    {userLoggedIn && <UserInterests userLoggedIn={userLoggedIn} items = {items}/>}

                    {/* latest items */}
                     <div>
                        <h2 className="text-2xl lg:text-4xl">Checkout the Latest Items</h2>
                    
                        <div className="flex flex-col md:flex-row p-2 space-x-4 overflow-x-scroll w-full hide-scrollbar-x">
                            {/*Latest items */}
                           {[...items]
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // NEWEST first
  .slice(0, 3)
  .map((item, idx) => (
    <LatestFeature
      key={idx}
      userLoggedIn={userLoggedIn}
      data={item}
    />
))}

                        </div>

                        <div>
                            <h2 className="text-2xl lg:text-4xl  p-2">Featured</h2>
                            <div className="flex gap-4 p-2">
                                <div>
                                    <p>Filter by:</p>
                                    <select
                                    className="block w-full max-w-xs px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    name="filter_item"
                                    id="filter_item"
                                    onChange={handleTagFilter}>
                                        {filterTags && filterTags.map((el, idx) => (
                                            <option key={idx} value={el}>{el}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <p>Sort by:</p>
                                    <select className="block w-full max-w-xs px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}>
                                    <option value="default">Default</option>
                                    <option value="price-asc">Price (Low to High)</option>
                                    <option value="price-desc">Price (High to Low)</option>
                                    <option value="date-desc">Date (Newest First)</option>
                                    <option value="date-asc">Date (Oldest First)</option>
                                </select>
                                </div>

                            </div>
                           <div>
                            {[...listToDisplay] // clone the array to avoid mutating original
                                    .sort(() => Math.random() - 0.5) // simple random shuffle
                                    .slice(0, 5)
                                    .map((item, idx) => (
                                        <Item
                                            key={idx}
                                            userLoggedIn={userLoggedIn}
                                            data={item}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </main>
                
                <Footer/>

            </div>
        </div>
     );
}
 
export default Home;
