import { useState } from "react";

const UserItemEdit = ({ el, handleEdit }) => {
  const [itemData, setItemData] = useState({
    id: el.id,
    title: el.title,
    description: el.description,
    price: el.current_price,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    handleEdit()
  }

  return (
    <div className="absolute top-0 left-0 grid w-full h-full place-content-center bg-slate-50/60 backdrop-blur-[2px] z-10">
      <div className="w-sm ring-1 p-4 bg-slate-50/90 space-y-4 rounded-md shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Item Information</h2>
          <button title="Cancel Edit" onClick={handleEdit}>
            ❌
          </button>
        </div>

        {/* Item Information Inputs */}
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            name="title"
            value={itemData.title}
            onChange={handleChange}
            className="ring-1 p-2"
            placeholder="Edit Title"
          />

          <textarea
            name="description"
            value={itemData.description}
            onChange={handleChange}
            className="ring-1 p-2 resize-none max-h-40"
            placeholder="Enter Item Description..."
          />

          <input
            type="number"
            name="price"
            value={itemData.price}
            onChange={handleChange}
            className="ring-1 p-2"
            placeholder={`Current price (Rs): ${itemData.price}`}
          />
        </div>

        <button 
        onClick={handleSave}
        className="w-full p-2 ring-1 hover:bg-green-400 hover:font-semibold hover:text-white hover:ring-0 transition-all">
          Save
        </button>
      </div>
    </div>
  );
};

export default UserItemEdit;
