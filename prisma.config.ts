import path from "node:path"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    // Local SQLite for CLI operations (generate, db push)
    url: "file:./dev.db",
  },
})
