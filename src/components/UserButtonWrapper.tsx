"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export default function UserButtonWrapper() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) return null;

  return (
    <div className="flex items-center">
      <UserButton />
    </div>
  );
}
