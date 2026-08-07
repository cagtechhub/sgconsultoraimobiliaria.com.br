import { Context } from "effect"
import type { ObjectStoragePort } from "./ports/object-storage.port.js"

export class ObjectStorage extends Context.Tag("@gutierres/ObjectStorage")<
  ObjectStorage,
  ObjectStoragePort
>() {}
