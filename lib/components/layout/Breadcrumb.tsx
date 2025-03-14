import * as React from "react";

import { Link, useLocation, useParams } from "@tanstack/react-router";

import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/lib/components/ui/breadcrumb";

export const Breadcrumb = () => {
  const { pathname, search } = useLocation();
  const { userId } = useParams({ strict: false });

  const username = search?.username;
  const pathNames = pathname.split("/").filter((path) => path);

  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        {pathNames.map((link, index) => {
          const last = index === pathNames.length - 1;
          const href = `/${pathNames.slice(0, index + 1).join("/")}`;

          if (link === "dashboard") {
            return;
          }

          const displayName =
            link === userId && username
              ? String(username).charAt(0).toUpperCase() + String(username).slice(1)
              : String(link).charAt(0).toUpperCase() + String(link).slice(1);

          return last ? (
            <BreadcrumbPage key={link}>
              <h1 className="text-lg font-extrabold tracking-tight">{displayName}</h1>
            </BreadcrumbPage>
          ) : (
            <React.Fragment key={link}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={href} search={(prev) => ({ ...prev })}>
                    <h1 className="text-lg font-extrabold tracking-tight">
                      {displayName}
                    </h1>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
};
