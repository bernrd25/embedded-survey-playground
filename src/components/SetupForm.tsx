import { useFieldArray, useForm } from "react-hook-form";
import { useIsSetup } from "../store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "./Dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./Select";
import { Button } from "./Button";
import { Input } from "./Input";
import { Switch } from "./Switch";
import { Plus, X } from "lucide-react";
import { ScrollArea } from "./ScrollArea";
import { toast } from "sonner";

const FormSchema = z.object({
  targetApi: z.string(),
  apiKey: z.string().min(2, {
    message: "API key must be at least 2 characters.",
  }),
  cdnlink: z.string().min(2, {
    message: "CDN link must be at least 2 characters.",
  }),
  isDebug: z.boolean(),
  targetAttributes: z
    .array(
      z.object({
        key: z.string().min(1, { message: "Key is required" }),
        value: z.string().min(1, { message: "Value is required" }),
      })
    )
    .optional(),
});

const BASE_LINK = (env: "dev" | "uat" | "prod") => {
  return `https://concentrixcx.azureedge.net/${env}/react-module/gaia/index.js`;
};

// Enhanced function to handle both development and production builds
function getLocalEmbeddedAsset() {
  if (typeof window === "undefined") {
    return "/dist/client/index.js";
  }

  const { hostname, port, pathname } = window.location;

  // Development environment (npm run dev)
  if (hostname === "localhost" && port === "5173") {
    return "/public/dist/client/index.js";
  }

  // Preview environment (npm run preview) - typically port 4173
  if (hostname === "localhost" && (port === "4173" || port === "5174")) {
    return "/dist/client/index.js";
  }

  // General localhost fallback
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    // Try preview path first, fallback to dev path
    return "/dist/client/index.js";
  }

  // Production environment (GitHub Pages or other hosting)
  // Check if we're in a subdirectory deployment (like GitHub Pages)
  const basePath = pathname.startsWith("/embedded-survey-playground")
    ? "/embedded-survey-playground"
    : "";

  // The actual built asset is in dist/dist/client/index.js
  return `${basePath}/dist/client/index.js`;
}

export default function SetupForm() {
  const { isSetup, setIsSetup } = useIsSetup();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      targetApi: "v1",
      apiKey: "",
      cdnlink: "",
      isDebug: true,
      targetAttributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "targetAttributes",
  });

  function createSessionStorage(data: z.infer<typeof FormSchema>) {
    sessionStorage.setItem("embeddedsurvey-config", JSON.stringify(data));
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Form Data:", data);
    createSessionStorage(data);
    toast("Configuration saved! Redirecting...", { duration: 2000 });

    // Redirect to path based environment
    if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== "/") {
      const basePath = import.meta.env.BASE_URL.replace(/\/$/, ""); // Remove trailing slash
      window.location.href = `${basePath}/playground`;
      return;
    }
    window.location.href = "/playground";
  }

  return (
    <Dialog open={isSetup} onOpenChange={setIsSetup}>
      <DialogPortal>
        <DialogContent className="sm:max-w-xl">
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
                <div className="grid grid-cols-[1fr_1fr] gap-4">
                  <FormField
                    control={form.control}
                    name="targetApi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target API</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Target API" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="v1">
                              Distribution API (v1)
                            </SelectItem>
                            <SelectItem value="v2">
                              Embedded Management API (v2)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the target API for your SDK.
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
                            {typeof window !== "undefined" &&
                              window.location.hostname === "localhost" && (
                                <SelectItem value={getLocalEmbeddedAsset()}>
                                  Custom (Local)
                                </SelectItem>
                              )}
                            <SelectItem value={BASE_LINK("dev")}>
                              Dev
                            </SelectItem>
                            <SelectItem value={BASE_LINK("uat")}>
                              UAT
                            </SelectItem>
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
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your API key" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your API key for the embedded SDK.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                <div className="space-y-2 w-full ">
                  <div className="flex items-center justify-between">
                    <div className="mb-2 font-medium">Target Attributes</div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ key: "", value: "" })}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Attribute
                    </Button>
                  </div>
                  {fields.length !== 0 && (
                    <ScrollArea className="h-60  space-y-2">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end  w-full border p-2 rounded-lg"
                        >
                          <FormField
                            control={form.control}
                            name={`targetAttributes.${index}.key` as const}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Attribute Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter attribute name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`targetAttributes.${index}.value` as const}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Attribute Value</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter attribute value"
                                    {...field}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => remove(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  )}
                </div>

                <Button type="submit">Load</Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
