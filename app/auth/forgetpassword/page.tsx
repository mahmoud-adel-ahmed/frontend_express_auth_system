"use client";
import { Request } from "@/app/helpers/request";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import { toast } from "sonner";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);
    try {
      await Request.post("/users/forget-password", { email });
      toast.success("Reset code sent to your account");
      router.push(`/auth/resetpassword?email=${encodeURIComponent(email)}`);
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
    <div className="h-screen w-full justify-center items-center flex flex-col">
      <h2 className="text-xl text-gray-900 mb-4 font-medium">
        Enter the email to reset your password
      </h2>
      <input
        type="email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        placeholder="Enter your Email"
        className="w-[90%] sm:w-[70%] md:w-[40%] block mb-4 mx-auto bg-gray-300 px-4 py-4 rounded-lg outline-none"
      />
      <Button onClick={onSubmit}>
        {loading ? <Loader className="animate-spin" /> : "Submit"}
      </Button>
    </div>
  );
};

export default ForgetPassword;
