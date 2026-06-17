import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import { NextRequest, NextResponse } from "next/server";

// ==========================================
// 1. GET: Fetch details for a single task
// ==========================================
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const task = await Task.findById(id);

        if (!task) {
            return NextResponse.json(
                { message: "Task not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(task);
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { message: "Failed to fetch task" },
            { status: 500 }
        );
    }
}

// ==========================================
// 2. PATCH: Update status for a single task
// ==========================================
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { status } = await request.json();
        const { id } = await params;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { status },
            { returnDocument: "after" }
        );

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { message: "Failed to update task" },
            { status: 500 }
        );
    }
}