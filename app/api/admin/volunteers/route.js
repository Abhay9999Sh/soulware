import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/backend';
import dbConnect from '@/lib/mongoose';
// Import the VolunteerProfile model
import { User, VolunteerProfile } from '@/lib/models';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function isAdmin(clerkId) {
    if (!clerkId) return false;
    await dbConnect();
    const adminUser = await User.findOne({ clerkId });
    return adminUser && adminUser.role === 'admin';
}

export async function POST(req) {
    const { userId: adminClerkId } = await auth();

    if (!await isAdmin(adminClerkId)) {
        return NextResponse.json({ error: "Forbidden: Access is denied." }, { status: 403 });
    }

    try {
        // Destructure volunteer-specific fields from the request
        const { displayName, email, areas } = await req.json();

        const existingUsers = await clerkClient.users.getUserList({ emailAddress: [email] });
        if (existingUsers.length > 0) {
            return NextResponse.json({ error: "A user with this email already exists in Clerk." }, { status: 409 });
        }
        
        // Use the same temporary password method
        const temporaryPassword = `SoulwareSeed@2025`;

        const newUser = await clerkClient.users.createUser({
            emailAddress: [email],
            password: temporaryPassword,
            firstName: displayName.split(' ')[0] || displayName,
            lastName: displayName.split(' ').slice(1).join(' ') || '',
            // Set the role to 'volunteer' in Clerk's metadata
            publicMetadata: { role: 'volunteer' },
        });

        // Create the user record in your database with the 'volunteer' role
        const newDbUser = new User({
            clerkId: newUser.id,
            email: email,
            role: 'volunteer',
            profile: { displayName: displayName }
        });
        await newDbUser.save();

        // Create the corresponding volunteer profile
        const newVolunteerProfile = new VolunteerProfile({
            userId: newDbUser._id,
            areas: areas, // Use the 'areas' field from the request
        });
        await newVolunteerProfile.save();
        
        console.log(`IMPORTANT: Temporary password for ${email} is ${temporaryPassword}`);
        
        return NextResponse.json({ 
            success: true, 
            message: `Volunteer ${displayName} created successfully. They must be given their temporary password.` 
        }, { status: 201 });

    } catch (error) {
        if (error.status === 422 && error.errors) {
            console.error("Clerk Validation Errors:", JSON.stringify(error.errors, null, 2));
            const errorMessage = error.errors[0]?.longMessage || "Invalid data provided.";
            return NextResponse.json({ error: errorMessage }, { status: 422 });
        }
        console.error("Error creating volunteer:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}