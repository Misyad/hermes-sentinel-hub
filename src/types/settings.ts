// Settings and configuration types

export interface NotificationSettings {
  email: boolean;
  slack: boolean;
  pagerduty: boolean;
  webhook?: string;
  channels: string[];
}

export interface IntegrationSettings {
  id: string;
  name: string;
  type: "slack" | "pagerduty" | "jira" | "github" | "datadog" | "grafana";
  enabled: boolean;
  config: Record<string, unknown>;
  lastSync?: string;
}

export interface SystemSettings {
  timezone: string;
  dateFormat: string;
  theme: "light" | "dark" | "system";
  language: string;
  notifications: NotificationSettings;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications: NotificationSettings;
}
