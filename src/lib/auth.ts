import { getServerSession } from "next-auth";
import { authOptions } from "./auth-config";

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
};

export async function getSession(): Promise<{ user: SessionUser } | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? null,
    },
  };
}
