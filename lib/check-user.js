import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const email = user.emailAddresses?.[0]?.emailAddress;

    if (!email) return null;
    
    // Use upsert to handle concurrent creation safely
    const newUser = await db.user.upsert({
      where: {
        clerkUserId: user.id,
      },
      update: {
        name: name || email.split("@")[0],
        imageUrl: user.imageUrl || user.hasImage ? user.imageUrl : null,
        email: email,
      },
      create: {
        clerkUserId: user.id,
        email: email,
        name: name || email.split("@")[0],
        imageUrl: user.imageUrl || user.hasImage ? user.imageUrl : null,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error checking user:", error);
    return null;
  }
};
