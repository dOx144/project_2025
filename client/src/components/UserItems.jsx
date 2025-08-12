import { useState } from "react";
import { Link } from "react-router-dom";
import UserItemEdit from "./UserItemEdit";
const UserItems = ({ el}) => {

    const handleDelete = async (itemId) => {
        try {
            const res = await fetch(`http://localhost:3000/api/user/item_delete/${itemId}`, {
            method: 'DELETE',
            });
    
            if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Failed to delete item');
            }
    
            const data = await res.json();
            console.log("Item Deleted:", data); 
            window.location.reload()
    
        } catch (ex) {
            console.error("Delete error:", ex.message);
        }
        };
    
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const handleEdit = () => {
        setIsEditing(!isEditing)
        console.log(isEditing);
    }
    
return (
  <div className="ring-1 flex p-1 gap-4 group shadow-md hover:shadow-xl relative">

    {isEditing && 
    <UserItemEdit el = {el} handleEdit = { handleEdit }/>
    }
  
    <div className="w-1/2 size-60 self-center overflow-hidden">
      <img
        className="group-hover:scale-110 transition-all duration-500 w-full h-full object-cover rounded-md"
        src={el.image_url}
        alt={el.title}
      />
    </div>
    <div className="w-full flex flex-col justify-between p-1">
      <div className="space-y-2">
        <div>
          <div className="flex items-center w-full justify-between">
            <div className="flex gap-2 items-baseline">
              <h2 className="text-2xl">{el.title}</h2>
              <p
                className={`${
                  el.is_verified ? "text-green-400" : "text-yellow-400"
                }`}
                title={el.is_verified ? "Verified" : "Item Not Verified"}
              >
                {el.is_verified
                  ? "Verified"
                  : " {waiting for verification}"}
              </p>
            </div>
            <div className="space-x-4 transition-all">
              {!isEditing && (
                <button
                onClick={handleEdit}
                className="ring-1 px-3 py-1 font-semibold">
                    Edit
                </button>
              )}
              {!isDeleting && (
                <button
                  className="ring-1 p-1 active:scale-95"
                  onClick={() => setIsDeleting(true)}
                >
                  ✖️
                </button>
              )}
              {isDeleting && (
                <>
                  <button
                    onClick={() => handleDelete(el.id)}
                    className="p-1 ring-1 hover:ring-red-400 hover:ring-2 active:scale-95 transition-all"
                    title="Delete"
                  >
                    ✔️
                  </button>

                  <button
                    onClick={() => setIsDeleting(false)}
                    className="p-1 ring-1 hover:ring-green-400 hover:ring-2 active:scale-95 transition-all"
                    title="Cancle"
                  >
                    ❌
                  </button>
                </>
              )}
            </div>
          </div>
            <p className="text-sm text-slate-600">ID: {el.id}</p>
            <p>Item Selling ID: {el.owner_id + el.title.slice(0, 3) + el.id + el.recent_bidder.slice(-3)}</p>
          <p>{el.description}</p>
          <div>
            <p>Current Bidder: {el.recent_bidder ? el.recent_bidder : "No Recent Bidders"}</p>
            {el.recent_bidder ? <p>Contact: {el.email}</p> : null}
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-baseline ring-1 p-1 ring-slate-400/30">
          <div>
            <p>Started price : {el.starting_price}</p>
            <p>Current price : {el.current_price}</p>
          </div>
          <div className="text-sm">
            <p>Listed on: {new Date(el.created_at).toLocaleDateString()}</p>
            <p>
              {new Date(el.ends_at) < new Date() ? "Expired" : "End"} at:{" "}
              {new Date(el.ends_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {new Date(el.ends_at) > new Date() && el.is_verified ? (
          <Link
            to={`/item/${el.title + "=it_id" + el.id}`}
            className="w-full p-2 ring-1 hover:ring-0 hover:bg-slate-800 hover:text-white transition-all cursor-pointer active:scale-95 text-center"
          >
            View Bids on this item
          </Link>
        ) : (
          <Link
            to={"#"}
            className="w-full p-2 ring-1 hover:ring-0 hover:bg-slate-800 hover:text-white transition-all cursor-pointer active:scale-95 text-center group"
          >
            <span className="text-red-800 font-bold group-hover:text-red-400">
              {!el.is_verified ? "Not Verified" : "EXPIRED"}
            </span>{" "}
            Bid Unavailable
          </Link>
        )}
      </div>
    </div>
  </div>
);

}
 
export default UserItems;