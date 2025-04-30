import { getUserByUserName } from "@/server/actions/user-actions";
import { UserNotFoundProfile } from "../components/UserNotFound";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserMediaByUserId } from "@/server/actions/media-actions";
import ProfileClient from "../components/ProfileClient";
import { getActivity } from "@/server/actions/feed-actions";

const ProfileByUsername = async ({
  params,
}: {
  params: { userName: string };
}) => {
  const { userName } = params;

  const user = await getUserByUserName(userName);

  if (!user) {
    return <UserNotFoundProfile />;
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isOwnProfile = session.user.id === user?.id;

  const media = await getUserMediaByUserId(user.id);
  const activity = await getActivity(user.id);

  return (
    <ProfileClient
      user={user}
      media={media.data}
      activities={activity.data}
      isOwnProfile={isOwnProfile}
    />
  );
};

export default ProfileByUsername;
