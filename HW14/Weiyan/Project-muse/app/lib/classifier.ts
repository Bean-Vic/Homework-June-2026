import OpenAI from "openai";
import { z } from "zod";
import { cleanText, normalizeAttributes } from "./attribute-utils";
import type { ClassificationResult, StructuredAttributes } from "./types";

const modelOutputSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.union([z.array(z.string()), z.string()]).optional(),
  garment: z.union([z.array(z.string()), z.string()]).optional(),
  brand: z.union([z.array(z.string()), z.string()]).optional(),
  gender: z.union([z.array(z.string()), z.string()]).optional(),
  style: z.union([z.array(z.string()), z.string()]).optional(),
  material: z.union([z.array(z.string()), z.string()]).optional(),
  colors: z.union([z.array(z.string()), z.string()]).optional(),
  pattern: z.union([z.array(z.string()), z.string()]).optional(),
  occasion: z.union([z.array(z.string()), z.string()]).optional()
});

function classifierPrompt(imageUrl: string, userTitle?: string) {
  return `
Analyze this fashion inspiration image for a design team.
Return only valid JSON with exactly these fields:
title, description, category, garment, brand, gender, style, material, colors, pattern, occasion.

Rules:
- title: one short one-line title for the photo, no more than 8 words. If the user provided a good title, clean it up and capitalize it in title case. If the user input is more like a loose description, create a stronger title yourself.
- description: one concise natural-language note for a designer. Use reliable product or brand context when available.
- category: choose exactly one value from this fixed list and do not invent new values: Ready-to-wear, Bags and leather goods, Shoes, Accessories, Jewelry & Timepieces, Beauté, Home.
- Use category as the broad product class. Use garment as the more specific sub-category, such as blazer, shoulder bag, heeled sandal, bracelet, perfume, vase.
- garment, brand, gender, style, material, colors, pattern, occasion: arrays of short tags.
- Each tag array must contain 1 to 5 values, except brand may be empty if the brand/designer is unclear.
- Split uncertain long descriptions into small reusable tags.
- Do not put slashes or full sentences in tag values.
- Prefer values like "boho", "resort", "vacation", "linen", "coral".
- gender must use values from: women, men, kid, neutral.
- Inspect the source image URL for trustworthy brand clues in the host name, path, or asset names. For example, assets.christiandior.com strongly indicates Dior. Generic hosts like google.com, gstatic.com, pinterest.com, cdn, or image proxy domains are not clothing brands.
- If you can recognize or re-locate the product from the image or URL using your available visual/web knowledge, use brand-site/product context for brand and description. Do not invent a brand when the source is generic or uncertain.
- Do not return consumer profile, location, trend notes, or captured date.
Source image URL: ${imageUrl}
${userTitle ? `The user provided this optional title or description for context: ${userTitle}` : ""}
`;
}

export function parseModelOutput(output: string): ClassificationResult {
  const jsonText = extractJsonObject(output);
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    parsed = recoverLooseJson(jsonText);
  }

  const result = modelOutputSchema.safeParse(parsed);
  const data = result.success ? result.data : {};
  const attributes = normalizeAttributes(data as Partial<StructuredAttributes>);

  return {
    title: cleanText(data.title, "Untitled inspiration"),
    description: cleanText(data.description, "No description returned by the model."),
    attributes,
    rawOutput: output
  };
}

export async function classifyImage(imageUrl: string, userTitle?: string): Promise<ClassificationResult> {
  if (process.env.MOCK_EXTERNAL_SERVICES === "true") {
    return mockClassification(imageUrl, userTitle);
  }

  const client = new OpenAI({
    apiKey: requiredEnv("OPENAI_API_KEY"),
    baseURL: process.env.OPENAI_BASE_URL || "https://api.minimaxi.com/v1"
  });

  const response = await client.chat.completions.create({
    model: process.env.VISION_MODEL || "MiniMax-M3",
    messages: [
      {
        role: "system",
        content: "You are a precise fashion merchandising analyst."
      },
      {
        role: "user",
        content: [
          { type: "text", text: classifierPrompt(imageUrl, userTitle) },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
              detail: "default"
            }
          }
        ]
      }
    ],
    extra_body: { reasoning_split: true }
  } as never);

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Classifier returned an empty response.");
  }

  return parseModelOutput(content);
}

function extractJsonObject(output: string) {
  const withoutFence = output
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  const firstBrace = withoutFence.indexOf("{");
  const lastBrace = withoutFence.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return withoutFence.slice(firstBrace, lastBrace + 1);
  }

  return withoutFence;
}

function recoverLooseJson(value: string) {
  const lines = value.split(/\r?\n/);
  const record: Record<string, string> = {};

  for (const line of lines) {
    const match = line.match(/^\s*"?([\w\s]+)"?\s*[:=-]\s*"?(.+?)"?\s*,?\s*$/);
    if (match) {
      const key = match[1].replace(/\s+/g, "");
      record[key[0]?.toLowerCase() + key.slice(1)] = match[2];
    }
  }

  return record;
}

function mockClassification(imageUrl: string, userTitle?: string): ClassificationResult {
  const inferredBrand = /christiandior|dior/i.test(imageUrl) ? ["dior"] : [];
  const output = JSON.stringify({
    title: userTitle ? toTitleCase(userTitle) : "Denim Street Layer",
    description:
      "A streetwear-inspired denim jacket layered over a white top, with relaxed proportions and casual styling.",
    category: ["Ready-to-wear"],
    garment: ["jacket", "layer"],
    brand: inferredBrand,
    gender: ["neutral"],
    style: ["streetwear", "casual"],
    material: ["denim", "cotton"],
    colors: ["blue", "white"],
    pattern: ["solid"],
    occasion: ["casual"]
  });

  return {
    ...parseModelOutput(output),
    rawOutput: `${output}\nmockSource=${imageUrl}`
  };
}

function toTitleCase(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
