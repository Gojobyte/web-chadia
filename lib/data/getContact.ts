import type { Contact } from "@/lib/types";
import contactData from "@/content/contact.json";

const API_URL = process.env.BACKEND_URL ?? "https://web-chadia-backend-production.up.railway.app";

export async function getContact(): Promise<Contact> {
  try {
    const res = await fetch(`${API_URL}/api/public/contact`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return data as Contact;
  } catch {
    return contactData as Contact;
  }
}
