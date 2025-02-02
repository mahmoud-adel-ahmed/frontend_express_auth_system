"use client";
import { Request } from "@/app/helpers/request";
import { setUser } from "@/app/store/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  ClipboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

const Verify = () => {
  const user = useAppSelector((state) => state.auth.user);
 
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Redirect if user is verified
    if (user?.isVerified) router.replace("/"); // Redirect to home if already verified
  }, [user, router]);

  useEffect(() => {
    // Redirect if user is verified
    if (user && !user.isVerified) {
      toast.info("OTP sent otp to " + user.email);
      router.push("/auth/verify");
    } else {
      router.push("/auth/login"); // Redirect to home if not found
    }
  }, [user, router]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    // console.log("🚀 ~ handleChange ~ index:", index)
    const { value } = e.target;

    // Ensure the value is either empty or a single numeric digit
    if (value === "" || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input if a digit is entered and we are not on the last input
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      // Move to the previous input if backspacing (empty value)
      else if (!value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pastedValue = e.clipboardData.getData("Text").trim();

    // Only allow pasting of exactly 4 digits
    if (pastedValue.length === 4 && /^[0-9]{4}$/.test(pastedValue)) {
      const newOtp = [...otp];
      for (let i = 0; i < 4; i++) {
        newOtp[i] = pastedValue[i];
      }
      setOtp(newOtp);

      // Focus the last input after pasting
      inputRefs.current[3]?.focus();
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    try {
      const {
        data: { data: user },
      } = await Request.post("/users/verify", { otp: otp.join("") });
      dispatch(setUser(user));
      toast.success("Verification Successful");
      router.push("/auth/login");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // console.log(error);
        return toast.error(error.response?.data.message || "An error occurred");
      }
      toast.error("Error logging out user");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await Request.post("/users/resend-otp", { email: user?.email });
      toast.success("OTP Resend Successfully to your account");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // console.log(error);
        return toast.error(error.response?.data.message || "An error occurred");
      }
      toast.error("Error sending new OTP");
    } finally {
      setResendLoading(false);
    }
  };
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="font-semibold text-lg sm:text-2xl xl:text-3xl capitalize mb-4">
        enter your email verification here
      </h2>
      <div className="flex gap-4">
        {[0, 1, 2, 3].map((key) => (
          <input
            key={key}
            type="number"
            value={otp[key]}
            ref={(input) => {
              inputRefs.current[key] = input;
            }}
            maxLength={1}
            onChange={(e) => handleChange(key, e)}
            onPaste={(e) => handlePaste(e)} // Handle paste event here
            className="no-arrows border bg-gray-200 w-16 sm:w-20 h-16 sm:h-20 rounded-lg text-3xl font-bold text-center"
          />
        ))}
      </div>
      <div className="flex gap-4 items-center mt-6">
        <Button variant={"default"} onClick={onSubmit}>
          {loading ? <Loader className="animate-spin" /> : "Submit"}
        </Button>
        <Button className="bg-orange-500" onClick={handleResendOTP}>
          {resendLoading ? <Loader className="animate-spin" /> : "Resend OTP"}
        </Button>
      </div>
    </div>
  );
};

export default Verify;
