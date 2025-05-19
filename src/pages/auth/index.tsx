import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/index.ts";

interface ApiError {
  response?: {
    data?: any;
    status?: number;
  };
  message?: string;
}

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  // Signup
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  //Login
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  const [loginErrors, setLoginErrors] = useState<string[]>([]);
  const [signupErrors, setSignupErrors] = useState<string[]>([]);
  //TODO const [isLoading, setIsLoading] = useState(false);

  const validateLogin = (): boolean => {
    const newErrors: string[] = [];

    // Reset on each submit
    setLoginErrors([]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!loginEmail || !loginPassword) {
      newErrors.push("Email and password are required");
    }

    if (loginEmail && !emailRegex.test(loginEmail)) {
      newErrors.push("Please enter a valid email address");
    }

    if (newErrors.length > 0) {
      setLoginErrors(newErrors);
      return false;
    }

    return true;
  };

  const validateSignup = (): boolean => {
    const newErrors: string[] = [];

    // Reset on each submit
    setSignupErrors([]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      newErrors.push("Email and password are required");
    }

    if (email && !emailRegex.test(email)) {
      newErrors.push("Please enter a valid email address");
    }

    if (password !== confirmPassword) {
      newErrors.push("Passwords do not match");
    }

    if (newErrors.length > 0) {
      setSignupErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          {
            email: loginEmail,
            password: loginPassword,
          },
          {
            withCredentials: true,
          }
        );

        if (response.data.user.id) {
          setUserInfo(response.data.user); // Set user info in the store
          if (response.data.user.profileSetup)
            navigate("/chat"); // If the user has a profile, redirect to chat
          else navigate("/profile");
        }

        console.log({ response });
      } catch (err: unknown) {
        const apiError = err as ApiError;

        console.error(apiError.response?.data || apiError.message);
        setLoginErrors([
          apiError.response?.data?.message || "Login failed. Please try again.",
        ]);
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 201) {
          setUserInfo(response.data.user); // Set user info in the store
          navigate("/profile");
        }

        console.log({ response });
      } catch (err: unknown) {
        const apiError = err as ApiError;

        console.error(apiError.response?.data || apiError.message);
        setSignupErrors([
          apiError.response?.data?.message ||
            "Signup failed. Please try again.",
        ]);
      }
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      {/* <div className="h-[80vh] bg-surface border-2 border-surface text-opacity-90 shadow-lg shadow-shadow w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-1"> */}
      <div className="h-[60vh] bg-surface border-2 border-surface text-opacity-90 shadow-lg shadow-shadow rounded-3xl grid xl:grid-cols-1 min-w-[30rem] min-h-[35rem]">
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
            <Tabs className="w-3/4" defaultValue="login">
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
              {/* Login Content */}
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                ></Input>
                <Input
                  placeholder="Password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                ></Input>
                {loginErrors.length > 0 && (
                  <div className="bg-surface text-red-700 p-3 rounded">
                    {loginErrors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
                <Button onClick={handleLogin}>Login</Button>
              </TabsContent>
              {/* Signup Content */}
              <TabsContent className="flex flex-col gap-5 mt-10" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Input>
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Input>
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Input>

                {signupErrors.length > 0 && (
                  <div className="bg-surface text-red-700 p-3 rounded">
                    {signupErrors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}

                <Button onClick={handleSignup}>Signup</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* <div className="hidden xl:flex justify-center items-center overflow-hidden">
          <img
            src={Background}
            alt="background"
            className="h-[650px] rounded-full"
          />
        </div> */}
      </div>
    </div>
  );
};

export default Auth;
