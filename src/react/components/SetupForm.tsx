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
});

export function SetupForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      apiKey: "",
      cdnlink: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
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
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
