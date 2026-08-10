"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UserProfileApiResponse } from "../../_components/user-data-type"
import { useEffect } from "react"
import { toast } from "sonner"
import PersonalInfoSkeleton from "../../_components/personal-info-skeleton"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).min(2, {
    message: "Email must be at least 2 characters.",
  }),
  phoneNumber: z.string().min(2, {
    message: "Phone Number must be at least 2 characters.",
  }),
  gender: z.enum(["male", "female"]).optional(),
  bio: z.string().optional(),
  streetAddress: z.string().min(2, {
    message: "Street Address must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  postalCode: z.string().min(2, {
    message: "Postal Code must be at least 2 characters.",
  })
})

const PersonalInformationForm = () => {
  const queryClient = useQueryClient();

  const { data: session } = useSession()
  const token = (session?.user as { accessToken?: string })?.accessToken

  const { data, isLoading } = useQuery<UserProfileApiResponse>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      return res.json()
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  })

  const user = data?.data

  console.log(data)






  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      gender: "male",
      bio: "",
      streetAddress: "",
      location: "",
      postalCode: "",

    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        gender: user.gender ?? "male",
        bio: user.bio ?? "",
        streetAddress: user.streetAddress ?? "",
        location: user.location ?? "",
        postalCode: user.postalCode ?? "",
      })
    }
  }, [user, form])






  const { mutate, isPending } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(values)
      })
      return res.json()
    },
    onSuccess: async (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong")
        return
      }
      toast.success(data?.message || "Profile updated successfully")
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] })
    },
    onError: () => toast.error("Update failed"),
  })

  // loading 
  if (isLoading) {
    return <div className="">
      <PersonalInfoSkeleton/>
    </div>
  }

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    mutate(values)
  }

  return (
    <div className='h-full py-6 px-8 bg-white rounded-[8px] shadow-[0_4px_8px_rgba(0,0,0,0.12)]'>
       <div className="pb-2">
        <Link href="/settings" className="flex items-center gap-1 text-sm text-gray-500 font-medium transition-colors hover:text-primary hover:underline">
          <ChevronLeft /> Back to Settings
        </Link>
      </div>
      <div>
        <h4 className='text-xl md:text-2xl text-[#343A40] leading-[120%] font-semibold'>Personal Information</h4>
        <p className='text-base font-normal text-[#68706A] leading-[120%] pt-3'>Manage your personal information and profile details.</p>
      </div>
      {/* form  */}
      <div className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

            <div className="grid gap-6 md:grid-cols-[max-content_minmax(0,1fr)] items-center">

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-base text-[#3B4759] leading-[120%] font-medium">
                      Gender
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-4">
                        <label className="inline-flex items-center gap-2 text-sm text-[#3B4759]">
                          <input
                            type="radio"
                            value="male"
                            checked={field.value === "male"}
                            onChange={() => field.onChange("male")}
                            className="h-4 w-4 rounded border-[#C0C3C1] text-primary focus:ring-primary"
                          />
                          Male
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm text-[#3B4759]">
                          <input
                            type="radio"
                            value="female"
                            checked={field.value === "female"}
                            onChange={() => field.onChange("female")}
                            className="h-4 w-4 rounded border-[#C0C3C1] text-primary focus:ring-primary"
                          />
                          Female
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#3B4759] leading-[120%] font-medium">First Name</FormLabel>
                    <FormControl>
                      <Input className="h-[48px] w-full rounded-[4px] border-[#C0C3C1] p-3 placeholder:text-[#8E959F] text-[#3B4759] text-base ring-0 outline-none leading-[120%] font-normal" placeholder="Maria Jasmin" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#3B4759] leading-[120%] font-medium">Last Name</FormLabel>
                    <FormControl>
                      <Input className="h-[48px] w-full rounded-[4px] border-[#C0C3C1] p-3 placeholder:text-[#8E959F] text-[#3B4759] text-base ring-0 outline-none leading-[120%] font-normal" placeholder="Maria Jasmin" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#3B4759] leading-[120%] font-medium">Email Address</FormLabel>
                    <FormControl>
                      <Input disabled className="h-[48px] w-full rounded-[4px] border-[#C0C3C1] p-3 placeholder:text-[#8E959F] text-[#3B4759] text-base ring-0 outline-none leading-[120%] font-normal" placeholder="bessieedwards@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#3B4759] leading-[120%] font-medium">Phone Number</FormLabel>
                    <FormControl>
                      <Input className="h-[48px] w-full rounded-[4px] border-[#C0C3C1] p-3 placeholder:text-[#8E959F] text-[#3B4759] text-base ring-0 outline-none leading-[120%] font-normal" placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

            </div>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#3B4759] leading-[120%] font-medium">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-[100px] w-full rounded-[4px] border-[#C0C3C1] p-3 placeholder:text-[#8E959F] text-[#3B4759] text-base ring-0 outline-none leading-[120%] font-normal"
                        placeholder="Write a short bio"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1">
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#3B4759] leading-[120%] font-medium">Street Address</FormLabel>
                    <FormControl>
                      <Input className="h-[48px] w-full rounded-[4px] border-[#C0C3C1] p-3 placeholder:text-[#8E959F] text-[#3B4759] text-base ring-0 outline-none leading-[120%] font-normal" placeholder="1234 Oak Avenue, San Francisco, CA 94102" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#3B4759] leading-[120%] font-medium">Location</FormLabel>
                    <FormControl>
                      <Input className="h-[48px] w-full rounded-[4px] border-[#C0C3C1] p-3 placeholder:text-[#8E959F] text-[#3B4759] text-base ring-0 outline-none leading-[120%] font-normal" placeholder="Florida, USA" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#3B4759] leading-[120%] font-medium">Postal Code</FormLabel>
                    <FormControl>
                      <Input className="h-[48px] w-full rounded-[4px] border-[#C0C3C1] p-3 placeholder:text-[#8E959F] text-[#3B4759] text-base ring-0 outline-none leading-[120%] font-normal" placeholder="30301" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
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


              <Button disabled={isPending} className="h-[47px] text-sm text-[#F8F9FA] leading-[120%] font-medium py-4 px-6 rounded-[6px]" type="submit">{isPending ? "Updating..." : "Save Changes"}</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default PersonalInformationForm