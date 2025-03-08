import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session) {
    redirect("/");
    return null;
  }
  return <main className="">{children}</main>;
};
export default Layout;
