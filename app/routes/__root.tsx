import { type QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Scripts,
  ScriptOnce,
  HeadContent,
  createRootRouteWithContext,
} from "@tanstack/react-router";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { getUserWithOrganizations, UserWithOrganizations } from "~/server/users";

import { Toaster } from "sonner";
import appCss from "~/lib/styles/app.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user: Awaited<UserWithOrganizations>;
}>()({
  component: RootComponent,
  beforeLoad: async () => {
    const { user, organizations, activeOrganization } = await getUserWithOrganizations();

    return {
      user,
      organizations,
      activeOrganization,
    };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "rebass",
      },
      { name: "description", content: "mh ok" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
    // suppress since we're updating the "dark" class in a custom script below
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body>
        <ScriptOnce>
          {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )`}
        </ScriptOnce>

        <Toaster richColors theme={"dark"} />

        {children}

        {/* <ReactQueryDevtools buttonPosition="bottom-left" />
        <TanStackRouterDevtools position="top-left" /> */}

        <Scripts />
      </body>
    </html>
  );
}
