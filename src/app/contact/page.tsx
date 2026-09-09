import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactMap from "@/components/contact/ContactMap";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import CareersBlock from "@/components/contact/CareersBlock";
import StatsBand from "@/components/contact/StatsBand";

export const metadata: Metadata = {
  title: "Contact Us | Free Framing Quote | Mannat Framing Ltd. Surrey, BC",
  description:
    "Contact Mannat Framing Ltd. in Surrey, BC. Call (778) 723-8994, email m.framing9@gmail.com, or send your project details for a free framing and construction quote within one business day.",
};

/**
 * Contact page. Section order follows the NuFrame contact page:
 * photo hero -> locations (live map in the background) -> contact information -> project form band -> careers -> stats.
 */
export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactMap />
      <ContactInfo />
      <ContactForm />
      <CareersBlock />
      <StatsBand />
    </>
  );
}
