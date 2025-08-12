import { Link } from "react-router-dom";

const UserInterestItems = ({data}) => {
    return ( 
        <div className="min-w-3/5 p-1 relative overflow-hidden group">
            <div className="w-full overflow-hidden">
                <img className="w-full h-full group-hover:scale-110 duration-700 object-cover" src={data.image_url} />
            </div>
            <div className="absolute top-0 left-0 p-2 text-2xl group-hover:-top-20 transition-all bg-slate-800/30">
                <p className="text-3xl ">{data.title} </p>
                <div className="flex gap-2">
                    {data.tags.map((el, idx) => 
                    <p key={el + idx}>{el}</p>
                    )}
                </div>
            </div>
                      
            <div className="z-10 flex flex-col justify-between max-h-[50%] absolute top-full group-hover:top-[50%] left-0 w-full bg-slate-600/50 h-full backdrop-blur-[2px] p-2 transition-all delay-100">
               <div>
                    <div className="flex items-center">
                        <h2 className="text-2xl"> {data.title}</h2>               
                        <p className="self-end" title={data.is_verified ? "This Item is Verified" : "This Item is not Verified" }>{data.is_verified ? "✅" : "❌"}</p>
                    </div>
                    <p className=" line-clamp-1">{data.description}</p>
               </div>

                <div className="flex justify-between text-sm">
                    <div>
                        <p>Listed on: {new Date(data.created_at).toLocaleDateString()}</p>
                        <p>Ends at: {new Date(data.ends_at).toLocaleDateString()}</p>
                    </div>
                    <div className=" hover:bg-slate-800 hover:text-white transition-all ring-1 hover:ring-0 self-end px-10 py-2">
                        <Link to={`/item/${data.title + "=it_id" + data.id}`}>View</Link>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default UserInterestItems;