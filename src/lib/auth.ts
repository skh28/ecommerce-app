/**
 * Auth helper for API routes. Replace with getServerSession(authOptions) once NextAuth is configured.
 */
export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
};

export async function getSession(): Promise<{ user: SessionUser } | null> {
  // TODO: Replace with NextAuth getServerSession when Step 2 is implemented
  return null;
}
