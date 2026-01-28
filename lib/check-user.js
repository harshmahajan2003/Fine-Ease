import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }

    const existingUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });
    if (existingUser) {
      return existingUser;
    }
    const name = `${user.firstName}${user.lastName}`;
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name,
        imageUrl: user.image,
      },
    });
    return newUser;
  } catch (error) {
    // Silence dynamic server usage errors during static generation
    // console.error("Error checking user:", error);
    return null;
    return null;
  }
};
