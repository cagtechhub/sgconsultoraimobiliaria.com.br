import { Context } from "effect"
import type { ContactRepositoryPort } from "./ports/contact-repository.port.js"

export class ContactRepository extends Context.Tag("@gutierres/ContactRepository")<
  ContactRepository,
  ContactRepositoryPort
>() {}
