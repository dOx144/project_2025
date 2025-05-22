import { useEffect, useState } from "react";

const LatestFeature = ({data}) => {
      const [timeLeft, setTimeLeft] = useState(getTimeDifference());
            const isCountdownActive = timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0;
        
            // Calculate difference in milliseconds and convert to days, hrs, mins, secs
          function getTimeDifference() {
            const now = new Date();
            const end = new Date(data.created_at);
            const start = new Date(data.ends_at);
        
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
              }, [data.created_at, data.ends_at]);

    return ( 
        <div className="min-w-2/5 flex flex-col justify-between ring-1 transition-all *:transition-all **:transition-all p-2 group shadow-md">
            <div>
                <div className="w-full overflow-hidden">
                    <img className=" group-hover:scale-105 duration-1000" src={data.image_url} alt={data.title} />
                </div>
                <div className="*:font-semibold">
                    <a href={`/item/${data.title + "=it_id" + data.id}`} className="text-xl lg:text-2xl cursor-pointer hover:underline">{data.title}</a>
                    <p className="">{data.description}</p>
                    <p className="text-sm">Tags : {data.tags.map(el => el[0].toUpperCase() + el.slice(1)).join(', ')}</p>
                </div>
            </div>

            <div className="w-full justify-between  flex gap-2 items-center">
                <p>Posted by: {data.seller_name} </p>
                <p>Currently at: {data.current_price}</p>
            </div>

                <div className="flex items-center gap-2 ">
                    <p>Available Until :</p>
                    <p className="text-left group-hover:text-green-400 "> 
                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                    </p>
                </div>
        </div>
     );
}
 
export default LatestFeature;