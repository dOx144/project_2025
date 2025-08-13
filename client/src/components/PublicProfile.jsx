import { Link } from "react-router-dom";
import PublicItems from "./PublicItems";

const PublicProfile = ({ id, user, userItems }) => {
  return (
    <div className="space-y-10 w-full">
      <div className="w-lg  bg-white p-6 shadow-md space-y-4 text-black">
        <div className="flex items-center gap-4">
          <img
            src="http://localhost:3000/api/uploads/default_profile.png"
            alt={`${id.username}'s Profile`}
            className="w-20 h-20 rounded-full border object-cover "
          />
          <div>
            <h2 className="text-2xl font-semibold capitalize">
              {user.username}
            </h2>
            <p className="text-gray-500 capitalize">Role: {user.role}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p>
            <strong>Member since:</strong>{" "}
            {new Date(user.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          {user.user_interest ? (
            <div>
              <p>
                <strong>Interests:</strong>
              </p>
              <ul className="list-disc ml-6">
                {(Array.isArray(user?.user_interest)
                  ? user.user_interest
                  : user?.user_interest
                      ?.replace(/[{}"]/g, "") // remove curly braces and quotes
                      .split(",")
                      .map((i) => i.trim())
                ) // remove extra spaces
                  ?.map((interest, i) => (
                    <li key={i} className="capitalize">
                      {interest.replace(/_/g, " ")}{" "}
                      {/* replace underscores with spaces */}
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
      <div className=" space-y-2">
        {userItems.some((el) => !el.is_verified) && (
          <h2 className="p-1 ring-1 px-3 py-2 w-fit">Not Verified Items</h2>
        )}
        {userItems
          .filter((el) => !el.is_verified)
          .map((el, idx) => (
            <PublicItems el={el} key={idx} />
          ))}
      </div>

      <div className="space-y-2 bg-white text-black p-2">
        {userItems.some((el) => el.is_verified) ? (
          <>
            <h2 className="p-1 ring-1 px-3 py-2 w-fit">Verified Items</h2>
            {userItems
              .filter((el) => el.is_verified)
              .map((el, idx) => (
                <PublicItems el={el} key={idx} />
              ))}
          </>
        ) : (
          <p className="p-1 text-gray-500 italic">
            No verified items available
          </p>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
