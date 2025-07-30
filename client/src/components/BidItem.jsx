import { useState } from 'react';

const BidItem = ({data, userLoggedIn, onUpdate}) => {
  const [userBid, setUserBid] = useState(0);
  const [customBid, setCustomBid] = useState('');
  const [selectedBid, setSelectedBid] = useState('');


 const handleAddBid = async () => {
  const fetchUrl = `http://localhost:3000/api/user/item/bid`
  const finalBid = customBid ? parseInt(customBid, 10) : parseInt(selectedBid, 10);

  if (isNaN(finalBid)) return;

  setUserBid(finalBid);

  const bidData = {
    owner_id: data.owner_id,         
    item_id: data.id,
    bidder_id: userLoggedIn.id,
    recent_bidder: userLoggedIn.username,
    new_bid: Number(finalBid) + Number(data.current_price)
  };

  try {
    const response = await fetch(fetchUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bidData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to place bid.');
    }

    //User Notification
    alert("Added Bid Successfully!!")
    onUpdate()

  } catch (error) {
    alert("Couldn't add the bid.")
    console.error(error.message)
  }
};


  return (
    <div className="w-full flex flex-col gap-2 max-w-xs">
      <select
        className="text-black ring-1 bg-white p-2"
        name="item-bid"
        value={selectedBid}
        onChange={(e) => {
          setSelectedBid(e.target.value);
          setCustomBid(''); 
        }}
      >
        <option value="">Select Bid</option>
        <option value="100">100</option>
        <option value="300">300</option>
        <option value="500">500</option>
        <option value="1000">1000</option>
      </select>

      <input
        type="number"
        placeholder="Or enter custom bid"
        className="text-black ring-1 p-2"
        value={customBid}
        onChange={(e) => {
          setCustomBid(e.target.value);
          setSelectedBid(''); 
        }}
      />

      <button
        className="w-full ring-1 bg-blue-500 text-white p-2 hover:bg-blue-600"
        onClick={handleAddBid}
      >
        Add Bid
      </button>
    </div>
  );
};

export default BidItem;
