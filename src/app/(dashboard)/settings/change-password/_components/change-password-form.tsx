"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Check, ChevronLeft, Eye, EyeOff, X } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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
import { cn } from "@/lib/utils"

const newPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must contain an uppercase letter.")
  .regex(/[a-z]/, "Password must contain a lowercase letter.")
  .regex(/[0-9]/, "Password must contain a number.")
  .regex(/[^A-Za-z0-9\s]/, "Password must contain a special character.")
  .regex(/^\S*$/, "Password cannot contain spaces.")

const formSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required."),
    newPassword: newPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })

type ChangePasswordValues = z.infer<typeof formSchema>

interface ChangePasswordResponse {
  statusCode: number
  success: boolean
  message: string
  data: null
  responseTime: string
}

const inputClassName =
  "h-12 w-full rounded border-[#C0C3C1] px-3 pr-11 text-sm text-[#3B4759] placeholder:text-[#8E959F]"

const ChangePasswordForm = () => {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const session = useSession()
  const token = session.data?.user.accessToken

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  const newPassword = form.watch("newPassword")
  const confirmPassword = form.watch("confirmPassword")
  const passwordRules = [
    { label: "Minimum 8 characters (12+ recommended).", valid: newPassword.length >= 8 },
    { label: "At least one uppercase letter.", valid: /[A-Z]/.test(newPassword) },
    { label: "At least one lowercase letter.", valid: /[a-z]/.test(newPassword) },
    { label: "At least one number (0–9).", valid: /[0-9]/.test(newPassword) },
    { label: "At least one special character (! @ # $ % ^ & * etc.).", valid: /[^A-Za-z0-9\s]/.test(newPassword) },
    { label: "No spaces allowed.", valid: newPassword.length > 0 && /^\S*$/.test(newPassword) },
  ]

  const { mutate, isPending } = useMutation({
    mutationKey: ["change-password"],
    mutationFn: async (values: Pick<ChangePasswordValues, "oldPassword" | "newPassword">) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      })
      const result: ChangePasswordResponse = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to change password.")
      }
      return result
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password changed successfully.")
      form.reset()
      setShowCurrent(false)
      setShowNew(false)
      setShowConfirm(false)
    },
    onError: (error: Error) => toast.error(error.message || "Unable to change password."),
  })

  const onSubmit = ({ oldPassword, newPassword }: ChangePasswordValues) => {
    mutate({ oldPassword, newPassword })
  }

  return (
    <div className="min-h-[480px] rounded-[10px] bg-white p-6 shadow-[0_4px_8px_rgba(0,0,0,0.12)]">
      <Link
        href="/settings"
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-[#68706A] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Settings
      </Link>

      <h4 className="text-xl font-semibold leading-tight text-primary md:text-2xl">Changes Password</h4>
      <p className="pt-1 text-xs text-[#8E959F]">
        Manage your account preferences, security settings, and privacy options.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pt-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#3B4759]">Current Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input {...field} type={showCurrent ? "text" : "password"} placeholder="********" className={inputClassName} />
                    </FormControl>
                    <button type="button" aria-label={showCurrent ? "Hide current password" : "Show current password"} onClick={() => setShowCurrent((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68706A]">
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#3B4759]">New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input {...field} type={showNew ? "text" : "password"} placeholder="********" className={inputClassName} />
                    </FormControl>
                    <button type="button" aria-label={showNew ? "Hide new password" : "Show new password"} onClick={() => setShowNew((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68706A]">
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#3B4759]">Confirm New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showConfirm ? "text" : "password"}
                        placeholder="********"
                        className={cn(inputClassName, confirmPassword && confirmPassword !== newPassword && "border-[#FF3654] focus-visible:ring-[#FF3654]")}
                      />
                    </FormControl>
                    <button type="button" aria-label={showConfirm ? "Hide confirmed password" : "Show confirmed password"} onClick={() => setShowConfirm((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68706A]">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <ul className="mt-4 space-y-2 text-xs">
            {passwordRules.map((rule) => (
              <li key={rule.label} className={cn("flex items-center gap-2", rule.valid ? "text-primary" : "text-[#FF3654]")}>
                {rule.valid ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                {rule.label}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-end gap-4 pt-8">
            <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isPending} className="h-12 rounded-md border-[#FF3654] px-6 text-sm font-medium text-[#FF3654] hover:bg-[#FFF5F6] hover:text-[#FF3654]">
              Discard Changes
            </Button>
            <Button type="submit" disabled={isPending || !form.formState.isValid} className="h-12 rounded-md px-7 text-sm font-medium text-white">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ChangePasswordForm
