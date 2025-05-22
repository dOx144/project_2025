import { useState } from "react"
import UserDeleteAction from "./UserDeleteAction";
import AdminUserVerify from "./AdminUserVerify";

const AdminUserContainer = ({data, onRefresh}) => {

    // const [confirmDelete, setConfirmDelete] = useState(false)

    // const handleVerify = async(data) => {
    //     const fetchUrl = 'http://localhost:3000/api/admin/user_verification'
    //     try{
    //         const res = await fetch(fetchUrl,{
    //             method : "PATCH",
    //             headers: {
    //                 "Content-Type" : "application/json"
    //             },
    //             body : JSON.stringify(data)
    //         })

    //         if(!res.ok){
    //             throw new Error("Error occured during verification process")
    //         }

    //         const mydata = await res.json()
    //         console.log(mydata);

    //         window.location.reload()
    //     }catch(err){
    //         console.error(err.message);
    //     }
    // }

    // const handleDelete = async(id) => {
    //     const deleteUrl = `http://localhost:3000/api/admin/delete_user/${id}`
        
    //     try{
    //         const res = await fetch(deleteUrl,{method:"DELETE"})

    //         if(!res.ok){
    //             throw new Error("Failed To delete")
    //         }
            
    //         const data = await res.json()
    //         alert(data.message)
    //     }catch(err){
    //         console.log(err.message);
    //     }
    // }

    return ( 
        <div className=" *:transition-all **:transition-all">
            <h2 className=" font-semibold text-xl p-4">User Lists</h2>      
            
            <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
            <thead>
            <tr>
                {[
                    'ID', 'Username', 'Email', 'Password', 'Role',
                    'Verified', 'Created At', 'Actions'
                ].map((header, i) => (
                    <th key={i} className="border p-2 min-w-[150px] text-left">{header}</th>
                ))}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                data.sort((a,b) => a.id - b.id).map((data) => (
                    <tr key={data.id} className="text-center ">
                    <td className="border p-2">{data.id}</td>
                    <td className="border p-2">{data.username}</td>
                    <td className="border p-2">{data.email}</td>
                    <td className="border p-2">••••••••</td>
                    <td className="border p-2">{data.role}</td>
                    <td className="border p-2">
                        {data.is_verified ? "✅" : "❌"}
                    </td>
                    <td className="border p-2">
                        {data.created_at
                        ? new Date(data.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="border p-2 space-x-2 space-y-2">
                        <AdminUserVerify data = {data} onVerify = {onRefresh} />
                        <UserDeleteAction id={data.id} onDelete = {onRefresh}/>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="8" className="text-center p-4">
                    No users found.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
    </div>
    );
}
 
export default AdminUserContainer;