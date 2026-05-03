import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useIsSetup } from "../store";
import {
  Dialog,
  DialogContent,
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
import {
  Clipboard,
  Eye,
  EyeOff,
  FileJson,
  Layers,
  Loader2,
  Plus,
  RotateCcw,
  SaveAll,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { ScrollArea } from "./ScrollArea";
import { Progress } from "./Progress";
import { toast } from "sonner";
import { buildShareUrl, type ShareableConfig } from "../lib/sessionShare";
const STORAGE_KEY = "setup-form-last-config";
const PROFILES_KEY = "setup-form-profiles";

type SavedProfile = { name: string; config: Record<string, unknown> };

const QA_ROUTES = [
  { label: "Playground", path: "/playground" },
  { label: "Dashboard", path: "/playground/dashboard" },
  { label: "Scroll Depth", path: "/playground/triggers/scroll-depth" },
  { label: "Click Trigger", path: "/playground/triggers/click-trigger" },
  { label: "Exit Intent", path: "/playground/triggers/exit-intent" },
  { label: "Idle Detection", path: "/playground/triggers/idle-detection" },
  { label: "Page View", path: "/playground/triggers/page-view" },
];

const ATTR_KEY_SUGGESTIONS = [
  "userId",
  "sessionId",
  "accountType",
  "region",
  "email",
  "customerId",
  "orderId",
  "planType",
  "locale",
  "role",
  "department",
  "priority",
  "tenantId",
  "agentId",
  "ticketId",
];

const FormSchema = z.object({
  targetApi: z.string(),
  apiKey: z
    .string()
    .min(8, { message: "API key must be at least 8 characters." })
    .regex(/^[A-Za-z0-9_-]+$/, {
      message:
        "API key can only contain letters, numbers, hyphens and underscores.",
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
      }),
    )
    .optional(),
});

type EnvLabel = "dev" | "uat" | "prod";
const ENV_META: Record<EnvLabel, { label: string; badge: string }> = {
  dev: {
    label: "Dev",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  uat: {
    label: "UAT",
    badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  },
  prod: {
    label: "PROD",
    badge: "bg-green-500/15 text-green-400 border-green-500/30",
  },
};

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

const presetTargetAttributes = {
  basic: [
    { key: "userId", value: "12345" },
    { key: "region", value: "us-west" },
  ],
  ecommerce: [
    { key: "customerId", value: "CUST-67890" },
    { key: "accountType", value: "premium" },
    { key: "orderCount", value: "15" },
    { key: "totalSpent", value: "2499.99" },
  ],
  support: [
    { key: "ticketId", value: "TKT-12345" },
    { key: "agentId", value: "AGT-789" },
    { key: "department", value: "technical-support" },
    { key: "priority", value: "high" },
  ],
  healthcare: [
    { key: "patientId", value: "PAT-54321" },
    { key: "providerId", value: "DOC-999" },
    { key: "appointmentType", value: "follow-up" },
    { key: "insuranceProvider", value: "Blue Cross" },
  ],
  financial: [
    { key: "accountNumber", value: "ACC-98765" },
    { key: "accountType", value: "checking" },
    { key: "branchCode", value: "BR-100" },
    { key: "relationshipManager", value: "RM-456" },
  ],
  education: [
    { key: "studentId", value: "STU-11223" },
    { key: "courseId", value: "CS-101" },
    { key: "semester", value: "Fall 2025" },
    { key: "enrollmentStatus", value: "full-time" },
  ],
};

export default function SetupForm() {
  const { isSetup, setIsSetup } = useIsSetup();
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showJsonPanel, setShowJsonPanel] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profiles, setProfiles] = useState<SavedProfile[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(PROFILES_KEY) ?? "[]");
    } catch {
      return [];
    }
  });
  const [progress, setProgress] = useState(0);
  // QA Launcher state
  const [qaMode, setQaMode] = useState<"tabs" | "windows">("tabs");
  const [qaCollapsed, setQaCollapsed] = useState(true);
  const [qaCount, setQaCount] = useState(0);
  const [qaRoute, setQaRoute] = useState(QA_ROUTES[0].path);
  const [qaWinWidth, setQaWinWidth] = useState(1280);
  const [qaWinHeight, setQaWinHeight] = useState(800);
  // Per-tab attribute overrides: array of length qaCount, each is a list of {key,value} overrides
  const [tabOverrides, setTabOverrides] = useState<
    Array<Array<{ key: string; value: string }>>
  >(() => Array.from({ length: 0 }, () => []));

  // Load last config from localStorage
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "");
    } catch {
      return null;
    }
  })();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      targetApi: saved?.targetApi ?? "v1",
      apiKey: saved?.apiKey ?? "",
      cdnlink: saved?.cdnlink ?? "",
      isDebug: saved?.isDebug ?? true,
      targetAttributes: saved?.targetAttributes ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "targetAttributes",
  });

  // Progress: track how many required fields are filled
  const watchedValues = form.watch(["apiKey", "cdnlink", "targetApi"]);
  useEffect(() => {
    const [apiKey, cdnlink, targetApi] = watchedValues;
    const filled = [apiKey, cdnlink, targetApi].filter(
      (v) => v && String(v).length > 0,
    ).length;
    setProgress(Math.round((filled / 3) * 100));
  }, [watchedValues]);

  // ⌘+Enter / Ctrl+Enter shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && isSetup) {
        form.handleSubmit(onSubmit)();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetup]);

  // Sync tabOverrides length when qaCount changes — discard extras
  useEffect(() => {
    setTabOverrides((prev) =>
      Array.from({ length: qaCount }, (_, i) => prev[i] ?? []),
    );
  }, [qaCount]);

  const selectedCdn = form.watch("cdnlink");

  // --- Profile helpers ---
  function saveProfile() {
    const name = profileName.trim();
    if (!name) {
      toast.error("Enter a profile name.");
      return;
    }
    const config = {
      targetApi: form.getValues("targetApi"),
      cdnlink: form.getValues("cdnlink"),
      isDebug: form.getValues("isDebug"),
      targetAttributes: form.getValues("targetAttributes"),
    };
    const updated = [
      ...profiles.filter((p) => p.name !== name),
      { name, config },
    ];
    setProfiles(updated);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
    setProfileName("");
    toast.success(`Profile "${name}" saved.`);
  }

  function loadProfile(name: string) {
    const p = profiles.find((x) => x.name === name);
    if (!p) return;
    const c = p.config as z.infer<typeof FormSchema>;
    form.setValue("targetApi", c.targetApi ?? "v1");
    form.setValue("cdnlink", c.cdnlink ?? "");
    form.setValue("isDebug", c.isDebug ?? true);
    form.setValue("targetAttributes", c.targetAttributes ?? []);
    toast.success(`Loaded "${name}".`);
  }

  function deleteProfile(name: string) {
    const updated = profiles.filter((p) => p.name !== name);
    setProfiles(updated);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
    toast.success(`Deleted "${name}".`);
  }

  // --- JSON import/export ---
  function importJson() {
    setJsonError("");
    try {
      const parsed = JSON.parse(jsonInput) as z.infer<typeof FormSchema>;
      if (parsed.targetApi) form.setValue("targetApi", parsed.targetApi);
      if (parsed.cdnlink) form.setValue("cdnlink", parsed.cdnlink);
      if (parsed.apiKey) form.setValue("apiKey", parsed.apiKey);
      if (typeof parsed.isDebug === "boolean")
        form.setValue("isDebug", parsed.isDebug);
      if (Array.isArray(parsed.targetAttributes))
        form.setValue("targetAttributes", parsed.targetAttributes);
      setShowJsonPanel(false);
      setJsonInput("");
      toast.success("Config imported.");
    } catch {
      setJsonError("Invalid JSON — please check and try again.");
    }
  }

  function exportJson() {
    const data = form.getValues();
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success("Config copied as JSON.");
  }

  function createSessionStorage(data: z.infer<typeof FormSchema>) {
    sessionStorage.setItem("embeddedsurvey-config", JSON.stringify(data));
  }

  function persistConfig(data: z.infer<typeof FormSchema>) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        targetApi: data.targetApi,
        cdnlink: data.cdnlink,
        isDebug: data.isDebug,
        targetAttributes: data.targetAttributes,
      }),
    );
    createSessionStorage(data);
  }

  function mergeAttrs(
    base: { key: string; value: string }[],
    overrides: { key: string; value: string }[],
  ): { key: string; value: string }[] {
    const map = new Map((base ?? []).map((a) => [a.key, a.value]));
    (overrides ?? []).forEach((o) => {
      if (o.key) map.set(o.key, o.value);
    });
    return Array.from(map.entries()).map(([key, value]) => ({ key, value }));
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    persistConfig(data);

    // Open any extra QA tabs/windows configured in Advanced Setup
    const baseAttrs = data.targetAttributes ?? [];
    let opened = 0;
    for (let i = 0; i < qaCount; i++) {
      const overrides = tabOverrides[i] ?? [];
      const hasOverrides = overrides.some((o) => o.key.trim() !== "");
      const mergedAttrs = hasOverrides
        ? mergeAttrs(baseAttrs, overrides)
        : baseAttrs;
      const tabData = { ...data, targetAttributes: mergedAttrs };
      let target: string;
      try {
        const sessionUrl = buildShareUrl(tabData as unknown as ShareableConfig);
        target = `${sessionUrl}&goto=${encodeURIComponent(qaRoute)}`;
      } catch {
        // skip this tab if URL building fails
        continue;
      }
      if (qaMode === "windows") {
        const left = 80 + i * 40;
        const top = 80 + i * 30;
        const features = `width=${qaWinWidth},height=${qaWinHeight},left=${left},top=${top},toolbar=0,menubar=0,scrollbars=1,resizable=1`;
        const win = window.open(target, `qa_win_${i}`, features);
        if (win) opened++;
      } else {
        const win = window.open(target, "_blank");
        if (win) opened++;
      }
    }

    const extraLabel = qaMode === "windows" ? "window" : "tab";
    const msg =
      opened > 0
        ? `Launching playground + ${opened} extra ${extraLabel}${opened !== 1 ? "s" : ""}…`
        : "Configuration saved! Redirecting...";
    toast(msg, { duration: 2000 });

    // Redirect current tab to playground
    if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== "/") {
      const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
      window.location.href = `${basePath}/playground`;
      return;
    }
    window.location.href = "/playground";
  }

  return (
    <Dialog open={isSetup} onOpenChange={setIsSetup}>
      <DialogPortal>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg">SDK Setup</DialogTitle>
              <span
                className={`text-xs font-medium tabular-nums transition-colors ${
                  progress === 100 ? "text-green-500" : "text-muted-foreground"
                }`}
              >
                {progress === 100 ? "✓ Ready" : `${progress}%`}
              </span>
            </div>
            <Progress
              value={progress}
              className={`h-0.5 mt-2 transition-colors ${
                progress === 100 ? "[&>div]:bg-green-500" : ""
              }`}
            />
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                {/* ── Profiles ── */}
                <div className="rounded-xl border border-border/50 bg-muted/20">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70 shrink-0">
                      Profile
                    </span>
                    <select
                      className="flex-1 min-w-0 bg-transparent text-xs text-foreground outline-none cursor-pointer"
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) loadProfile(e.target.value);
                        e.currentTarget.value = "";
                      }}
                    >
                      <option value="" disabled>
                        Load saved…
                      </option>
                      {profiles.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {profiles.length > 0 && (
                      <select
                        className="text-xs bg-transparent text-muted-foreground outline-none cursor-pointer border-l border-border/50 pl-2"
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            deleteProfile(e.target.value);
                            e.currentTarget.value = "";
                          }
                        }}
                        title="Delete a profile"
                      >
                        <option value="" disabled>
                          <Trash2 className="h-3 w-3" />
                        </option>
                        {profiles.map((p) => (
                          <option key={p.name} value={p.name}>
                            ✕ {p.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <div className="flex items-center gap-1 border-l border-border/50 pl-2">
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="Save as…"
                        className="w-24 bg-transparent text-xs outline-none placeholder:text-muted-foreground/40"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveProfile();
                          }
                        }}
                      />
                      <button
                        type="button"
                        title="Save profile"
                        onClick={saveProfile}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <SaveAll className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* ── 2-col: left = config + attrs | right = Advanced Setup ── */}
                <div
                  className={`grid gap-4 items-start transition-all duration-200 ${qaCollapsed ? "grid-cols-[1fr_auto]" : "grid-cols-2"}`}
                >
                  <div className="space-y-4">
                    {/* ── SDK Config ── */}
                    <div className="rounded-xl border border-border/50 p-4 space-y-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                        SDK Configuration
                      </p>
                      <div className="grid grid-cols-2 gap-4">
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
                              <div className="flex items-center justify-between">
                                <FormLabel>Environment</FormLabel>
                                <button
                                  type="button"
                                  onClick={() => setShowJsonPanel((v) => !v)}
                                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                                  title="Import / Export JSON"
                                >
                                  <FileJson className="h-3.5 w-3.5" />
                                  JSON
                                </button>
                              </div>
                              {/* Env pill buttons */}
                              <div className="flex gap-2 flex-wrap">
                                {typeof window !== "undefined" &&
                                  window.location.hostname === "localhost" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        field.onChange(getLocalEmbeddedAsset())
                                      }
                                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                                        field.value === getLocalEmbeddedAsset()
                                          ? "bg-purple-500/20 text-purple-400 border-purple-500/50 ring-1 ring-purple-500/30"
                                          : "border-border/60 text-muted-foreground hover:border-purple-500/40 hover:text-purple-400"
                                      }`}
                                    >
                                      LOCAL
                                    </button>
                                  )}
                                {(["dev", "uat", "prod"] as EnvLabel[]).map(
                                  (env) => (
                                    <button
                                      key={env}
                                      type="button"
                                      onClick={() =>
                                        field.onChange(BASE_LINK(env))
                                      }
                                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                                        field.value === BASE_LINK(env)
                                          ? `${ENV_META[env].badge} ring-1 ring-current/30`
                                          : "border-border/60 text-muted-foreground hover:border-current/40"
                                      }`}
                                    >
                                      {ENV_META[env].label}
                                    </button>
                                  ),
                                )}
                              </div>
                              {selectedCdn && (
                                <p
                                  className="text-[10px] text-muted-foreground font-mono truncate"
                                  title={selectedCdn}
                                >
                                  {selectedCdn}
                                </p>
                              )}
                              {/* JSON import/export panel */}
                              {showJsonPanel && (
                                <div className="mt-2 space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium">
                                      Import / Export JSON
                                    </span>
                                    <button
                                      type="button"
                                      onClick={exportJson}
                                      className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                                    >
                                      <Clipboard className="h-3 w-3" /> Export
                                      current
                                    </button>
                                  </div>
                                  <textarea
                                    rows={4}
                                    value={jsonInput}
                                    onChange={(e) => {
                                      setJsonInput(e.target.value);
                                      setJsonError("");
                                    }}
                                    placeholder='{ "apiKey": "…", "cdnlink": "…" }'
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                                  />
                                  {jsonError && (
                                    <p className="text-[10px] text-destructive">
                                      {jsonError}
                                    </p>
                                  )}
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={importJson}
                                      className="h-7 text-xs"
                                    >
                                      Import
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setShowJsonPanel(false);
                                        setJsonInput("");
                                        setJsonError("");
                                      }}
                                      className="h-7 text-xs"
                                    >
                                      <RotateCcw className="h-3 w-3 mr-1" />{" "}
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              )}
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
                                <div className="relative flex items-center gap-1">
                                  <Input
                                    placeholder="Enter your API key"
                                    type={showApiKey ? "text" : "password"}
                                    className="pr-16"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => setShowApiKey((v) => !v)}
                                    className="absolute right-8 text-muted-foreground hover:text-foreground transition-colors"
                                    title={showApiKey ? "Hide key" : "Show key"}
                                  >
                                    {showApiKey ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={async () => {
                                      try {
                                        const text =
                                          await navigator.clipboard.readText();
                                        field.onChange(text.trim());
                                        toast.success("Pasted from clipboard");
                                      } catch {
                                        toast.error("Clipboard access denied");
                                      }
                                    }}
                                    className="absolute right-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                    title="Paste from clipboard"
                                  >
                                    <Clipboard className="h-4 w-4" />
                                  </button>
                                </div>
                              </FormControl>
                              <FormDescription>
                                Your API key for the embedded SDK.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* ── Debug ── */}
                    <FormField
                      control={form.control}
                      name="isDebug"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border/50 px-4 py-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm">
                              Enable Debug Mode
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Enables verbose SDK logging in the console.
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
                    {/* ── Target Attributes ── */}
                    <div className="rounded-xl border border-border/50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                          Target Attributes
                        </p>
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(value) => {
                              if (value === "clear") {
                                // Clear all attributes
                                form.setValue("targetAttributes", []);
                                return;
                              }
                              // Load preset
                              const preset =
                                presetTargetAttributes[
                                  value as keyof typeof presetTargetAttributes
                                ];
                              if (preset) {
                                form.setValue("targetAttributes", [...preset]);
                              }
                            }}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Load Preset" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">Basic User</SelectItem>
                              <SelectItem value="ecommerce">
                                E-Commerce
                              </SelectItem>
                              <SelectItem value="support">
                                Customer Support
                              </SelectItem>
                              <SelectItem value="healthcare">
                                Healthcare
                              </SelectItem>
                              <SelectItem value="financial">
                                Financial
                              </SelectItem>
                              <SelectItem value="education">
                                Education
                              </SelectItem>
                              <SelectItem value="clear">Clear All</SelectItem>
                            </SelectContent>
                          </Select>
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
                      </div>
                      {fields.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/50 py-5 text-muted-foreground">
                          <Tags className="h-5 w-5 opacity-30" />
                          <p className="text-xs">
                            No attributes — add one or load a preset
                          </p>
                        </div>
                      )}
                      {fields.length !== 0 && (
                        <ScrollArea className="max-h-48">
                          <div className="space-y-1.5 pr-1">
                            <datalist id="attr-key-suggestions">
                              {ATTR_KEY_SUGGESTIONS.map((s) => (
                                <option key={s} value={s} />
                              ))}
                            </datalist>
                            {fields.map((field, index) => (
                              <div
                                key={field.id}
                                className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center bg-muted/20 rounded-lg px-2 py-1.5 border border-border/40"
                              >
                                <FormField
                                  control={form.control}
                                  name={
                                    `targetAttributes.${index}.key` as const
                                  }
                                  render={({ field }) => (
                                    <FormItem className="space-y-0">
                                      <FormControl>
                                        <Input
                                          placeholder="key"
                                          list="attr-key-suggestions"
                                          className="h-7 text-xs bg-transparent border-0 shadow-none focus-visible:ring-0 px-1"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage className="text-[10px]" />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={
                                    `targetAttributes.${index}.value` as const
                                  }
                                  render={({ field }) => (
                                    <FormItem className="space-y-0">
                                      <FormControl>
                                        <Input
                                          placeholder="value"
                                          className="h-7 text-xs bg-transparent border-0 shadow-none focus-visible:ring-0 px-1"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage className="text-[10px]" />
                                    </FormItem>
                                  )}
                                />
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  </div>
                  {/* ── RIGHT: Advanced Setup ── */}
                  <div className="rounded-xl border border-border/50 overflow-hidden h-full">
                    {qaCollapsed ? (
                      /* Collapsed: vertical strip */
                      <button
                        type="button"
                        onClick={() => setQaCollapsed(false)}
                        className="flex flex-col items-center justify-center gap-2 w-full h-full min-h-[120px] px-2 py-4 bg-muted/20 hover:bg-muted/40 transition-colors"
                        title="Expand Advanced Setup"
                      >
                        <Layers className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                        <span
                          className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 whitespace-nowrap"
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                          }}
                        >
                          Advanced Setup
                        </span>
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setQaCollapsed(true)}
                          className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-muted/20 border-b border-border/50 hover:bg-muted/40 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Layers className="h-3.5 w-3.5 text-muted-foreground/70" />
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                              Advanced Setup
                            </span>
                          </span>
                          <span className="text-muted-foreground/40 text-base leading-none">
                            ⌄
                          </span>
                        </button>
                        <div className="px-4 pb-4 pt-3 space-y-3">
                          {/* Mode */}
                          <div className="flex rounded-lg border border-border overflow-hidden">
                            {(["tabs", "windows"] as const).map(
                              (m) => (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => setQaMode(m)}
                                  className={`flex-1 py-1.5 text-xs font-medium capitalize transition-colors ${
                                    qaMode === m
                                      ? "bg-primary text-primary-foreground"
                                      : "text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {m}
                                </button>
                              ),
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            {qaMode === "tabs" &&
                              "New tabs with config isolated via URL params — no shared storage between instances. Same browser profile."}
                            {qaMode === "windows" &&
                              "Resizable popup windows with config isolated via URL params — no shared storage between instances. Same browser profile."}
                          </p>
                          <p className="text-[10px] text-muted-foreground/50 leading-relaxed">
                            For full browser isolation (extensions, cookies), open manually in a private window.
                          </p>

                          {/* Window size presets */}
                          {qaMode === "windows" && (
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-xs font-medium">
                                    Width (px)
                                  </label>
                                  <input
                                    type="number"
                                    min={400}
                                    max={3840}
                                    value={qaWinWidth}
                                    onChange={(e) =>
                                      setQaWinWidth(Number(e.target.value))
                                    }
                                    className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-medium">
                                    Height (px)
                                  </label>
                                  <input
                                    type="number"
                                    min={300}
                                    max={2160}
                                    value={qaWinHeight}
                                    onChange={(e) =>
                                      setQaWinHeight(Number(e.target.value))
                                    }
                                    className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-1 flex-wrap">
                                {[
                                  { label: "Mobile", w: 390, h: 844 },
                                  { label: "Tablet", w: 768, h: 1024 },
                                  { label: "Desktop", w: 1280, h: 800 },
                                  { label: "Wide", w: 1920, h: 1080 },
                                ].map((p) => (
                                  <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => {
                                      setQaWinWidth(p.w);
                                      setQaWinHeight(p.h);
                                    }}
                                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                                      qaWinWidth === p.w && qaWinHeight === p.h
                                        ? "bg-primary/20 text-primary border-primary/40"
                                        : "border-border text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    {p.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Route + Count */}
                          <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                            <div className="space-y-1">
                              <label className="text-xs font-medium">
                                Target page
                              </label>
                              <select
                                value={qaRoute}
                                onChange={(e) => setQaRoute(e.target.value)}
                                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                              >
                                {QA_ROUTES.map((r) => (
                                  <option key={r.path} value={r.path}>
                                    {r.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1 text-center">
                              <label className="text-xs font-medium block">
                                {qaMode === "windows" ? "Windows" : "Tabs"}
                              </label>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setQaCount((c) => Math.max(1, c - 1))
                                  }
                                  className="h-6 w-6 rounded-md border border-border flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  −
                                </button>
                                <span className="w-6 text-center text-sm font-bold">
                                  {qaCount}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setQaCount((c) =>
                                      Math.min(
                                        qaMode === "windows" ? 6 : 10,
                                        c + 1,
                                      ),
                                    )
                                  }
                                  className="h-6 w-6 rounded-md border border-border flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Per-tab attribute overrides */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-medium">
                                Per-tab overrides
                              </p>
                              <span className="text-[10px] text-muted-foreground">
                                merges with base attributes
                              </span>
                            </div>
                            <datalist id="qa-attr-key-suggestions">
                              {ATTR_KEY_SUGGESTIONS.map((s) => (
                                <option key={s} value={s} />
                              ))}
                              {(form.getValues("targetAttributes") ?? []).map(
                                (a) =>
                                  a.key && (
                                    <option
                                      key={`base-${a.key}`}
                                      value={a.key}
                                    />
                                  ),
                              )}
                            </datalist>
                            {Array.from({ length: qaCount }, (_, i) => {
                              const overrides = tabOverrides[i] ?? [];
                              const hasOverrides = overrides.some(
                                (o) => o.key.trim() !== "",
                              );
                              return (
                                <div
                                  key={i}
                                  className="rounded-lg border border-border/50 overflow-hidden"
                                >
                                  <div className="flex items-center justify-between px-3 py-2 bg-muted/20">
                                    <span className="text-xs font-medium flex items-center gap-1.5">
                                      {qaMode === "windows" ? "Window" : "Tab"}{" "}
                                      {i + 1}
                                      {hasOverrides && (
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                                      )}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setTabOverrides((prev) => {
                                          const next = prev.map((tab) => [
                                            ...tab,
                                          ]);
                                          next[i] = [
                                            ...next[i],
                                            { key: "", value: "" },
                                          ];
                                          return next;
                                        })
                                      }
                                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      <Plus className="h-3 w-3" /> add override
                                    </button>
                                  </div>
                                  {overrides.length === 0 ? (
                                    <p className="text-[10px] text-muted-foreground/50 px-3 py-2">
                                      Inherits base attributes
                                    </p>
                                  ) : (
                                    <div className="px-3 py-2 space-y-1.5">
                                      {overrides.map((attr, j) => (
                                        <div
                                          key={j}
                                          className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
                                        >
                                          <input
                                            placeholder="key"
                                            value={attr.key}
                                            list="qa-attr-key-suggestions"
                                            onChange={(e) =>
                                              setTabOverrides((prev) => {
                                                const next = prev.map((tab) => [
                                                  ...tab,
                                                ]);
                                                next[i][j] = {
                                                  ...next[i][j],
                                                  key: e.target.value,
                                                };
                                                return next;
                                              })
                                            }
                                            className="h-7 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                                          />
                                          <input
                                            placeholder="value"
                                            value={attr.value}
                                            onChange={(e) =>
                                              setTabOverrides((prev) => {
                                                const next = prev.map((tab) => [
                                                  ...tab,
                                                ]);
                                                next[i][j] = {
                                                  ...next[i][j],
                                                  value: e.target.value,
                                                };
                                                return next;
                                              })
                                            }
                                            className="h-7 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                                          />
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setTabOverrides((prev) => {
                                                const next = prev.map((tab) => [
                                                  ...tab,
                                                ]);
                                                next[i] = next[i].filter(
                                                  (_, k) => k !== j,
                                                );
                                                return next;
                                              })
                                            }
                                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                          >
                                            <X className="h-3.5 w-3.5" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ── Actions ── */}
                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      {isLoading
                        ? "Loading…"
                        : qaCount > 0
                          ? `Launch Playground + ${qaCount} extra ${qaMode === "windows" ? `window${qaCount !== 1 ? "s" : ""}` : `tab${qaCount !== 1 ? "s" : ""}`}`
                          : "Launch Playground"}
                      {!isLoading && (
                        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-primary-foreground/20 bg-primary-foreground/10 px-1.5 text-[10px] font-medium">
                          ⌘⏎
                        </kbd>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
