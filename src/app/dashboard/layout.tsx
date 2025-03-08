import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect("/");
    return null;
  }
  return <main className="">{children}</main>;
}
