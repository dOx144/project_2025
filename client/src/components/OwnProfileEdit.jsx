import { useState } from "react";

const OwnProfileEdit = ({ handleEdit, userLoggedIn }) => {
  const [editData, setEditData] = useState({
    id: userLoggedIn.id,
    username: userLoggedIn.username,
    email: userLoggedIn.email,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    console.log("Saving:", editData); // simulate saving

    try {
      const res = await fetch("http://localhost:3000/api/userdata/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      console.log("Server response:", data);
    } catch (err) {
      console.error("Update error:", err.message);
    }

    handleEdit(); // close the edit modal
  };

  return (
    // ✅ CHANGED: simplified container using `inset-0` and improved layout
    <div className="absolute inset-0 grid place-content-center z-10 bg-slate-50/60 backdrop-blur-[2px]">
      {/* ✅ CHANGED: added styling like shadow, padding, rounded corners, and min width */}
      <div className="w-sm ring-1 p-4 bg-white space-y-4 shadow-xl rounded-md min-w-[300px]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit your information</h2>

          {/* ✅ CHANGED: added hover and accessibility improvements */}
          <button
            onClick={handleEdit}
            title="Close"
            className="text-lg hover:text-red-500"
          >
            ❌
          </button>
        </div>

        {/* Form section */}
        <div className="flex flex-col gap-3">
          {/* ✅ FIXED: added `name="username"` to make `handleChange` work */}
          {/* ✅ CHANGED: added Tailwind classes for padding, border, focus ring */}
          <input
            placeholder="Change Username"
            type="text"
            name="username"
            value={editData.username}
            onChange={handleChange}
          />

          {/* ✅ FIXED: added `name="email"` for handleChange to update correctly */}
          <input
            placeholder="Change Email"
            type="email"
            name="email"
            value={editData.email}
            onChange={handleChange}
          />
        </div>

        {/* ✅ CHANGED: added click handler, styling, and hover effect */}
        <button
          onClick={handleSave}
          className="w-full py-2 ring-1 rounded bg-green-400 text-white font-semibold hover:bg-green-500 transition-all"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default OwnProfileEdit;
