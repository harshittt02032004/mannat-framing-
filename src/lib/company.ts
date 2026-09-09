/** Single source of truth for contact details used across the site. */
export const COMPANY = {
  name: "Mannat Framing Ltd.",
  tagline: "Precision framing. Built to last.",
  city: "Surrey, BC",
  address: "Surrey, British Columbia",
  region: "Serving the whole Lower Mainland",
  // Surrey city centre — replace with the exact yard/office address once confirmed.
  lat: 49.1913,
  lng: -122.849,
  phone: "(778) 723-8994",
  phoneRaw: "+17787238994",
  email: "m.framing9@gmail.com",
  // Confirm with the client — standard crew hours used as a placeholder.
  hours: "Monday – Friday, 7 AM – 5 PM",
  whatsapp: "17787238994",
} as const;

export const SERVICE_CITIES = ["Langley", "Burnaby", "Vancouver", "Coquitlam", "Delta", "Richmond", "Abbotsford", "Maple Ridge"] as const;

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${COMPANY.lat},${COMPANY.lng}`;
export const mapEmbedUrl = `https://maps.google.com/maps?q=${COMPANY.lat},${COMPANY.lng}+(${encodeURIComponent(COMPANY.name)})&hl=en&z=13&output=embed`;
