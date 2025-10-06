"use server";

import fetch from "node-fetch";
import FormData from "form-data";

type AdeApiResponse = {
  data?: {
    markdown?: string;
    extracted_schema?: unknown;
  };
};

// Minimal: send PDF to LandingAI ADE and return markdown (or extracted_schema if present)
export async function landingExtractMarkdown(
  fileBuffer: Buffer,
  apiKey: string
) {
  const form = new FormData();
  form.append("pdf", fileBuffer, {
    filename: "document.pdf",
    contentType: "application/pdf",
  });
  form.append("include_marginalia", "true");
  form.append("include_metadata_in_markdown", "true");
  form.append("enable_rotation_detection", "false");
  // We deliberately do NOT send fields_schema here; we'll do schema mapping in OpenAI

  const primaryEndpoint =
    process.env.LANDINGAI_ADE_URL ||
    "https://api.va.landing.ai/v1/tools/agentic-document-analysis";

  async function callEndpoint(url: string) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        ...(form as any).getHeaders?.(),
      },
      body: form as any,
    });
    return res;
  }

  const res = await callEndpoint(primaryEndpoint);
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`LandingAI ADE failed: ${res.status} ${msg}`);
  }

  const data: AdeApiResponse = (await res.json()) as AdeApiResponse;
  const markdown = data?.data?.markdown ?? "";
  const extractedSchema = data?.data?.extracted_schema;
  return { markdown, extractedSchema };
}
