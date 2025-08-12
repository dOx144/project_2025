const UserRules = () => {
    return (
        <div className="hidden 2xl:block fixed bottom-4 opacity-60 hover:opacity-100 transition-all top-10 left-4 max-w-md p-4 bg-white dark:bg-[#1E1E1E] text-black dark:text-white ring-1 ring-slate-50 shadow-lg rounded-lg z-50 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4">📜 Platform Rules</h2>

            {/* User Rules */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">👤 User Rules</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>🛒 You can freely explore and view all items listed for auction.</li>
                    <li>🔐 To place a bid on any item, you must <strong>create an account</strong>.</li>
                    <li>✅ To post items for auction, your account must be <strong>verified</strong>.</li>
                    <li>📤 Once verified, you are eligible to <strong>list your own items</strong> for bidding.</li>
                    <li>🆔 After bidding ends, winning bidder will receive a <strong>Item Code</strong> and <strong>contact info</strong> to the seller.</li>
                    <li>🔑 Use the <strong>Item Code</strong> to verify each other's identity before proceeding further.</li>
                    <li>⚠️ Please stay cautious and prioritize your <strong>personal safety</strong> when meeting anyone in person.</li>
                </ul>
            </div>

            {/* Buyer Rules */}
            <div>
                <h3 className="text-xl font-semibold mb-2">🛍️ Buyer Rules</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                    {/* <li>🔍 Read item details carefully. Ask questions if anything is unclear.</li> */}
                    <li>💵 Only place bids you’re ready to pay. All bids are <strong>final and binding</strong>.</li>
                    <li>🧾 Wait for confirmation after winning — a code and seller contact info will be sent to you.</li>
                    <li>🤝 Use the code to verify the seller’s identity before any transaction.</li>
                    <li>🏷️ Meet in safe public places to complete the transaction.</li>
                    <li>🚫 Fraud, impersonation, or fake bidding will lead to <strong>account suspension</strong>.</li>
                </ul>
            </div>
        </div>
    );
};

export default UserRules;
