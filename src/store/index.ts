import { create } from "zustand";

interface ThemeState {
  theme: "theme-light" | "dark" | "system";
  setTheme: (theme: "theme-light" | "dark" | "system") => void;
}

export const useTheme = create<ThemeState>((set) => ({
  theme: "system",
  setTheme: (theme) => set({ theme }),
}));

interface SetupState {
  isSetup: boolean;
  setIsSetup: (value: boolean) => void;
}

export const useIsSetup = create<SetupState>((set) => ({
  isSetup: true,
  setIsSetup: (value: boolean) => set(() => ({ isSetup: value })),
}));

export type PageUrlRule =
  | "exact"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "notContains"
  | "notMatches";

export type UrlConfigList = {
  url: string;
  rule: PageUrlRule;
};

export type baseMode = {
  backgroundColor?: string;
  borderOptions?: {
    borderColor: string;
    borderWidth: string;
    borderRadius: string;
  };
};

export interface ImmediateInviteMode extends baseMode {
  mode: "ImmediateSurvey";
  banner?: {
    _html: string;
  };
  footerHtml?: {
    _html: string;
  };
  body?: {
    _html: string;
  };
  actions: {
    flexDirection?: "row" | "column";
    accept?: {
      backgroundColor: string;
      textColor: string;
      textColorHover: string;
      text: string;
    };
    decline?: {
      backgroundColor: string;
      textColor: string;
      textColorHover: string;
      text: string;
    };
  };
}

export interface FloatSurveyMode extends baseMode {
  mode: "FloatingSurvey";
}

export type PopupTabMode = {
  mode: "PopupTab";
};

export type EventConfig = {
  id: string;
  urls: UrlConfigList[] /*  {url: string, rules: exact | contains | startsWith | endsWith | notContains | notMatches}[]; */;
  customContainer?: string;
  displayPercentage: number;
  displayInterval?: number;
  displayIdleTime?: number;
  displayDelay: "immediate" | "idle" | "interval";
  name: string;
  trigger: "pageView" | "scrollDepth" | "click" | "exitIntent";
  cssSelector?: {
    innerHtml?: string;
    cssSelector?: string;
    name?: string;
    id?: string;
  };
  mode: "ImmediateSurvey" | "FloatingSurvey" | "PopupTab";
} & (ImmediateInviteMode | FloatSurveyMode | PopupTabMode);

export type PersonConfig = {
  id: string;
  name: string;
  email: string;
  code: string;
};

export type SurveyObj = {
  startDate: string;
  endDate: string;
  interval: number;
  intervalType: "days" | "hours" | "minutes";
  surveyId: string;
  link: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  surveyRecord: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  themeRecord: any;
};

export type Config = {
  status: string;
  scheduleDateTime: string;
  id: string;
  sessionId?: string;
  display: boolean;
  apiKey: string;
  survey: SurveyObj;
  responseStartDatetime: string;
  events: EventConfig[];
  person?: PersonConfig;
  attributes?: string;
};

interface EmbeddedInfoState {
  info: Array<Config>;
  setInfo: () => void;
}

export const useEmbeddedInfo = create<EmbeddedInfoState>((set) => ({
  info: [],
  setInfo: () =>
    set(() => {
      const temp: Array<Config> = [];
      const ls = Object.keys(localStorage);
      if (ls) {
        ls.forEach((key) => {
          const value = localStorage.getItem(key);
          if (value) {
            const JSONvalue = JSON.parse(value);

            temp.push(JSONvalue);
          }
        });
        return { info: temp };
      }
      return { info: [] };
    }),
}));
