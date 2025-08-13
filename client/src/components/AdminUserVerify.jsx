const AdminUserVerify = ({ data, onVerify }) => {
  const handleVerify = async (data) => {
    const fetchUrl = "http://localhost:3000/api/admin/user_verification";
    try {
      const res = await fetch(fetchUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Error occured during verification process");
      }

      const mydata = await res.json();
      console.log(mydata);

      onVerify();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <button
      onClick={() => handleVerify(data)}
      className=" w-full bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
    >
      {data.is_verified ? "Unverify" : "Verify"}
    </button>
  );
};

export default AdminUserVerify;
