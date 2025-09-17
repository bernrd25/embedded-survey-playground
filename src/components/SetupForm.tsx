import { useForm } from "react-hook-form";
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

const FormSchema = z.object({
  apiKey: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  cdnlink: z.string().min(2, {
    message: "CDN link must be at least 2 characters.",
  }),
  isDebug: z.boolean(),
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
      apiKey: "",
      cdnlink: "",
      isDebug: true,
    },
  });

  function createSessionStorage(data: z.infer<typeof FormSchema>) {
    sessionStorage.setItem("embeddedsurvey-config", JSON.stringify(data));
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createSessionStorage(data);

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
                          {typeof window !== "undefined" &&
                            window.location.hostname === "localhost" && (
                              <SelectItem value={getLocalEmbeddedAsset()}>
                                Custom (Local)
                              </SelectItem>
                            )}
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
