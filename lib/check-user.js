import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
  try {
    const user = await currentUser();
    if (!user) return null;

    const loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) return loggedInUser;

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const email = user.emailAddresses?.[0]?.emailAddress;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: name || email?.split("@")[0] || "User",
        imageUrl: user.imageUrl,
        email: email || "",
      },
    });

    return newUser;
  } catch (error) {
    console.error("checkUser error:", error);
    return null;
  }
};
