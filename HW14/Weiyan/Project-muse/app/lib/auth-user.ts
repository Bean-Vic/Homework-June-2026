import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "./prisma";

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

export class UnauthorizedError extends Error {
  status = 401;

  constructor() {
    super("Authentication required.");
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const mockUserId = process.env.MOCK_AUTH_USER_ID;
  if (mockUserId) {
    const mockEmail = process.env.MOCK_AUTH_EMAIL || "test-user@example.com";
    const user = await prisma.user.upsert({
      where: { id: mockUserId },
      update: {
        name: process.env.MOCK_AUTH_NAME || "Test User",
        email: mockEmail
      },
      create: {
        id: mockUserId,
        name: process.env.MOCK_AUTH_NAME || "Test User",
        email: mockEmail
      }
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image
    };
  }

  if (process.env.MOCK_AUTH_ENABLED === "true") {
    const requestHeaders = await headers();
    const headerUserId = requestHeaders.get("x-muse-test-user-id");
    if (headerUserId) {
      const mockEmail =
        requestHeaders.get("x-muse-test-user-email") || `${headerUserId}@example.com`;
      const user = await prisma.user.upsert({
        where: { id: headerUserId },
        update: {
          name: requestHeaders.get("x-muse-test-user-name") || "Test User",
          email: mockEmail
        },
        create: {
          id: headerUserId,
          name: requestHeaders.get("x-muse-test-user-name") || "Test User",
          email: mockEmail
        }
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image
      };
    }
  }

  const session = await auth();
  const sessionUserId = session?.user?.id;
  if (!sessionUserId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUserId }
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image
  };
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}

export async function requirePageUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function claimLegacyDataForUser(userId: string) {
  const settingKey = "legacy-data-claimed";
  const existing = await prisma.appSetting.findUnique({
    where: { key: settingKey }
  });

  if (existing) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    const current = await tx.appSetting.findUnique({
      where: { key: settingKey }
    });

    if (current) {
      return;
    }

    await tx.inspirationImage.updateMany({
      data: { designerId: userId }
    });

    await tx.annotation.updateMany({
      data: { authorId: userId }
    });

    await tx.appSetting.create({
      data: {
        key: settingKey,
        value: userId
      }
    });
  });
}

export function authErrorResponse(error: unknown) {
  if (error instanceof UnauthorizedError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  return null;
}
