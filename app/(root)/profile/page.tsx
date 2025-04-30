import { getUserByUserName } from "@/server/actions/user-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ProfileClient from "./components/ProfileClient";
import { getUserMedia } from "@/server/actions/media-actions";
import { getActivity } from "@/server/actions/feed-actions";

const Profile = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = await getUserByUserName(session?.user.userName);

  const media = await getUserMedia();
  const activity = await getActivity(session?.user.id);

  return (
    <ProfileClient user={user} media={media.data} activities={activity.data} />
  );
};

export default Profile;
