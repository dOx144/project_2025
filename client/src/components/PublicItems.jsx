import { Link } from "react-router-dom";

const PublicItems = ({ el }) => {
  return (
    <div className="ring-1 flex p-1 gap-4 group shadow-md hover:shadow-xl">
      <div className="w-1/2 size-55 overflow-hidden">
        <img
          className="group-hover:scale-110 transition-all duration-500 w-full h-full object-cover rounded-md"
          src={el.image_url}
          alt={el.title}
        />
      </div>
      <div className="w-full flex flex-col justify-between  p-1">
        <div className="space-y-2">
          <div>
            <div className="flex items-center w-full ">
              <h2 className="text-2xl">{el.title}</h2>
              <p title={el.is_verified ? "Verified" : "Item Not Verified"}>
                {el.is_verified ? "✅" : "❌ {waiting for verification}"}
              </p>
            </div>
            <p>{el.description}</p>
          </div>

          <div className="flex justify-between items-baseline ring-1 p-1 ring-slate-400/30">
            <div>
              <p>Started price : {el.starting_price}</p>
              <p>Current price : {el.current_price}</p>
            </div>
            <div className="text-sm">
              <p>Listed on: {new Date(el.created_at).toLocaleDateString()}</p>
              <p>
                {new Date(el.ends_at) < new Date() ? "Expired" : "End"} at:{" "}
                {new Date(el.ends_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {new Date(el.ends_at) > new Date() && el.is_verified ? (
          <Link
            to={`/item/${el.title + "=it_id" + el.id}`}
            className="w-full p-2 ring-1 hover:ring-0 hover:bg-slate-800 hover:text-white transition-all cursor-pointer active:scale-95 text-center"
          >
            {" "}
            <span className="font-bold text-green-200">Available</span> Add your
            Bid
          </Link>
        ) : (
          <Link
            to={"#"}
            className="w-full p-2 ring-1 hover:ring-0 hover:bg-slate-800 hover:text-white transition-all cursor-pointer active:scale-95 text-center group"
          >
            {" "}
            <span className="text-red-800 font-bold group-hover:text-red-400">
              {!el.is_verified ? "Not Verified" : "EXPIRED"}
            </span>{" "}
            Bid Unavailable
          </Link>
        )}
      </div>
    </div>
  );
};

export default PublicItems;
