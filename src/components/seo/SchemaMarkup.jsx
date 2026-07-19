import Script from 'next/script';

export function SchemaMarkup({ schema }) {
  if (!schema) return null;

  return (
    <Script
      id={`schema-${Math.random().toString(36).substring(7)}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Utility to generate LocalBusiness Schema
export function generateLocalBusinessSchema({ name, description, url, image, address, phone }) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": name,
    "description": description,
    "image": image,
    "url": url,
    "telephone": phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address?.street,
      "addressLocality": address?.city,
      "addressRegion": address?.state,
      "postalCode": address?.zip,
      "addressCountry": "IN"
    }
  };
}

// Utility to generate Course/Service Schema
export function generateServiceSchema({ name, description, providerName, providerUrl }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "provider": {
      "@type": "LocalBusiness",
      "name": providerName,
      "url": providerUrl
    }
  };
}

// Utility to generate FAQPage Schema
export function generateFaqSchema(faqs) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Utility to generate Event Schema
export function generateEventSchema(event) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "startDate": event.startDate,
    "endDate": event.endDate || event.startDate,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "Bharti Sports Arena",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Kanwarpura Chouraha, Near Prince Education Hub, Bikaner Agra Bypass Road",
        "addressLocality": "Sikar",
        "postalCode": "332001",
        "addressRegion": "Rajasthan",
        "addressCountry": "IN"
      }
    },
    "description": event.description || event.title,
  };
}
