export default function Login() {
  const input = id => (
    <>
      <label for={id.toLowerCase()} className="text-gray-100">{id}</label>
      <input className="w-full p-2 my-2 text-gray-500 rounded-lg focus:outline-none bg-gray-100" type={id === "Password" ? "password" : "text"} id={id.toLowerCase()}></input>
    </>
  );

  const lorem = (
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt ex nunc, ut varius ante venenatis sed. Fusce rhoncus vulputate risus porta maximus. Vivamus bibendum nibh ac sem consectetur, a varius dolor dictum. Ut porta massa ligula, id tristique felis ultricies vel. Aenean at justo mauris. Vestibulum congue erat sed ante congue rhoncus non mattis neque. Fusce faucibus consequat faucibus. Donec non sagittis libero, eu rhoncus lectus. Ut a lectus volutpat, pretium est at, rhoncus risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nisl diam, fermentum a fermentum vitae, tincidunt ut velit. Praesent eu mattis odio, id sodales dolor. "
  );

  const shadow = (
    " absolute rounded-lg shadow-lg hover:shadow transition duration-300 ease-in-out "
  );

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <div className={"bg-gray-100 left-10 bottom-24 w-80 h-96" + shadow}></div>
      <div className={"bg-gray-100 left-5 bottom-24 w-80 h-96" + shadow}></div>
      <div className={"bg-green-200 left-0 bottom-0 w-80 h-80" + shadow}></div>
      <div className={"bg-gray-100 left-14 top-2/3 w-80 h-96" + shadow}></div>
      <div className={"bg-gray-100 left-20 top-2/3 w-80 h-96" + shadow}></div>

      <div className={"bg-green-200 inset-10 w-96 h-80" + shadow}></div>
      <div className= {"bg-gray-100 inset-5 w-96 h-80" + shadow}></div>
      <div className={"bg-gray-100 left-0 top-0 w-96 h-80" + shadow}></div>

      <div className="font-bold text-7xl w-96 text-right drop-shadow-lg text-gray-700"><div className="text-green-300">Murdoc.</div> The worse way to share docs.</div>
      <div className="bg-indigo-300 m-4 p-4 w-80 h-96 shadow-lg rounded-lg flex flex-col justify-center items-center hover:shadow transition duration-300 ease-in-out">
      <p className="font-semibold text-white text-3xl">Sign in</p>
        <form>
          {input("Username")}
          {input("Password")}
          <div className="flex justify-between">
          <button type="button" className="py-2 px-6 bg-green-200 hover:bg-green-300 rounded-lg text-gray-700 font-semibold mt-5">
            Sign in
          </button>
          <button type="button" className="py-2 px-4 shadow-lg hover:shadow rounded-lg text-white font-semibold mt-5">
            Read Docs
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}