const Auth = () => {
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-surface border-2 border-surface text-opacity-90 shadow-2xl shadow-shadow w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col grap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              {/* Maybe todo - add a small image */}
            </div>
            <p className="font-medium text-center">
              Get started with the chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
              <ul className="flex flex-wrap -mb-px">
                <li className="me-2">
                  <a
                    href="#"
                    className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  >
                    Login
                  </a>
                </li>
                <li className="me-2">
                  <a
                    href="#"
                    className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
                    aria-current="page"
                  >
                    Signup
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
