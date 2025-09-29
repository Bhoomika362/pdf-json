// import { getUser } from '@/lib/db/queries';

// export async function GET() {
//   const user = await getUser();
//   return Response.json(user);
// }

import { getUser } from "@/lib/db/queries";

export async function GET() {
  const user = await getUser();

  if (!user) {
    return Response.json(null);
  }

  // Convert Mongoose document to plain object
  const userObject = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };

  return Response.json(userObject);
}
