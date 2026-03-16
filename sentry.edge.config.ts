import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://dc889c8d8b2b63c5eba90e853391e28c@o4511052751175680.ingest.us.sentry.io/4511052752027648",

  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});
