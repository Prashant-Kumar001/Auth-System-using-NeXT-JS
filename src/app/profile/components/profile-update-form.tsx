"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

const ProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  favoriteNumber: z
    .number()
    .min(0, "Favorite number must be positive")
    .max(100, "Favorite number must be less than 100")
    .optional(),
});

type ProfileSchemaType = z.infer<typeof ProfileSchema>;

interface ProfileUpdateFormProps {
  user: {
    email: string;
    name: string | null;
    favoriteNumber?: number | null;
  };
}

const ProfileUpdateForm = ({ user }: ProfileUpdateFormProps) => {
  const router = useRouter();
  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email,
      favoriteNumber: user.favoriteNumber ?? undefined,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: ProfileSchemaType) => {
    try {
      const promises = [
        await authClient.updateUser({
          name: data.name,
          favoriteNumber: data.favoriteNumber,
        }),
      ];
      if (data.email !== user.email) {
        promises.push(
          await authClient.changeEmail(
            {
              newEmail: data.email,
              callbackURL: "/profile",
            },
            // {
            //   onError: (error) => {
            //     console.log(error);
            //     toast.error(error.error.message || "Something went wrong");
            //   },
            //   onSuccess: () => {
            //     toast.success("Profile updated successfully");
            //   },
            // },
          ),
        );
      }

      const res = await Promise.all(promises);

      const updateUserRes = res[0];
      const emailResult = res[1] ?? { error: false };

      if (updateUserRes.error) {
        toast.error(updateUserRes.error.message || "Failed to update profile");
        return;
      } else if (emailResult.error) {
        toast.error(emailResult.error.message || "Failed to update email");
        return;
      } else {
        if (data.email !== user.email) {
          toast.success(
            "Profile updated successfully. Please verify your new email.",
          );
        } else {
          toast.success("Profile updated successfully");
        }
      }

      router.refresh();
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Error updating profile:", errorMessage);
      toast.error("Something went wrong.");
    }
  };

  return (
    <Card >
      <CardHeader >
        <CardTitle className="text-2xl">Update Profile</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Enter your name"
                    autoComplete="name"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="favoriteNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Favorite Number</FieldLabel>
                  <Input
                    type="number"
                    placeholder="Enter your favorite number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full rounded-xl"
          >
            {isSubmitting && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileUpdateForm;
