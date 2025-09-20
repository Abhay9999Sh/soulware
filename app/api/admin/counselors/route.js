import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/backend';
import dbConnect from '@/lib/mongoose';
import { User, CounselorProfile } from '@/lib/models';

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
        const { displayName, email, qualification, languages, bio } = await req.json();

        const existingUsers = await clerkClient.users.getUserList({ emailAddress: [email] });
        if (existingUsers.length > 0) {
            return NextResponse.json({ error: "A user with this email already exists in Clerk." }, { status: 409 });
        }

        // --- CHANGE IS HERE: Generate and add a temporary password ---
        // This creates a strong, random password like "NewUser!Abc123"
        const temporaryPassword = `SoulwareSeed@2025`;

        const newUser = await clerkClient.users.createUser({
            emailAddress: [email],
            password: temporaryPassword, // Add the password to the request
            firstName: displayName.split(' ')[0] || displayName,
            lastName: displayName.split(' ').slice(1).join(' ') || '',
            publicMetadata: { role: 'counselor' },
        });

        const newDbUser = new User({
            clerkId: newUser.id,
            email: email,
            role: 'counselor',
            profile: { displayName: displayName }
        });
        await newDbUser.save();

        const newCounselorProfile = new CounselorProfile({
            userId: newDbUser._id,
            qualification,
            languages,
            bio,
        });
        await newCounselorProfile.save();

        // You MUST inform the user of their temporary password
        console.log(`IMPORTANT: Temporary password for ${email} is ${temporaryPassword}`);
        
        return NextResponse.json({ 
            success: true, 
            message: `Counselor ${displayName} created successfully. They must be given their temporary password.` 
        }, { status: 201 });

    } catch (error) {
        if (error.status === 422 && error.errors) {
            console.error("Clerk Validation Errors:", JSON.stringify(error.errors, null, 2));
            const errorMessage = error.errors[0]?.longMessage || "Invalid data provided.";
            return NextResponse.json({ error: errorMessage }, { status: 422 });
        }
        console.error("Error creating counselor:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}