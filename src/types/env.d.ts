declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    NEXTAUTH_URL: string
    NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH: string
    CLOUDFLARE_ACCOUNT_ID: string
    CLOUDFLARE_API_TOKEN: string
    NEXT_PUBLIC_GA_ID: string
    NEXTAUTH_SECRET: string
    JWT_SECRET: string
    NODE_ENV: 'development' | 'production'
    DISCORD_CLIENT_ID: string
    DISCORD_CLIENT_SECRET: string
    KAKAO_CLIENT_ID: stirng
    KAKAO_CLIENT_SECRET: stirng
    NAVER_CLIENT_ID: string
    NAVER_CLIENT_SECRET: string
    TWITTER_ID: string
    TWITTER_SECRET: string
  }
}
