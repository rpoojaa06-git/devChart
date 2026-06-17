import connectDB from "@/lib/mongodb";
import Activity from "@/models/Activity";

export async function GET() {
  await connectDB();

  const activities = await Activity.find()
    .sort({ timestamp: -1 });

  return Response.json(activities);
}