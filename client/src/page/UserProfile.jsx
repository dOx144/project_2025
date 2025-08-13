import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import VerifiedUser from "../components/VerifiedUser";
import PublicProfile from "../components/PublicProfile";
import OwnProfile from "../components/OwnProfile";
import Footer from "../components/Footer";

const UserProfile = () => {
  const userLoggedIn =
    JSON.parse(localStorage.getItem("userData")) ||
    JSON.parse(sessionStorage.getItem("userData"));
  const { id } = useParams();
  const [usernames, setUsernames] = useState([]);
  const [user, setUser] = useState([]);
  const [userNotFound, setUserNotFound] = useState(false);
  const [userItems, setUserItems] = useState([]);

  const navigate = useNavigate();
  // if(!userLoggedIn) navigate('/')

  useEffect(() => {
    fetch("http://localhost:3000/api/usernames")
      .then((res) => res.json())
      .then((data) => setUsernames(data))
      .catch((err) => console.error("Failed to fetch usernames:", err));

    fetch("http://localhost:3000/api/userdetails/" + id)
      .then((res) => {
        if (!res.ok) {
          setUserNotFound(true);
          throw new Error("User not found");
        }
        setUserNotFound(false);
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => console.error("Failed to fetch user", err.message));

    fetch("http://localhost:3000/api/user/" + id)
      .then((res) => {
        if (!res.ok) throw new Error("Error Fetching UserData");
        return res.json();
      })
      .then((data) => setUserItems(data))
      .catch((err) => console.error("Fetch error:", err.message));
  }, []);

  if (userNotFound)
    return (
      <div className="dark:bg-[#1E1E1E] dark:text-white bg-[#fff] min-h-screen flex flex-col">
        <div className="flex-grow flex flex-col justify-between items-center space-y-4 w-full max-w-4xl mx-auto px-4 lg:p-0">
          <Header />

          {/* user not found */}
          <div>
            <h1>User not Found</h1>
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 ring-1 w-full cursor-pointer hover:ring-0 hover:bg-white hover:text-black transition-all duration-300 hover:shadow-xl"
            >
              Go Back
            </button>
          </div>

          <Footer />
        </div>
      </div>
    );

  return (
    <div className="dark:bg-[#1E1E1E] dark:text-white bg-[#fff] min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col justify-between items-center space-y-4 w-full max-w-4xl mx-auto px-4 lg:p-0">
        <Header />

        <main className="flex-grow flex flex-col items-start w-full space-y-4">
          {userLoggedIn?.username === id ? (
            // Own profile
            <OwnProfile
              user={user}
              id={id}
              userItems={userItems}
              userLoggedIn={userLoggedIn}
              VerifiedUser={VerifiedUser}
            />
          ) : (
            // Public profile
            <PublicProfile user={user} id={id} userItems={userItems} />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default UserProfile;
