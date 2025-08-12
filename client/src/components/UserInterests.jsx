import UserInterestItems from "./UserInterestITems";

const UserInterests = ({userLoggedIn, items}) => {

    const {user_interest} = userLoggedIn
    const userInterestedItems = items.filter(el =>
        Array.isArray(user_interest) &&
        Array.isArray(el.tags) &&
        user_interest.some(x => el.tags.includes(x))
        );
    // console.log(userInterestedItems, user_interest);
    // console.log(userLoggedIn);
    return ( 
        <div className="w-full">
            <div className="font-semibold flex items-center gap-2">
            <p className="text-3xl">Items Similar to your interests</p>
            {/* <p className="self-end">
                {user_interest?.toString()
                .split(',')
                .map((el) => el.trim())
                .join(', ')}
            </p> */}
            </div>

            {/* showing interests items */}
            <div className="w-full h-[350px] ring-1 p-2 flex gap-2 overflow-x-scroll hide-scrollbar-x">

                {/* displaying user interested items */}
                {userInterestedItems.map((el, idx) => 
                    <UserInterestItems key={idx} data = {el} />
                )}

            </div>

        </div>
     );
}
 
export default UserInterests;