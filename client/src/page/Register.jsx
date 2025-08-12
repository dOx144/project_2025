import { useEffect } from "react";
import { useState } from "react";
import {useNavigate} from 'react-router-dom'

const Register = () => {

    const [userData, setUserData] = useState({
        user_first:'',
        user_last:'',
        password:'',
        email:'',
        confirm_password:'',
        user_agreed:false
    })

    const navigation = useNavigate();
    const [error, setError] = useState(null)
    const [response, setResponse] = useState(null)

    const handleChange = e =>{
        const {name, value, type, checked} = e.target

        setUserData(prev => ({
            ...prev,
            [name] : type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError(null)

         const requiredFields = ['email', 'password', 'confirm_password', 'user_first', 'user_last'];

        for (const field of requiredFields) {
            if (!userData[field] || userData[field].trim() === '') {
            return alert(`Please fill the ${field.replace('_', ' ')} field`);
            }
        }

        if(userData.password !== userData.confirm_password){
            return alert("Password Doesn't Matches") 
        }

        if(userData.password.length < 8){
            return alert("Password length too short")
        }

        if (!/\d/.test(userData.password)) {
        return alert("Password must contain at least one number");
        }

        if(userData.user_agreed === false){
            return alert("Please agree to the terms and conditions")
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(userData.email)){
            return alert("Please enter a valid email address.")
        }
        
        if(!userData.email.trim().endsWith("@gmail.com")){
            return alert ("Please use a valid gmail account to register! ")
        }

        try{
            const res = await fetch("http://localhost:3000/api/users",{
                method: "POST",
                headers:{
                    'Content-Type' : 'application/json',
                },
                body:JSON.stringify({
                    username: userData.user_first.trim() + " " + userData.user_last.trim(),
                    email : userData.email,
                    password : userData.password
                })
            })

            if(!res.ok){
                throw new Error("Regisration failed!")
            }

            const data = await res.json();
            setResponse(data)
            alert("User Registered Successfully!! Now you can go to login.")
            
            navigation('/')
        }catch(err){
            setError(err.message)
        }finally{
            console.log({message:"User Registered Successfully!!", userData});
            
            setUserData(prev => ({
                ...prev,
                user_first: '',
                user_last: '',
                password: '',
                email: '',
                confirm_password: '',
                user_agreed: false
            }));
        }
        
        
    }

    useEffect(()=>{
        document.title = "O.A.H Register"
    },[])
    
    return ( 
        <div className="dark:bg-[#1E1E1E] dark:text-white bg-[#e5e5e5a6] min-h-screen flex flex-col">
            <div className="flex-grow flex flex-col items-center justify-center">
                
                {/* register wrapper */}
                <main className="md:ring-1 px-8 py-12 w-full max-w-md space-y-6 rounded-xl bg-[#1e1e1ecf]  text-white">
                    {/* title text */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold">
                        Create your
                        <br/>
                        Online Acution House Account
                        </h2>
                    <p>Join the OAH to surf through Thousands of items from antiques to basic</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <div className="flex gap-2 justify-between">
                            <input
                            value={userData.user_first}
                            onChange={handleChange}
                            className="w-1/2"
                            type="text"
                            name="user_first"
                             placeholder="First Name"/>
                             
                            <input
                            value={userData.user_last}
                            onChange={handleChange}
                            className="w-1/2"
                            type="text" 
                            name="user_last" 
                            placeholder="Last Name"/>
                        </div>

                        <input
                        value={userData.email} 
                        onChange={handleChange}
                        type="email" 
                        name="email" 
                        placeholder="Email" />

                        <input
                        value={userData.password} 
                        onChange={handleChange}
                        type="password" 
                        name="password" 
                        placeholder="Password" />

                        <input
                        value={userData.confirm_password} 
                        onChange={handleChange}
                        type="password" 
                        name="confirm_password" 
                        placeholder="Confirm Password" />

                        {/* user remember */}
                        <div className="text-sm flex items-center gap-2">
                            <input
                            checked={userData.user_agreed} 
                            onChange={handleChange}
                            type="checkbox" 
                            name="user_agreed" />
                            <label htmlFor="user_agreed">I agree to our <a href="#"> terms and conditions.</a></label>
                        </div>

                        <button className="ring-1 py-3 rounded-[8px] cursor-pointer dark:bg-white dark:text-black font-semibold bg-" type="submit">Register</button>
                    </form>

                    <div>
                        <p className="text-center">Already haave an account? <a className="font-semibold underline" href="/login">Login</a></p>
                    </div>
                </main>
            </div>
             {error && <p className="text-red-600 mt-4">{error}</p>}
             {response && <pre className="mt-4 text-green-600">{JSON.stringify(response, null, 2)}</pre>}

        </div>
     );
}
 
export default Register;