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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import QrCode from "react-qr-code";

const TwoFactorAuthSystemSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type TwoFactorAuthSystemSchemaType = z.infer<typeof TwoFactorAuthSystemSchema>;

const TwoFactorAuthSystem = ({ isEnabled }: { isEnabled: boolean }) => {
  const [twoFactorAuthenticationData, setTwoFactorAuthenticationData] =
    useState<{
      totpURI: string;
      backupCodes: string[];
    } | null>(null);
  const router = useRouter();
  const form = useForm<TwoFactorAuthSystemSchemaType>({
    resolver: zodResolver(TwoFactorAuthSystemSchema),
    defaultValues: {
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const handleDisable = async (data: TwoFactorAuthSystemSchemaType) => {
    try {
      await authClient.twoFactor.disable(
        {
          password: data.password,
        },
        {
          onSuccess: () => {
            toast.success("2FA disabled successfully.");
            router.refresh();
            form.reset();
          },
          onError: () => {
            toast.error("Failed to disable 2FA.");
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to disable 2FA.");
    }
  };

  const handleEnable = async (data: TwoFactorAuthSystemSchemaType) => {
    try {
      const res = await authClient.twoFactor.enable(
        {
          password: data.password,
        },
        // {
        //   onSuccess: () => {
        //     toast.success("2FA enabled successfully.");
        //     router.refresh();
        //   },
        //   onError: () => {
        //     toast.error("Failed to enable 2FA.");
        //   },
        // },
      );

      if (res.error) {
        toast.error(res.error.message || "Failed to enable 2FA.");
      } else {
        toast.success("2FA enabled successfully.");
        setTwoFactorAuthenticationData(res.data);
        router.refresh();
        form.reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to enable 2FA.");
    }
  };

  if (twoFactorAuthenticationData !== null) {
    return (
      <QrCodeVerify
        backupCodes={twoFactorAuthenticationData.backupCodes}
        totpURI={twoFactorAuthenticationData.totpURI}
        onDone={() => setTwoFactorAuthenticationData(null)}
      />
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Update Profile</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="p-6">
        <form
          onSubmit={form.handleSubmit(isEnabled ? handleDisable : handleEnable)}
          className="space-y-6"
        >
          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    placeholder="Password"
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
            variant={isEnabled ? "destructive" : "default"}
          >
            {isSubmitting && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            {isEnabled ? "Disable 2FA" : "Enable 2FA"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const qrSchema = z.object({
  token: z
    .string()
    .length(6)
    .regex(/^[0-9]+$/),
});

type qrSchema = z.infer<typeof qrSchema>;

function QrCodeVerify({
  totpURI,
  backupCodes,
  onDone,
}: {
  totpURI: string;
  backupCodes: string[];
  onDone?: () => void;
}) {
  const [successFullyEnabled, setSuccessFullyEnabled] = useState(false);
  const router = useRouter();
  const form = useForm<qrSchema>({
    resolver: zodResolver(qrSchema),
    defaultValues: {
      token: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const verifyToken = async (data: qrSchema) => {
    await authClient.twoFactor.verifyTotp(
      {
        code: data.token,
      },
      {
        onSuccess: () => {
          toast.success("Token verified successfully.");
          router.refresh();
          form.reset();
          setSuccessFullyEnabled(true);
        },
        onError: () => {
          toast.error("Failed to verify token.");
        },
      },
    );
  };

  if (successFullyEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">2FA Enabled</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="p-6">
          {backupCodes.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Backup Codes</h4>
              <div className="space-y-2 grid grid-cols-2 gap-2 mb-4">
                {backupCodes.map((code, index) => (
                  <p key={index}>{code}</p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardAction>
          <Button
            onClick={() => onDone?.()}
            className="w-full rounded-xl"
          >
            Done
          </Button>
        </CardAction>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Enable 2FA</CardTitle>
          <CardDescription>
            Scan the QR code with your authenticator app to verify.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(verifyToken)} className="space-y-6">
            <FieldGroup>
              <Controller
                name="token"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Token</FieldLabel>
                    <PasswordInput
                      {...field}
                      placeholder="Enter the token"
                      autoComplete="token"
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
              variant="destructive"
            >
              {isSubmitting && (
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Code
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="bg-white w-fit">
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
          <QrCode size={256} value={totpURI} />
        </CardContent>
      </Card>
    </div>
  );
}
export default TwoFactorAuthSystem;
