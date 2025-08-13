const Nopage = () => {
  return (
    <div className="dark:bg-[#1E1E1E] dark:text-white bg-[#fff] min-h-screen min-w-screen  grid place-content-center">
      <h2>Sorry the Page youre looking for doesnt exists 😥🤚🏻🛑</h2>

      <p className="py-4 flex gap-2 items-center">
        Go back to
        <a
          className="px-5 py-2 font-semibold bg-green-400 text-black rounded-md hover:bg-green-300 active:scale-95"
          href="/"
        >
          Home
        </a>
      </p>
    </div>
  );
};

export default Nopage;
