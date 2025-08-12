import { useState } from "react";

const VerifiedUser = ({userLoggedIn}) => {
    const [addingItem, setAddingItem] = useState(false)

    const [itemData, setItemData] = useState({
        // basic information 
        title : '',
        description : '',
        category : '',
        condition : '',
        item_image: '',

        // auction setting
        starting_price : null,
        auction_time : '',

        // seller information
        seller_id : userLoggedIn.id,
        seller_name : userLoggedIn.username
    })

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        let newValue;

        if (type === "file") {
            newValue = files[0];
        } else if (name === "starting_price") {
            newValue = parseFloat(value);
        } else {
            newValue = value;
        }

        // update auction_time dynamically when days are selected or custom days entered
        setItemData(prev => {
            const updated = { ...prev, [name]: newValue };

            // Calculate future auction_time if needed
            let days = 0;

            if (name === "auction_duration_option" && value !== "custom") {
                days = parseInt(value);
            } else if (name === "custom_days") {
                days = parseInt(value);
            }

            if (days > 0) {
                const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
                updated.auction_time = futureDate.toISOString();
            }

            return updated;
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting item:", itemData);

        try {
            const formData = new FormData();

            for (const key in itemData) {
                if (itemData[key]) {
                    formData.append(key, itemData[key]);
                }
            }

            const res = await fetch("http://localhost:3000/api/items/add", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Couldn't upload item");

            const data = await res.json();
            console.log(data);

        } catch (err) {
            console.error(err.message);
        } finally {
            setItemData({
                title: '',
                description: '',
                category: '',
                condition: '',
                item_image: '',
                starting_price: null,
                auction_time: '',
                seller_id: userLoggedIn.id,
                seller_name: userLoggedIn.username,
                auction_duration_option: '',
                custom_days: ''
            });

            window.location.reload()
        }
    };
        
    
    return ( 
        <div>
        {/* add items */}
            <button onClick={() => setAddingItem(true)} className="ring-1 px-5 py-2">Create Listing</button>
        
            {/* item creating popup */}
            {addingItem && 
                <div className="fixed inset-0 bg-slate-800/60 backdrop-blur-[2px] flex items-center justify-center z-50">
            
                {/* //wrapper */}
                <div className="bg-slate-50/90 p-2">
                    <div className="flex justify-between w-lg p-2 ">
                        <h2 className="text-xl font-bold">Create Item</h2>
                        <button onClick={() => setAddingItem(false)}>❌</button>
                    </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* basic information */}
                    <div className="p-2 space-y-2 *:w-full ">
                        <p className="font-bold">Basic basic informations</p>
                        <input
                         type="text"
                         placeholder="Enter Title"
                         name="title" 
                         value={itemData.title} 
                         onChange={handleChange}
                         required /><br />

                        <div>
                            <textarea
                                value={itemData.description}
                                onChange={handleChange}
                                name="description"
                                className="ring-1 p-2 h-25 w-full resize-none"
                                placeholder="Enter Item Description......"
                                required
                                maxLength={300}
                            />
                            <p className="text-xs text-gray-500 text-right">
                                {itemData.description.length}/300 characters
                            </p>
                        </div>
                        
                        <div className="flex items-baseline justify-between">
                            <p>Category</p>
                            <select
                                name="category"
                                value={itemData.category}
                                onChange={handleChange}
                                className="ring-1 min-w-1/2"
                                required
                            >
                                <option value="">Select</option>
                                <option value="vehicle">Vehicle</option>
                                <option value="electronics">Electronics</option>
                                <option value="furniture">Furniture</option>
                                <option value="home_appliances">Home Appliances</option>
                                <option value="fashion">Fashion & Accessories</option>
                                <option value="books">Books</option>
                                <option value="toys">Toys & Games</option>
                                <option value="crafts">Handmade Crafts</option>
                                <option value="sports">Sports & Outdoors</option>
                                <option value="vintage">Vintage Items</option>
                                <option value="collectibles">Collectibles</option>
                                <option value="art">Art & Antiques</option>
                                <option value="instruments">Musical Instruments</option>
                                <option value="tools">Tools & Equipment</option>
                                <option value="jewelry">Jewelry</option>

                            </select>
                        </div>

                        <div className="flex items-baseline justify-between">
                            <p>Condition</p>
                            <select
                                name="condition"
                                value={itemData.condition}
                                onChange={handleChange} 
                                className="ring-1 min-w-1/2" 
                                required>

                                <option value="">Select</option>
                                <option value="brand_new">Brand New (Sealed)</option>
                                <option value="like_new">Like New</option>
                                <option value="gently_used">Gently Used</option>
                                <option value="used">Used</option>
                                <option value="well_used">Well Used</option>
                                <option value="needs_repair">For Parts or Not Working</option>

                            </select>
                        </div>
                        
                        <input
                        type="file"
                        name="item_image"
                        onChange={handleChange}
                        accept="image/*"
                        required/><br />
                    </div>

                    {/* auction settings */}
                    <div className="p-2 space-y-2 *:flex *:items-baseline *:justify-between">
                        <h2 className="font-bold">Auction settings</h2>
                            <div>
                                <p>{`Set Price for the item ( i.e in Rs )`}</p>
                                <input
                                name="starting_price"
                                onChange={handleChange}
                                className="ring-1 min-w-1/2"
                                type="number"
                                placeholder="Starting price"
                                required/>
                            </div>

                            {/* <div>
                                <h2>Pick Days</h2>
                                <select
                                    name="auction_time"
                                    value={itemData.auction_time}
                                    onChange={handleChange}
                                    className="ring-1 min-w-1/2" 
                                    required
                                    >

                                    <option value="1">1 Day</option>
                                    <option value="3">3 Days</option>
                                    <option value="7">1 Week</option>
                                    <option value="14">2 Weeks</option>
                                    <option value="30">1 Month</option>
                                </select>
                            </div> */}

                            <div>
                                <label className="block mb-1">Pick Auction Duration</label>
                                <div className="flex flex-col">
                                    <select
                                    name="auction_duration_option"
                                    value={itemData.auction_duration_option || ""}
                                    onChange={handleChange}
                                    className="ring-1 min-w-1/2 mb-2"
                                    required
                                >
                                    <option value="">Select Duration</option>
                                    <option value="1">1 Day</option>
                                    <option value="3">3 Days</option>
                                    <option value="7">1 Week</option>
                                    <option value="14">2 Weeks</option>
                                    <option value="30">1 Month</option>
                                    <option value="custom">Custom</option>
                                </select>
                                    <input
                                    type="number"
                                    name="custom_days"
                                    min="1"
                                    placeholder="Enter custom days"
                                    value={itemData.custom_days || ""}
                                    onChange={handleChange}
                                    className= {`ring-1 min-w-1/2 ${itemData.auction_duration_option === "custom" ? 'block' : "hidden"}`}
                                    />
                                </div>
                            </div>

                            
                    </div>

                    {/* seller information */}
                    <div className="p-2 space-y-2 w-full">
                        <h2 className="font-bold">Seller Information</h2>
                            <p>Seller Id: {userLoggedIn.id}</p>
                            <p>Seller Name: {userLoggedIn.username}</p>
                            <p>Seller Email: {userLoggedIn.email}</p>
                        <button type="submit" className="cursor-pointer bg-slate-800/85 text-white hover:bg-yellow-400 hover:ring-0 hover:font-bold transition-all p-2 ring-1 w-full hover:shadow-md">Create Listing</button>
                    </div>

                </form>
                </div>
                {/* wrapper ends */}

            </div>
            }

        </div>
     );
}
 
export default VerifiedUser;