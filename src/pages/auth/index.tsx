import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-surface border-2 border-surface text-opacity-90 shadow-lg shadow-shadow w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
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
          <div className="flex items-center justify-center w-full pt-4">
            <Tabs className="w-3/4">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent border-b-2 rounded-none w-full data-[state=active]:text-text-primary data-[state=active]:border-b-primary p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent border-b-2 rounded-none w-full data-[state=active]:text-text-primary data-[state=active]:border-b-primary p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">TEST Login</TabsContent>
              <TabsContent value="signup">Test Signup</TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
