import { useEffect, useState } from "react";
import UserItems from "./UserItems";
import OwnProfileEdit from "./OwnProfileEdit";

const OwnProfile = ({ userLoggedIn, VerifiedUser }) => {
  const [userItems, setUserItems] = useState([]);

  const fetchUserItems = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/user/` + userLoggedIn.username
      );
      if (!res.ok) {
        throw new Error("Failed to fetch user items");
      }

      const data = await res.json();
      // console.log(data);
      setUserItems(data);
    } catch (err) {
      console.error("Error fetching user items:", err.message);
    }
  };

  useEffect(() => {
    if (userLoggedIn?.id) {
      fetchUserItems();
    }
  }, []);

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(!isEditing);
    console.log(isEditing);
  };

  const totalSetRevenue = Array.isArray(userItems)
    ? userItems.reduce((acc, item) => acc + Number(item.starting_price || 0), 0)
    : 0;

  const totalEstimatedRevenue = Array.isArray(userItems)
    ? userItems.reduce((acc, item) => acc + Number(item.current_price || 0), 0)
    : 0;

  return (
    <div className="space-y-10 w-full">
      <div className="min-w-xl w-2/3 bg-white p-6 shadow-md space-y-4 text-black relative">
        {isEditing && (
          <OwnProfileEdit handleEdit={handleEdit} userLoggedIn={userLoggedIn} />
        )}

        <div className="flex items-center gap-4">
          <img
            src={userLoggedIn.profile_pic}
            alt="Profile"
            className="w-20 h-20 rounded-full border object-cover"
          />
          <div className="w-full">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-2xl font-semibold capitalize">
                Hello, {userLoggedIn.username}
              </h2>
              <button onClick={handleEdit} className="ring-1 px-3 py-2">
                Edit profile
              </button>
            </div>
            <p className="text-gray-600">User ID: {userLoggedIn.id}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(userLoggedIn.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>Email:</strong> {userLoggedIn.email}
          </p>
          <p className="capitalize">
            <strong>Role:</strong> {userLoggedIn.role}{" "}
            {userLoggedIn.is_verified && "/ Seller"}
          </p>
          <p>
            <strong>Verified:</strong>{" "}
            {userLoggedIn.is_verified ? "Yes 🟢" : "No 🔴"}
          </p>

          {userLoggedIn.user_interest ? (
            <div>
              <p>
                <strong>Interests:</strong>
              </p>
              <ul className="list-disc ml-6">
                {(Array.isArray(userLoggedIn?.user_interest)
                  ? userLoggedIn.user_interest
                  : userLoggedIn?.user_interest
                      ?.replace(/[{}"]/g, "") // remove curly braces and quotes
                      .split(",")
                      .map((i) => i.trim())
                ) // remove spaces around items
                  ?.map((interest, i) => (
                    <li key={i} className="capitalize">
                      {interest.replace(/_/g, " ")}{" "}
                      {/* replace underscores with spaces */}
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 italic">No interests listed.</p>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Items Table */}
        <div className="bg-white text-black ring-1 p-2 w-full overflow-auto">
          <h2 className="text-lg font-semibold py-2">Your Item Listing</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left">Id</th>
                <th className="border p-2 text-left">Item Id</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Item</th>
                <th className="border p-2 text-left">Set Price</th>
                <th className="border p-2 text-left">Current Price</th>
                <th className="border p-2 text-left">Current Bidder</th>
              </tr>
            </thead>
            <tbody>
              {userItems.length > 0 ? (
                userItems.map((item) => (
                  <tr key={item.id}>
                    <td className="border p-2">{item.id}</td>

                    <td className="border p-2">
                      {item.owner_id +
                        (item.title ? item.title.slice(0, 3) : "NA") +
                        item.id +
                        (item.recent_bidder
                          ? item.recent_bidder.slice(-3)
                          : "NA")}
                    </td>
                    <td className="border p-2">
                      {item.is_verified
                        ? new Date(item.ends_at) > new Date()
                          ? "🟢 Bets ongoing"
                          : "❕Please Contact the bid winner❕"
                        : "🟡 Item not verified yet"}
                    </td>
                    <td className="border p-2">{item.title || "N/A"}</td>
                    <td className="border p-2">
                      {item.starting_price || item.set_price || "N/A"}
                    </td>
                    <td className="border p-2">
                      {item.current_price || item.set_price || "N/A"}
                    </td>
                    <td className="border p-2">
                      {item.recent_bidder || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border p-2 text-center" colSpan={7}>
                    No items available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Revenue Table */}
        <div className="bg-white text-black ring-1 p-2 w-full overflow-auto">
          <h2 className="text-lg font-semibold py-2">Items Estimate</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left">Number of items</th>
                <th className="border p-2 text-left">
                  Set Revenue{" "}
                  <span className="text-sm font-normal text-slate-400">
                    (according to set price)
                  </span>
                </th>
                <th className="border p-2 text-left">
                  Estimated Revenue{" "}
                  <span className="text-sm font-normal text-slate-400">
                    (according to current price)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">
                  {userItems.length}{" "}
                  <span className="text-sm font-normal text-slate-400">
                    (listed items)
                  </span>
                </td>
                <td className="border p-2">
                  Rs. {totalSetRevenue ? totalSetRevenue.toFixed(2) : "N/A"}
                </td>
                <td className="border p-2">
                  Rs.{" "}
                  {totalEstimatedRevenue
                    ? totalEstimatedRevenue.toFixed(2)
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* user posts */}
      <div className="w-full p-6 space-y-4 text-black bg-white shadow-md">
        <div className="flex items-center justify-between">
          {userItems.length !== 0 ? (
            <p className="text-xl">Look at your Listings.</p>
          ) : (
            <h2 className="text-xl">Your got no ongoing posts</h2>
          )}

          {userLoggedIn.is_verified ? (
            <VerifiedUser userLoggedIn={userLoggedIn} />
          ) : (
            <p>Please verify to add your posts. 🙂</p>
          )}
        </div>

        {/* user items */}
        {userItems.some((el) => !el.is_verified) ? (
          <p className="text-2xl ring-2 w-fit px-5 py-2 ring-red-400 shadow-lg">
            Unverified Items
          </p>
        ) : null}

        {userItems.some((el) => !el.is_verified) ? (
          userItems
            .filter((el) => !el.is_verified)
            .map((el, idx) => <UserItems el={el} key={idx} />)
        ) : (
          <p className="text-gray-600">You have not posted anything new yet.</p>
        )}

        {userItems.length > 0 && userItems.some((el) => el.is_verified) && (
          <>
            <h2 className="text-2xl w-fit px-5 py-2 shadow-lg ring-green-400 ring-2">
              Verified Items
            </h2>
            {userItems
              .filter((el) => el.is_verified)
              .map((el, idx) => (
                <UserItems el={el} key={idx} />
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default OwnProfile;
