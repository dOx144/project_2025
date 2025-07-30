import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";

const UserProfile = () => {
    const userLoggedIn = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'))
    const {id} = useParams()
    const [usernames, setUsernames] = useState([]);
    const [user, setUser] = useState([])
    
    const navigate = useNavigate()
    if(!userLoggedIn) navigate('/')
        
    useEffect(() => {
        fetch('http://localhost:3000/api/usernames') 
        .then(res => res.json())
        .then(data => setUsernames(data))
        .catch(err => console.error('Failed to fetch usernames:', err));

        fetch("http://localhost:3000/api/userdetails/" + id)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error("Failed to fetch user",  err.message));
    }, []);

    return ( 
         <div className="dark:bg-[#1E1E1E] dark:text-white bg-[#fff] min-h-screen flex flex-col">
            <div className="flex-grow flex flex-col justify-between items-center space-y-4 w-full max-w-4xl mx-auto px-4 lg:p-0">
                <Header/>

                <main className="flex-grow flex flex-col items-start w-full space-y-4">

                {userLoggedIn?.username === id ? (
                // Own profile
                <div className="space-y-10 w-full">
                    <div className="w-xl bg-white p-6 shadow-md space-y-4 text-black">
                            <div className="flex items-center gap-4">
                                <img
                                src={userLoggedIn.profile_pic}
                                alt="Profile"
                                className="w-20 h-20 rounded-full border object-cover"
                                />
                            <div>
                                <h2 className="text-2xl font-semibold capitalize">
                                    Hello, {userLoggedIn.username}
                                </h2>
                                <p className="text-gray-600">User ID: {userLoggedIn.id}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p>
                            <strong>Joined:</strong>{' '}
                            {new Date(userLoggedIn.created_at).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Email:</strong> {userLoggedIn.email}
                        </p>
                        <p className="capitalize">
                            <strong>Role:</strong> {userLoggedIn.role}
                        </p>
                        <p>
                            <strong>Verified:</strong>{' '}
                            {userLoggedIn.is_verified ? 'Yes 🟢' : 'No 🔴'}
                        </p>

                        <p className="font-semibold">Interests: {userLoggedIn.user_interest}</p>
                    </div>
                    </div>

                    {/* user posts */}
                    <div className="w-full p-6 space-y-4 text-black bg-white">
                        <h2 className="text-xl">Your got no ongoing posts</h2>
                        <p>Please verify to add your posts. 🙂</p>
                    </div>
                </div>
                ) : (
                // Public profile
                <div className="space-y-10">
                    <div className="min-w-lg bg-white p-6 shadow-md space-y-4 text-black">
                    <div className="flex items-center gap-4">
                        <img
                        src='http://localhost:3000/api/uploads/default_profile.png'
                        alt={`${id.username}'s Profile`}
                        className="w-20 h-20 rounded-full border object-cover"
                        />
                        <div>
                        <h2 className="text-2xl font-semibold capitalize">{user.username}</h2>
                        <p className="text-gray-500 capitalize">Role: {user.role}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p>
                        <strong>Member since:</strong>{' '}
                        {new Date(user.created_at).toLocaleDateString()}
                        </p>

                        {user.user_interest ? (
                        <div>
                            <p className="font-semibold">Interests:</p>
                            <ul className="list-disc ml-6">
                            {user.user_interest.split(',').map((interest, i) => (
                                <li key={i} className="capitalize">
                                {interest}
                                </li>
                            ))}
                            </ul>
                        </div>
                        ) : (
                        <p className="text-gray-500 italic">No interests listed.</p>
                        )}
                    </div>
                    </div>

                    {/* user posts */}
                    <div className="w-full p-6 space-y-4 text-black bg-white">
                    <h2 className="text-xl font-semibold">{user.username}'s Posts</h2>
                    <p className="text-gray-600">This user has not posted anything yet.</p>
                    </div>
                </div>
                )}

                           
                </main>
            </div>
        </div>
     );
}
 
export default UserProfile;