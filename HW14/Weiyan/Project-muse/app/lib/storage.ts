import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

export type UploadInput = {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  userId?: string;
};

export type UploadResult = {
  publicUrl: string;
  storageKey: string;
};

export async function uploadImageToStorage(input: UploadInput): Promise<UploadResult> {
  const prefix = input.userId ? `${sanitizePathSegment(input.userId)}/` : "uploads/";
  const storageKey = `${prefix}${randomUUID()}-${sanitizeFileName(input.fileName)}`;

  if (process.env.MOCK_EXTERNAL_SERVICES === "true") {
    return {
      storageKey,
      publicUrl: `data:${input.mimeType};base64,${input.buffer.toString("base64")}`
    };
  }

  const supabaseUrl = requiredEnv("SUPABASE_URL");
  const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const bucket = requiredEnv("SUPABASE_BUCKET");
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  const { error } = await supabase.storage.from(bucket).upload(storageKey, input.buffer, {
    contentType: input.mimeType,
    upsert: false
  });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storageKey);

  return {
    storageKey,
    publicUrl: data.publicUrl
  };
}

export async function deleteImageFromStorage(storageKey: string) {
  if (process.env.MOCK_EXTERNAL_SERVICES === "true") {
    return;
  }

  const supabaseUrl = requiredEnv("SUPABASE_URL");
  const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const bucket = requiredEnv("SUPABASE_BUCKET");
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  const { error } = await supabase.storage.from(bucket).remove([storageKey]);

  if (error) {
    throw new Error(`Supabase delete failed: ${error.message}`);
  }
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "image";
}

function sanitizePathSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "user";
}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
