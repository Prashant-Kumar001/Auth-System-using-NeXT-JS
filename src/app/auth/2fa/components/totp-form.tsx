import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const TotpFormSchema = z.object({
  code: z.string().length(6).regex(/^[0-9]+$/),
});

type TotpFormSchemaType = z.infer<typeof TotpFormSchema>;

const TotpForm = () => {
  const router = useRouter();

  const form = useForm<TotpFormSchemaType>({
    resolver: zodResolver(TotpFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: TotpFormSchemaType) {
    await authClient.twoFactor.verifyTotp(
      {
        code: data.code,
      },
      {
        onSuccess: () => {
          toast.success("Token verified successfully.");
          router.refresh();
          form.reset();
        },
        onError: (error) => {
          console.log(error);
          toast.error(error.error.message || "Something went wrong");
        },
      },
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          name="code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Code</FieldLabel>
              <Input
                {...field}
                id="code"
                type="text"
                placeholder="Enter your code"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        variant={isSubmitting ? "secondary" : "outline"}
        disabled={isSubmitting}
        type="submit"
        className="w-full mt-4"
      >
        {isSubmitting ? <Spinner /> : "Submit"}
      </Button>
    </form>
  );
};

export default TotpForm;
