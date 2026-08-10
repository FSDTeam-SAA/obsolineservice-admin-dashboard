"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters."),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const ChangePasswordForm = () => {
    const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
     defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

    const { mutate, isPending } = useMutation({
    mutationKey: ["changePassword"],
    mutationFn: (values: { oldPassword: string; newPassword: string }) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Password Change successfully!");
      form.reset();
    },
  });


  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
        const payload = {
      oldPassword: values?.oldPassword,
      newPassword: values?.newPassword,
    };
    mutate(payload);
  }
  return (
    <div className='py-6 px-8 bg-white rounded-[8px] shadow-[0_4px_8px_rgba(0,0,0,0.12)]'>
       <div className="pb-2">
        <Link href="/settings" className="flex items-center gap-1 text-sm text-gray-500 font-medium transition-colors hover:text-primary hover:underline">
          <ChevronLeft /> Back to Settings
        </Link>
      </div>
      <div>
        <h4 className='text-xl md:text-2xl text-[#343A40] leading-[120%] font-semibold'>Changes Password</h4>
        <p className='text-base font-normal text-[#68706A] leading-[120%] pt-3'>Manage your account preferences, security settings, and privacy options.</p>
      </div>
      {/* form  */}
      <div className="pt-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

             <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
            {/* Current Password */}
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-[#3B4759] leading-[120%]">
                    Current Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showCurrent ? "text" : "password"}
                        placeholder="********"
                        className="h-[48px] w-full rounded-[4px] border-[#C0C3C1] p-3 placeholder:text-[#8E959F] text-[#3B4759] text-base ring-0 outline-none leading-[120%] font-normal"
                      />
                    </FormControl>
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                      onClick={() => setShowCurrent((prev) => !prev)}
                    >
                      {showCurrent ? (
                        <EyeOff size={20} className="" />
                      ) : (
                        <Eye size={20} className="" />
                      )}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-[#3B4759] leading-[120%]">
                    New Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showNew ? "text" : "password"}
                        placeholder="********"
                        className="h-[48px] w-full rounded-[4px] border-[#C0C3C1] p-3 placeholder:text-[#8E959F] text-[#3B4759] text-base ring-0 outline-none leading-[120%] font-normal"
                      />
                    </FormControl>
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                      onClick={() => setShowNew((prev) => !prev)}
                    >
                      {showNew ? (
                        <EyeOff size={20} className="" />
                      ) : (
                        <Eye size={20} className="" />
                      )}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-[#3B4759] leading-[120%]">
                    Confirm New Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showConfirm ? "text" : "password"}
                        placeholder="********"
                        className="h-[48px] w-full rounded-[4px] border-[#C0C3C1] p-3 placeholder:text-[#8E959F] text-[#3B4759] text-base ring-0 outline-none leading-[120%] font-normal"
                      />
                    </FormControl>
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                      onClick={() => setShowConfirm((prev) => !prev)}
                    >
                      {showConfirm ? (
                        <EyeOff size={20} className="" />
                      ) : (
                        <Eye size={20} className="" />
                      )}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


            
            <div className="w-full flex items-center justify-end gap-6 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="h-[47px] text-sm text-[#E5102E] leading-[120%] font-medium py-4 px-6 rounded-[6px] border border-[#E5102E]"
              >
                Discard Changes
              </Button>


              <Button disabled={isPending} className="h-[47px] text-sm text-[#F8F9FA] leading-[120%] font-medium py-4 px-6 rounded-[6px]" type="submit">{isPending ? "Sending..." : "Save Changes"}</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ChangePasswordForm