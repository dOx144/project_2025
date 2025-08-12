import { useState } from "react";

const UserInterest = ({tags}) => {

    const userLoggedIn = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'))
     const [selectedInterests, setSelectedInterests] = useState([]);

    const handleAddInterest = () => {
    const select = document.getElementById('user_interest');
    const selectedOptions = Array.from(select.selectedOptions).map(option => option.value);

    setSelectedInterests(prev => {
        // Combine previous interests and new ones
        const combined = [...prev, ...selectedOptions];
        // Remove duplicates
        const unique = Array.from(new Set(combined));
        return unique;
    });
    };

    const check = () => {
        console.log(JSON.stringify({
            userId: userLoggedIn.id,       // current user's ID
            interests: selectedInterests,  // array of selected interests
        }),);
    }

    const updateUserInterestsInStorage = (newInterests) => {
    ['localStorage', 'sessionStorage'].forEach(storageType => {
        const storage = window[storageType];
        const userDataStr = storage.getItem('userData');
        if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userData.user_interest = newInterests;
        storage.setItem('userData', JSON.stringify(userData));
        }
    });
    };

    const saveUserInterests = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/users/updateInterest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: userLoggedIn.id,       // current user's ID
            interests: selectedInterests,  // array of selected interests
        }),
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error( data.message || 'Failed to save interests');
        }

        alert('Interests saved successfully!');

        updateUserInterestsInStorage(selectedInterests)

        window.location.reload()
    } catch (error) {
        console.error('Error saving interests:', error);
        alert('Error saving interests: ' + error.message);
    }
    };

    return ( 
        <div className="ring-2 rounded-xl p-4 bg-slate-50/70 text-black">
        <h2 className="text-xl mb-2">Hello {userLoggedIn.username},</h2>
        <p className="mb-4">
            Please select at least 3 of your interests
        </p>
        <div className="flex flex-col gap-4">
        <div className=" min-w-lg flex gap-4">
            <div className="w-1/2 space-y-4">
            <select
            className="w-full border border-gray-300 rounded-md p-2 min-h-[250px] *:p-2 *:hover:bg-blue-600/40 *:hover:text-white *:active:bg-green-400"
            name="user_interest"
            id="user_interest"
            multiple
            size={5}
            >
            {/* {tags.map((tag, index) => {
            if (tag === "All") return null; // skip rendering this option
                return (
                <option key={index} value={tag}>
                    {tag}
                </option>
                );
            })} */}
                {/* <option value="">Select</option> */}
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

            <button
                type="button"
                onClick={handleAddInterest}
                className="bg-blue-600 text-white py-2 w-full rounded-md hover:bg-blue-700 transition"
            >
                Add
            </button>
        </div>

    <div>
    {selectedInterests.length > 0 && (
    <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
        <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Selected Interests</th>
            <th className="border border-gray-300 px-4 py-2">Remove</th>
        </tr>
        </thead>
        <tbody>
        {selectedInterests.map((interest, idx) => (
            <tr key={idx}>
            <td className="border border-gray-300 px-4 py-2">{interest}</td>
            <td className="border border-gray-300 px-4 py-2">
                <button
                className="text-red-600 hover:text-red-800 w-full h-full"
                onClick={() =>
                    setSelectedInterests(prev =>
                    prev.filter(item => item !== interest)
                    )
                }
                >
                X
                </button>
            </td>
            </tr>
        ))}
        </tbody>
    </table>
    )}
    </div>



    </div>
        
        {/* saving button */}
        {selectedInterests.length > 2 && (
        <button
        type="button"
        onClick={() => saveUserInterests()}
        // onClick={() => check()}
        className="mt-4 bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition"
        >
        Save
        </button>
        )}



    </div>
        </div>

     );
}
 
export default UserInterest;