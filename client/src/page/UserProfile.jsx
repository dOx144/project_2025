import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";

const UserProfile = () => {
    const userLoggedIn = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'))
    
    const navigate = useNavigate()
    if(!userLoggedIn) navigate('/')

         const {id} = useParams()
    return ( 
         <div className="dark:bg-[#1E1E1E] dark:text-white bg-[#fff] min-h-screen flex flex-col">
            <div className="flex-grow flex flex-col justify-between items-center space-y-4 w-full max-w-4xl mx-auto px-4 lg:p-0">
                <Header/>

                <main className="flex-grow flex flex-col items-start w-full space-y-4">
                <h2>This is User page</h2>
                <p>Welcome {id}</p>
                </main>
            </div>
        </div>
     );
}
 
export default UserProfile;