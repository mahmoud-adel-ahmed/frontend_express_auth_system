"use client";
import { Button } from "@/components/ui/button";
import { Request } from "@/app/helpers/request";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useAppDispatch } from "@/app/store/store";
import { setUser } from "@/app/store/features/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data: { data: user },
      } = await Request.post("/users/login", formdata);
      dispatch(setUser(user));
      toast.success("Login Successful");
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // console.log(error);
        return toast.error(error.response?.data.message || "An error occurred");
      }
      toast.error("Error logging in user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 w-full h-screen flex justify-center items-center">
      <div className="flex flex-col w-[85%] sm:w-[65%] md:w-[45%] lg:w-[40%] xl:w-[30%] mx-auto bg-white p-8 rounded-lg">
        <h2 className="text-center text-3xl font-bold capitalize">logo</h2>
        <form className="w-full" onSubmit={onSubmit}>
          <div className="mt-4">
            <label
              htmlFor="email"
              className="text-sm font-bold mb-2 block capitalize"
            >
              email
            </label>
            <input
              type="email"
              name="email"
              value={formdata.email}
              onChange={handleChange}
              className="bg-gray-200 w-full rounded-lg px-4 py-2 sm:py-3 outline-none"
              placeholder="Email"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="text-sm font-bold mb-2 block capitalize"
            >
              password
            </label>
            <input
              type="password"
              name="password"
              value={formdata.password}
              onChange={handleChange}
              className="bg-gray-200 w-full rounded-lg px-4 py-2 sm:py-3 outline-none"
              placeholder="Password"
            />
          </div>
          <p className="text-right my-2 text-sm sm:text-base font-semibold block">
            
            <Link href={"/auth/forgetpassword"}>
              <span className="text-red-500 cursor-pointer capitalize">
                forget password
              </span>
            </Link>
          </p>{" "}
          <Button
            size={"lg"}
            className="w-full mt-1 capitalize text-base sm:text-lg"
          >
            {loading ? <Loader className="animate-spin" /> : "login"}
          </Button>
        </form>
        <p className="text-center mt-4 text-sm sm:text-base">
          Don&apos;t have an account ?{" "}
          <Link href={"/auth/signup"}>
            <span className="text-blue-600 cursor-pointer capitalize">
              sign up
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
