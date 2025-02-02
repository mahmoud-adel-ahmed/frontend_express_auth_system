"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useAppDispatch, useAppSelector } from "./store/store";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Request } from "./helpers/request";
import { setUser } from "./store/features/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  console.log("🚀 ~ HomePage ~ user:", user);

  const Logout = async () => {
    await Request.post("/users/logout");
    dispatch(setUser(null));
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };
  return (
    <div className="h-[8vh] sm:h-[12vh] shadow-md">
      <div className="w-[80%] mx-auto h-full flex justify-between items-center">
        <h1 className="text-xl sm:text-3xl font-bold uppercase">logo</h1>
        {!user ? (
          <Link href={"/auth/signup"}>
            <Button size={"lg"}>Register</Button>
          </Link>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <Avatar className="cursor-pointer">
                    <AvatarFallback className="font-bold uppercase bg-gray-100 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer">
                      {user?.username.split("")[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border rounded-lg p-2 shadow-lg mt-1">
                  <DropdownMenuItem
                    className="cursor-pointer !outline-0 hover:!outline-0"
                    onClick={Logout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant={"ghost"} size={"sm"}>
                {user?.isVerified ? "Verified" : "Not Verified"}
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col items-center justify-center h-[84vh] sm:h-[80vh] text-3xl sm:text-5xl font-bold">
        Home page
      </div>
    </div>
  );
};

export default HomePage;
