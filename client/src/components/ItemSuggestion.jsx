import Item from "./Item";

const ItemSuggestion = ({data, itemId, userLoggedIn}) => {
    return ( 
        <div>
            <h2 className="text-2xl lg:text-4xl font-semibold">Watch out for these items <span className="font-semibold">Just for you</span>.</h2>

            {/* contents */}
            <main>
            {data.filter(el => el.id !== itemId).length > 0 ? (
                data
                .filter(el => el.id !== itemId)
                .map((el, ind) => (
                    <Item data={el} key={ind} userLoggedIn = {userLoggedIn} />
                ))
            ) : (
                <div className="text-gray-500 text-center mt-4 space-y-4">
                    <p>No similar items available 😵.</p>
                    <a className="py-2 px-5 ring-1" href="/">Home</a>
                </div>
            )}
            </main>

        </div>
     );
}
 
export default ItemSuggestion;