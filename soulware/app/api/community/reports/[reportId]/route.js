import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { PeerReport } from "@/lib/models";

// DELETE a report after it has been reviewed
export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const { reportId } = await params; // Await params in Next.js 15
    const deletedReport = await PeerReport.findByIdAndDelete(reportId);

    if (!deletedReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Report dismissed successfully" });
  } catch (error) {
    console.error("Error dismissing report:", error);
    return NextResponse.json({ error: "Failed to dismiss report" }, { status: 500 });
  }
}
