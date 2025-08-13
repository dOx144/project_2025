import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import UserRules from "../components/UserRules";

const UserCart = () => {
  const userLoggedIn =
    JSON.parse(localStorage.getItem("userData")) ||
    JSON.parse(sessionStorage.getItem("userData"));

  const navigate = useNavigate();
  if (!userLoggedIn) navigate("/");

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/user/item_bet/${userLoggedIn.id}`
      );

      if (!res.ok) {
        throw new Error("Error while fetching data");
      }

      const data = await res.json();
      setItems(data.result);
      console.log(data.result);
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dark:bg-[#1E1E1E] dark:text-white bg-[#fff] min-h-screen flex flex-col">
      <UserRules />
      <div className="flex-grow flex flex-col justify-between items-center space-y-4 w-full max-w-4xl mx-auto px-4 lg:p-0">
        <Header />

        <main className="flex-grow flex flex-col w-full space-y-4">
          {isLoading && (
            <p className="text-2xl text-white">Loading ... please wait</p>
          )}

          <div className="space-y-4">
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-4xl">Current Bids</h2>
              {/* <p className="font-semibold animate-bounce">Please use your provided item ID when contacting the Seller</p> */}
            </div>

            {items.length > 0 ? (
              items.map((el) => (
                <div
                  className="flex text-slate-50/85 gap-2 ring-1 p-2 w-full"
                  key={el.id}
                >
                  <div className="w-1/2 h-[250px]">
                    <img
                      className="w-full h-full object-cover"
                      src={el.image_url}
                      alt={el.title}
                    />
                  </div>

                  <div className="flex flex-col justify-between p-1">
                    <div>
                      <div>
                        <a
                          href={`/item/${el.title}=it_id${el.id}`}
                          className="text-2xl text-white font-semibold hover:underline"
                        >
                          {el.title}
                        </a>
                        <p className="text-sm">Current Bidder is You</p>
                        <p>{el.description}</p>
                      </div>

                      <div className=" self-end-safe p-2 ring-1">
                        <Link to={`/user/${el.seller_name}`}>
                          Posted by: {el.seller_name}
                        </Link>
                        <p>
                          Status:{" "}
                          {el.is_verified ? "Verified 🟢" : "Not Verified 🔴"}
                        </p>
                        <p>Your Bid: Rs. {el.current_price}</p>
                        <p>
                          Ends at: {new Date(el.ends_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm   ">
                      {new Date(el.ends_at) > new Date() ? (
                        <p className="text-green-50/70 ">
                          Your Item ID will be generated for the trade if you
                          are the last Bidding person.
                        </p>
                      ) : (
                        <p>
                          Your Item Id is{" "}
                          {el.owner_id +
                            el.title.slice(0, 3) +
                            el.id +
                            el.current_bidder.slice(-3)}
                        </p>
                      )}
                      {/* <p>{el.owner_id + el.title.slice(0, 3) + el.id + el.recent_bidder.slice(-3)}</p> */}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center mt-4">
                No current bids 😕
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserCart;
