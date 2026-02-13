"use client";

import { Passkey } from "@better-auth/passkey";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BetterAuthAction } from "@/components/auth/BetterAuthActionButton";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const PassKeysFormSchema = z.object({
  Name: z.string().min(2, "Name must be at least 2 characters"),
});

type PassKeysSchemaType = z.infer<typeof PassKeysFormSchema>;

const Passkeys = ({ passkeys }: { passkeys: Passkey[] }) => {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<PassKeysSchemaType>({
    resolver: zodResolver(PassKeysFormSchema),
    defaultValues: {
      Name: "",
    },
    mode: "onChange",
  });

  const {
    formState: { isSubmitting, isValid },
    handleSubmit,
    reset,
  } = form;

  async function handleAddPasskey(data: PassKeysSchemaType) {
    await authClient.passkey.addPasskey(
      { name: data.Name },
      {
        onSuccess: () => {
          toast.success("Passkey added successfully.");
          reset();
          setIsDialogOpen(false);
          router.refresh();
        },
        onError: () => {
          toast.error("Failed to add passkey.");
        },
      },
    );
  }

  async function handleDeletePasskey(id: string) {
    return await authClient.passkey.deletePasskey(
      {
        id,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
        onError: () => {
          toast.error("Failed to delete passkey.");
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      {passkeys.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Passkeys</CardTitle>
            <CardDescription>You have no registered passkeys.</CardDescription>
          </CardHeader>
        </Card>
      )}
      {passkeys?.length > 0 && (
        <div className="border rounded-lg p-4 bg-muted/40">
          <p className="text-sm font-medium mb-2">Registered Passkeys</p>

          <div className="space-y-1 text-sm text-muted-foreground">
            {passkeys.map((key) => (
              <Card key={key.id}>
                <CardHeader>
                  <CardTitle>{key.name}</CardTitle>
                  <CardDescription>
                    Created {new Date(key.createdAt).toLocaleString()}
                  </CardDescription>
                  <BetterAuthAction
                    require
                    variant="destructive"
                    size="icon"
                    action={() => handleDeletePasskey(key.id)}
                    loadingText={<Spinner />}
                  >
                    <Trash2 />
                  </BetterAuthAction>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            reset();
          }
          setIsDialogOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <Button>New PassKey</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New PassKey</DialogTitle>
            <DialogDescription>
              Create a new passkey to add to your account
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(handleAddPasskey)}
            className="space-y-5 border rounded-xl p-6 shadow-sm bg-background"
          >
            <FieldGroup>
              <Controller
                name="Name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="Name">
                      Enter verification Name
                    </FieldLabel>

                    <FieldDescription>
                      Enter a new passkey for secure. passwordLess
                      authentication
                    </FieldDescription>
                    <Input
                      {...field}
                      id="Name"
                      type="text"
                      placeholder="Enter your Name"
                      autoComplete="off"
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
              type="submit"
              disabled={isSubmitting || !isValid}
              variant="default"
              className="w-full"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner />
                  Verifying...
                </div>
              ) : (
                "Add "
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Passkeys;
