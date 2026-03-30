export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  
  // APNs推送通知配置
  apnsKeyId: process.env.APNS_KEY_ID ?? "",
  apnsTeamId: process.env.APNS_TEAM_ID ?? "",
  apnsPrivateKey: process.env.APNS_PRIVATE_KEY ?? "",
  
  // 设备令牌数据库配置
  deviceTokenTableName: process.env.DEVICE_TOKEN_TABLE_NAME ?? "user_device_tokens",
};
