import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { getContact } from "@/lib/data/getContact";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const contact = getContact();

  return (
    <>
      <Header nav={dict.nav} lang={locale} langLabels={dict.langue} />
      <main className="flex-1">{children}</main>
      <Footer footer={dict.footer} nav={dict.nav} contact={contact} />
    </>
  );
}
