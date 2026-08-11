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
import { USER_PROFILE_QUERY_KEY, UserProfileApiResponse } from "../../_components/user-data-type"
import { useMemo } from "react"
import { toast } from "sonner"
import PersonalInfoSkeleton from "../../_components/personal-info-skeleton"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).min(2, {
    message: "Email must be at least 2 characters.",
  }),
  phone: z.string().optional(),
  gender: z.enum(["male", "female"]),
  bio: z.string().optional(),
  streetAddress: z.string().optional(),
  location: z.string().optional(),
  postalCode: z.string().optional(),
})

const splitName = (name = "") => {
  const [firstName = "", ...lastNameParts] = name.trim().split(/\s+/)
  return { firstName, lastName: lastNameParts.join(" ") }
}

const splitLocation = (location = "") => {
  const parts = location.split(",").map((part) => part.trim()).filter(Boolean)
  if (parts.length < 2) return { cityState: parts[0] ?? "", country: "" }
  return { cityState: parts.slice(0, -1).join(", "), country: parts.at(-1) ?? "" }
}

const PersonalInformationForm = () => {
  const queryClient = useQueryClient();

  const { data: session } = useSession()
  const token = (session?.user as { accessToken?: string })?.accessToken

  const { data, isLoading } = useQuery<UserProfileApiResponse>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const result = await res.json()
      if (!res.ok || !result?.success) {
        throw new Error(result?.message || "Unable to fetch user profile")
      }
      return result
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: "always",
  })

  const user = data?.data
  const userName = splitName(user?.name)

  const formValues = useMemo<z.infer<typeof formSchema>>(() => ({
    firstName: userName.firstName,
    lastName: userName.lastName,
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    gender: user?.gender === "female" ? "female" : "male",
    bio: user?.bio ?? "",
    streetAddress: user?.address?.roadArea ?? "",
    location: [user?.address?.cityState, user?.address?.country].filter(Boolean).join(", "),
    postalCode: user?.address?.postalCode ?? "",
  }), [user, userName.firstName, userName.lastName])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: formValues,
  })
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (values: z.infer<typeof formSchema>): Promise<UserProfileApiResponse> => {
      const location = splitLocation(values.location)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: [values.firstName, values.lastName].filter(Boolean).join(" "),
          phone: values.phone || null,
          gender: values.gender,
          bio: values.bio ?? "",
          country: location.country,
          cityState: location.cityState,
          roadArea: values.streetAddress ?? "",
          postalCode: values.postalCode ?? "",
        })
      })
      const result: UserProfileApiResponse = await res.json()
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Unable to update user profile")
      }
      return result
    },
    onSuccess: (data) => {
      queryClient.setQueryData<UserProfileApiResponse>(USER_PROFILE_QUERY_KEY, data)
      toast.success(data?.message || "Profile updated successfully")
    },
    onError: (error: Error) => toast.error(error.message || "Update failed"),
  })

  // loading 
  if (isLoading) {
    return <div className="">
      <PersonalInfoSkeleton/>
    </div>
  }

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values)
  }

  return (
    <div className='h-full p-6 bg-white rounded-[10px] shadow-[0_4px_8px_rgba(0,0,0,0.12)]'>
      <Link
        href="/settings"
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-[#68706A] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Settings
      </Link>
      <div>
        <h4 className='text-xl md:text-2xl text-primary leading-[120%] font-semibold'>Personal Information</h4>
        <p className='text-xs font-normal text-[#8E959F] leading-[120%] pt-1'>Manage your personal information and profile details.</p>
      </div>
      {/* form  */}
      <div className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

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
                      <Input className="h-[48px] w-full rounded-[4px] border-[#C0C3C1] p-3 placeholder:text-[#8E959F] text-[#3B4759] text-base ring-0 outline-none leading-[120%] font-normal" placeholder="First name" {...field} />
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
                      <Input className="h-[48px] w-full rounded-[4px] border-[#C0C3C1] p-3 text-[#3B4759] text-base" placeholder="Last name" {...field} />
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
                name="phone"
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
                      <Input className="h-[48px] w-full rounded-[4px] border-[#C0C3C1] p-3 placeholder:text-[#8E959F] text-[#3B4759] text-base ring-0 outline-none leading-[120%] font-normal" placeholder="1234 Oak Avenue, San Francisco, CA 94102A" {...field} />
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
