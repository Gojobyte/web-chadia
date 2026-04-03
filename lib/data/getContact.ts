import type { Contact } from "@/lib/types";
import contactData from "@/content/contact.json";

export function getContact(): Contact {
  return contactData as Contact;
}
