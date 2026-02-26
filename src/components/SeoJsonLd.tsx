"use client";

type Props = {
  json: object;
};

export default function SeoJsonLd({ json }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
