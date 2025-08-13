import { useState } from "react";

const ItemDeleteAction = ({ id, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async (id) => {
    const deleteUrl = `http://localhost:3000/api/admin/delete_item/${id}`;

    try {
      const res = await fetch(deleteUrl, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed To delete");
      }

      const data = await res.json();
      alert(data.message);

      onDelete();
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      {confirmDelete ? (
        <div className=" *:px-2 *:w-1/2 *:py-1 *:ring-1 flex gap-2 *:rounded-md *:cursor-pointer">
          <button onClick={() => handleDelete(id)} title="Confirm_Delete">
            ✅
          </button>
          <button onClick={() => setConfirmDelete(false)} title="Cancle_Delete">
            ❌
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmDelete(true)}
          className={`w-full bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-all ${
            confirmDelete ? "scale-0" : "scale-100"
          }`}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default ItemDeleteAction;
