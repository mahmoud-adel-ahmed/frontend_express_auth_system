"use client";
import { Request } from "@/app/helpers/request";
import { setUser } from "@/app/store/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  console.log("🚀 ~ ResetPassword ~ searchParams:", email);
  const [loading, setLoading] = useState(false);
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async () => {
    if (!email || !otp || !password || !confirmPassword) return;
    setLoading(true);
    try {
      const {
        data: { data: user },
      } = await Request.post("/users/reset-password", {
        email,
        otp,
        password,
        confirmPassword,
      });
      dispatch(setUser(user));
      toast.success("Reset Password successful");
      router.push(`/auth/login`);
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

  useEffect(() => {
    // Redirect if user is verified
    if (user?.isVerified) router.replace("/"); // Redirect to home if already verified
  }, [user, router]);

  return (
    <div className="h-screen w-full justify-center items-center flex flex-col">
      <input
        type="number"
        placeholder="Enter your OTP"
        value={otp}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setOTP(e.target.value)}
        className="w-[90%] sm:w-[70%] lg:w-[35%] xl:w-[40%] block mb-4 mx-auto bg-gray-300 px-4 py-4 rounded-lg outline-none no-arrows"
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        className="w-[90%] sm:w-[70%] lg:w-[35%] xl:w-[40%] block mb-4 mx-auto bg-gray-300 px-4 py-4 rounded-lg outline-none no-arrows"
      />
      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setConfirmPassword(e.target.value)
        }
        className="w-[90%] sm:w-[70%] lg:w-[35%] xl:w-[40%] block mb-4 mx-auto bg-gray-300 px-4 py-4 rounded-lg outline-none no-arrows"
      />
      <div className="flex gap-4 items-center mt-6">
        <Button className="bg-red-500">
          <Link href={"/auth/forgetpassword"}>Go Back</Link>
        </Button>
        <Button onClick={onSubmit}>
          {loading ? <Loader className="animate-spin" /> : "Change Password"}
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
