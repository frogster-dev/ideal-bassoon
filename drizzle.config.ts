import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "expo",
  schema: "./libs/drizzle/schema.ts",
  out: "./libs/drizzle/migrations",
});
