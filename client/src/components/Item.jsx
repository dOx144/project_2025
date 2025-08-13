import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Item = ({ userLoggedIn, data }) => {
  // console.log(data);
  const {
    id,
    title,
    description,
    seller_name,
    current_price,
    created_at,
    ends_at,
    is_verified,
    image_url,
    tags,
  } = data;

  const [timeLeft, setTimeLeft] = useState(getTimeDifference());
  const isCountdownActive =
    timeLeft.days > 0 ||
    timeLeft.hours > 0 ||
    timeLeft.minutes > 0 ||
    timeLeft.seconds > 0;

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
    <div className="flex flex-col sm:flex-row  p-2 gap-2 hover:ring-1 transition-all *:transition-all **:transition-all group/mycard w-full justify-between">
      {/* image section */}
      <div className="w-full size-50 sm:max-h-full sm:w-1/2 rounded-md overflow-hidden group">
        <img
          className=" w-full h-full object-cover group-hover:scale-[110%] duration-1000"
          src={image_url}
          alt="Item_placeholder"
        />
      </div>

      {/* detail wrapper */}
      <div className="flex w-full flex-col space-y-2">
        <div>
          <Link
            to={`/item/${title + "=it_id" + id}`}
            className="text-left text-2xl font-semibold w-full hover:underline underline-offset-4 hover:-translate-y-1 cursor-pointer"
          >
            {title}
          </Link>

          <p>{description.slice(0, 100)} ...</p>
        </div>

        {/* owner / bids */}
        <div>
          <p className="text-sm flex gap-2 items-baseline">
            Placed by :{" "}
            <span className="font-semibold">
              {seller_name ? (
                <Link to={`/user/${seller_name}`}>{seller_name}</Link>
              ) : (
                "not_set"
              )}
            </span>
            <span
              title={
                is_verified ? "Item is Verified" : "Item is not verified yet."
              }
            >
              {is_verified ? "🟢" : "🔴"}
            </span>
          </p>

          {/* bid options  */}
          <div className="flex w-full justify-between items-center ">
            <div>
              <p>
                Current Bid Rs:{" "}
                <span className="font-semibold underline">{current_price}</span>
              </p>
              <p>
                Tags: <span>{tags?.join(", ")}</span>
              </p>
            </div>
            {/* bid options */}
            {userLoggedIn ? (
              <div>
                {isCountdownActive ? (
                  <Link
                    to={`/item/${title + "=it_id" + id}`}
                    className="p-2 font-semibold hover:underline hover:text-red-400 hover:ring-1 hover:rounded-md active:scale-95 ring-1 "
                  >
                    Add your Bid
                  </Link>
                ) : null}
              </div>
            ) : (
              <div>
                <a
                  className="underline group-hover/mycard:animate-bounce "
                  href="/login"
                >
                  Login to add your bids
                </a>
              </div>
            )}
          </div>
          <div className="flex w-full justify-between ">
            <div>
              <p>Created at: {new Date(created_at).toLocaleDateString()}</p>
              <p>Ends at: {new Date(ends_at).toLocaleDateString()}</p>
            </div>
            <div>
              {isCountdownActive ? (
                <div>
                  <p>Available Until :</p>
                  <p className="text-left ">
                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
                    {timeLeft.seconds}s
                  </p>
                </div>
              ) : (
                <p className="text-right w-full">Item is Expired. </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
