import { PrismaPg } from "@prisma/adapter-pg"
import { Context, Effect, Layer } from "effect"
import pg from "pg"
import { PrismaClient } from "./output/client.js"

export class PrismaService extends Context.Tag("@gutierres/PrismaService")<
  PrismaService,
  PrismaClient
>() {}

const resolveSchema = (databaseUrl: string) => {
  try {
    const url = new URL(databaseUrl)
    return url.searchParams.get("schema") ?? "gutierres"
  } catch {
    return "gutierres"
  }
}

export const PrismaLayer = Layer.scoped(
  PrismaService,
  Effect.acquireRelease(
    Effect.sync(() => {
      const connectionString = `${process.env.DATABASE_URL}`
      const schema = resolveSchema(connectionString)
      const pool = new pg.Pool({ connectionString })
      pool.on("connect", (client) => {
        void client.query(`SET search_path TO "${schema}", public`)
      })
      const adapter = new PrismaPg(pool)
      return new PrismaClient({ adapter })
    }),
    (prisma) => Effect.promise(() => prisma.$disconnect())
  )
)
