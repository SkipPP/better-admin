import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
  baseURL: import.meta.env.BETTER_AUTH_BASE_URL,
  plugins: [adminClient()],
});

export default authClient;
