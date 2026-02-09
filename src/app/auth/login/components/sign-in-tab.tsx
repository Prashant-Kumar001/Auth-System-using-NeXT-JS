import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInSchemaType = z.infer<typeof signInSchema>;

const SignInPage = () => {

  const router = useRouter();

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

    const {
      formState: { isSubmitting },
    } = form;

  async function onSubmit(data: SignInSchemaType) {
    await authClient.signIn.email(
      {
        ...data,
        callbackURL: "/",
      },
      {
        onError: (error) => {
          console.log(error);
          toast.error(error.error.message || "Something went wrong");
        },
        onSuccess: (account) => {
          console.log(account);
          toast.success("Account created successfully");
          form.reset();
          router.push("/");
        },
      },
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput
                {...field}
                id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button disabled={isSubmitting} type="submit" className="w-full mt-4">
       {
        isSubmitting ? (
          <Spinner />
        ) : (
          "Sign In"
        )
       }
      </Button>

    
    </form>
  );
};

export default SignInPage;
