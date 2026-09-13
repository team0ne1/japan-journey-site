// Runtime secrets and dashboard settings intentionally have no checked-in values.
type AppEnv = Env & {
  APP_ORIGIN?: string;
  AUTH_SECRET?: string;
  SETUP_SECRET?: string;
  ADMIN_RECOVERY_ENABLED?: string;
  GOOGLE_MAPS_BROWSER_KEY?: string;
  GOOGLE_MAPS_MAP_ID?: string;
}
