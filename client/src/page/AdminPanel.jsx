import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import AdminItemContainer from "../components/AdminItemContainer";
import AdminUserContainer from "../components/AdminUserContainer";
import { CiLogout } from "react-icons/ci";

const AdminPanel = () => {
  const adminLoggedIn = JSON.parse(localStorage.getItem("adminData"));

  const handleClearStorage = () => {
    localStorage.removeItem("adminData");
    window.location.reload();
  };

  const navigate = useNavigate();
  const admin_dashboard = ["users", "items"];
  const [isViewingUsers, setIsViewingUsers] = useState(true);

  const [userLists, setUserLists] = useState([]);
  const [itemLists, setItemLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = (e) => {
    const viewing = e.target.textContent;
    setIsViewingUsers(viewing === "users" ? true : false);
  };

  const fetchAdminData = async () => {
    setIsLoading(true);

    const { id, username, email, role } = adminLoggedIn;

    try {
      const [res_users, res_items] = await Promise.all([
        fetch("http://localhost:3000/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, username, email, role }),
        }),
        fetch("http://localhost:3000/api/admin/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, username, email, role }),
        }),
      ]);

      if (!res_users.ok) {
        throw new Error("Error occurred while fetching users");
      }
      if (!res_items.ok) {
        throw new Error("Error occurred while fetching items");
      }

      const data_users = await res_users.json();
      const data_items = await res_items.json();

      setUserLists(data_users);
      setItemLists(data_items);
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "OAH Admin Panel";

    if (!adminLoggedIn) {
      navigate("/");
    }

    fetchAdminData();
  }, [navigate]);

  return (
    <div className="dark:bg-[#1E1E1E] dark:text-white bg-[#e6dbdb8d] min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col justify-between items-center space-y-4 w-full max-w-4xl mx-auto px-4 lg:p-0">
        <div className="ring-1 w-full p-4 flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <h2 className="text-xl font-semibold">OAH Dashboard</h2>
            <button
              onClick={handleClearStorage}
              className=" ring-1 group cursor-pointer hover:ring-1 rounded-md p-2 flex items-center gap-2"
            >
              <p>Logout</p>
              <CiLogout className="size-6" title="Logout" />
            </button>
          </div>

          <div className="space-x-5 flex">
            {admin_dashboard.map((el, ind) => (
              <button
                key={el + ind}
                onClick={handleClick}
                className=" capitalize font-semibold cursor-pointer ring-1 py-2 px-5 rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black "
              >
                {el}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p>Loading please wait...</p>
        ) : (
          <main className="w-full h-full ring-1 flex-grow">
            {/* users panel */}
            {isViewingUsers && (
              <AdminUserContainer
                onRefresh={fetchAdminData}
                setUserLists={setUserLists}
                data={userLists.result}
              />
            )}

            {/* items panel */}
            {!isViewingUsers && (
              <AdminItemContainer
                onRefresh={fetchAdminData}
                data={itemLists.result}
              />
            )}
          </main>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default AdminPanel;
