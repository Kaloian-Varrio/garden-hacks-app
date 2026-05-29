import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/session";
import { getDashboardUsersForAdmin } from "@/lib/dashboard/queries";

export async function GET(request: Request) {
    try {
        const user = await requireApiUser();

        if (user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const data = await getDashboardUsersForAdmin();

        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
