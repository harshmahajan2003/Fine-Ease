import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    
    // Use upsert to handle concurrent creation safely
    const newUser = await db.user.upsert({
      where: {
        clerkUserId: user.id,
      },
      update: {
        name: name || user.emailAddresses[0].emailAddress.split("@")[0],
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
      create: {
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: name || user.emailAddresses[0].emailAddress.split("@")[0],
        imageUrl: user.imageUrl,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error checking user:", error);
    return null;
  }
};
