"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "./Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";
import { Input } from "./Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "./Dialog";

import { useStore } from "@nanostores/react";
import { isSetupOpen } from "src/stores/setup-store";
import { Switch } from "./Switch";

const BASE_LINK = (env: "dev" | "uat" | "prod") => {
  return `https://concentrixcx.azureedge.net/${env}/react-module/gaia/index.js`;
};

const FormSchema = z.object({
  apiKey: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  cdnlink: z.string().min(2, {
    message: "CDN link must be at least 2 characters.",
  }),
  isDebug: z.boolean(),
});

export function SetupForm() {
  const $isSetupOpen = useStore(isSetupOpen);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      apiKey: "",
      cdnlink: "",
      isDebug: false,
    },
  });

  function createSessionStorage(data: z.infer<typeof FormSchema>) {
    sessionStorage.setItem("embeddedsurvey-config", JSON.stringify(data));
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createSessionStorage(data);
    window.location.href = "/embedded-survey-playground/apps";
  }

  return (
    <Dialog open={$isSetupOpen} onOpenChange={() => isSetupOpen.set(false)}>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setup</DialogTitle>
            <DialogDescription>
              This is the setup form for the application. Please fill in the
              details below to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-2"
              >
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your API key" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cdnlink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CDN LINK</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a CDN link" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={BASE_LINK("dev")}>Dev</SelectItem>
                          <SelectItem value={BASE_LINK("uat")}>UAT</SelectItem>
                          <SelectItem value={BASE_LINK("prod")}>
                            PROD
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This is CDN link for your API key.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isDebug"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Enable Debug</FormLabel>
                        <FormDescription>
                          Enable debug mode for the embedded SDK.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit">Load</Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
