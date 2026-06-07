import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

// Don't index the admin page
export const metadata = {
  robots: "noindex, nofollow",
};

export default async function SpravaPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const authed = !!token && verifyToken(token);

  return (
    <div className="min-h-screen bg-[#080808]">
      {authed ? <AdminDashboard /> : <AdminLogin />}
    </div>
  );
}
