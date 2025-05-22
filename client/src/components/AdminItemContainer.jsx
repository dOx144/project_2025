import AdminItemVerification from "./AdminItemVerification";
import ItemDeleteAction from "./ItemDeleteAction";

const AdminItemContainer = ({data, onRefresh}) => {

    const handleVerify = () => {
        console.log("Verified");
    }

    return ( 
        <div>
        <h2 className="text-lg font-semibold mb-4">Item Lists</h2>

        <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
            <thead>
                <tr>
                {[
                    'ID', 'Name', 'Image', 'Description', 'Seller', 'Verified',
                    'Seller ID', 'Tags', 'Starting Price', 'Current Price',
                    'Created At', 'Ends At', 'Action'
                ].map((header, i) => (
                    <th key={i} className="border p-2 min-w-[150px] text-left">
                    {header}
                    </th>
                ))}
                </tr>
            </thead>

            <tbody>
                {data.length ? (
                data.sort((a, b) => a.id - b.id).map((data) => (
                    <tr key={data.id}>
                    <td className="border p-2">{data.id}</td>
                    <td className="border p-2">{data.title}</td>
                    <td className="border p-2">
                        <img
                        src={data.image_url}
                        alt={data.title}
                        className="h-16 w-16 object-cover rounded"
                        />
                    </td>
                    <td className="border p-2">{data.description}</td>
                    <td className="border p-2">{data.seller}</td>
                    <td className="border p-2">
                       {data.is_verified? <p>✅</p> : <p>❌</p>}
                    </td>
                    <td className="border p-2">{data.owner_id}</td>
                    <td className="border p-2">{data.tags?.join(', ')}</td>
                    <td className="border p-2">{data.starting_price}</td>
                    <td className="border p-2">{data.current_price}</td>
                    <td className="border p-2">
                        {new Date(data.created_at).toLocaleString()}
                    </td>
                    <td className="border p-2">
                        {new Date(data.ends_at).toLocaleString()}
                    </td>
                    <td className="border p-2 space-y-2">
                        <AdminItemVerification data={data} onVerify={onRefresh}/>
                        <button className="w-full mr-2 px-2 py-1 bg-blue-500 text-white rounded">
                        Edit
                        </button>
                       <ItemDeleteAction id = {data.id} onDelete={onRefresh}/>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td className="border p-4 text-center" colSpan={13}>
                    No Items found.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
    </div>
     );
}
 
export default AdminItemContainer;