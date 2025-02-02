"use client";
import { Button } from "@/components/ui/button";
import { Request } from "@/app/helpers/request";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { useAppDispatch } from "@/app/store/store";
import { setUser } from "@/app/store/features/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [formdata, setFormdata] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      } = await Request.post("/users/signup", formdata);
      dispatch(setUser(user));
      toast.success("Signup Successful");
      router.push("/auth/verify");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // console.log(error);
        return toast.error(error.response?.data.message || "An error occurred");
      }
      toast.error("Error signing up user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 w-full h-screen flex justify-center items-center">
      <div className="flex flex-col w-[85%] sm:w-[65%] md:w-[45%] lg:w-[40%] xl:w-[30%] mx-auto bg-white p-8 rounded-lg">
        <h2 className="text-center text-3xl font-bold mb-6 capitalize">logo</h2>
        <form className="w-full" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="username"
              className="text-sm font-bold mb-2 block capitalize"
            >
              username
            </label>
            <input
              type="text"
              name="username"
              value={formdata.username}
              onChange={handleChange}
              className="bg-gray-200 w-full rounded-lg px-4 py-2 sm:py-3 outline-none"
              placeholder="Username"
            />
          </div>
          <div className="my-4">
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
          <div className="my-4">
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
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-bold mb-2 block capitalize"
            >
              confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formdata.confirmPassword}
              onChange={handleChange}
              className="bg-gray-200 w-full rounded-lg px-4 py-2 sm:py-3 outline-none"
              placeholder="Confirm Password"
            />
          </div>
          <Button
            size={"lg"}
            className="w-full mt-1 capitalize text-base sm:text-lg"
          >
            {loading ? <Loader className="animate-spin" /> : " sign up"}
          </Button>
        </form>
        <p className="text-center mt-4 text-sm sm:text-base">
          Already have an account ?{" "}
          <Link href={"/auth/login"}>
            <span className="text-blue-600 cursor-pointer capitalize">
              login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
