import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://ai-formbuilder_owner:EL5xV2pnTAWS@ep-small-hall-a1iojzbb.ap-southeast-1.aws.neon.tech/leads?sslmode=require',
  }
});