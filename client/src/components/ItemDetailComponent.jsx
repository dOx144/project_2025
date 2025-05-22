import { useEffect } from "react";
import { useState } from "react";
import BidItem from "./BidItem";

const ItemDetailComponent = ({data,userLoggedIn,onUpdate}) => {

    const {
        id,
        title,
        description,
        tags,
        image_url,
        owner_id,
        seller_name,
        starting_price,
        current_price,
        created_at,
        ends_at,
    } = data

    const [timeLeft, setTimeLeft] = useState(getTimeDifference());
    const isCountdownActive = timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0;
    const [userBid, setUserBid] = useState(0)

    // Calculate difference in milliseconds and convert to days, hrs, mins, secs
  function getTimeDifference() {
    const now = new Date();
    const end = new Date(created_at);
    const start = new Date(ends_at);

    // If current time is before start date, count down to start
    if (now < start) {
      const diff = start - now;
      return convertMs(diff);
    }

    // If current time is between start and end date, count down to end
    if (now >= start && now <= end) {
      const diff = end - now;
      return convertMs(diff);
    }

    // If past end date, return zeroes
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
   function convertMs(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeDifference());
    }, 1000);

    return () => clearInterval(timer);
  }, [created_at, ends_at]);
    

    return ( 
        <div className="ring-1 flex w-full justify-between gap-10 py-4 flex-col md:flex-row items-center transition-all *:transition-all **:transition-all px-2 hover:rounded-md hover:shadow-xl hover:ring-green-400">
            {/* product image */}
            <div className="w-full md:w-1/2 rounded-md overflow-hidden group">
                <img className="w-ful h-full group-hover:scale-105 duration-1000" src={image_url} alt={title} />
            </div>

            {/* item details */}
            <div className="w-full md:w-1/2 space-y-4">
                <div>
                    <h2 className="text-3xl font-semibold">{title}</h2>
                    <p>{description}</p>
                    <p>Tags: {tags?.map(el => el[0].toUpperCase() + el.slice(1)).join(', ')}</p>
                </div>

                {/* owner details */}
                <div>

                    <div className="flex w-full justify-between py-2 gap-2">
                        <div className=" w-full max-w-1/2 flex flex-col justify-between">
                            <div>
                                <p className="text-sm">From: {seller_name} </p>
                                <p>Started from Rs. 
                                    <span className=" hover:underline">
                                        {starting_price}
                                    </span>
                                </p>
                            </div>

                                <div>
                                    {data.recent_bidder && 
                                    <p>
                                        Recent bid by : {data.recent_bidder}
                                    </p>}
                                    <p>Currently at Rs. 
                                    <span className="text-xl font-semibold hover:underline">
                                        {current_price}
                                    </span>
                                    </p>
                                </div>
                        </div>
                        {userLoggedIn && isCountdownActive && (
                        <div className="max-w-1/2 w-full">
                            {userLoggedIn.username === data.seller_name ? (
                            <a href="/user/myItems" className="text-blue-500 underline">
                                This is your item — go to My Items
                            </a>
                            ) : userLoggedIn.username === data.recent_bidder ? (
                            <p>You already added the bid for this item</p>
                            ) : (
                            <>
                                <p>Add Your Bid</p>
                                <BidItem data={data} userLoggedIn={userLoggedIn} onUpdate={onUpdate} />
                            </>
                            )}
                        </div>
                        )}

                        {!userLoggedIn && 
                        <div className="grid items-center">
                            <a href="/login" className="underline cursor-pointer">Login to add your bid</a>
                        </div>}
                    </div>

                    <div className="flex w-full justify-between py-2">
                        <div>
                            <p>Created at: {new Date(created_at).toLocaleDateString()}</p>
                            {isCountdownActive && <p>Ends at: {new Date(ends_at).toLocaleDateString()}</p>}
                        </div>
                        <div className="flex w-1/3 items-end">
                           {isCountdownActive ? (
                                <div>
                                    <p>Available Until :</p>
                                    <p> 
                                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                                    </p>
                                </div>
                            ) : (
                                <p className="text-right w-full">Item is Expired. </p>
                            )
                            }
                        </div>
                    </div>
                </div>
                
            </div>
        
        </div>
     );
}
 
export default ItemDetailComponent;