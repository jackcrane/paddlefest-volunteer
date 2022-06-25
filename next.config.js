const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = module.exports = withSentryConfig(nextConfig, {
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
