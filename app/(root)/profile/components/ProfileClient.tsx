"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mediaTypes } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import MediaChart from "./MediaCharts";
import MediaTracker from "./mediaInfo";
import FollowButton from "./followButton";
import ActivityFeed from "./ActivityFeed";

const ProfileClient = ({
  user,
  media,
  isOwnProfile = true,
  activities,
}: {
  user: any;
  media: any;
  isOwnProfile: boolean;
  activities: any;
}) => {
  return (
    <div className="mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold capitalize">{user.name}</h2>
                <p className="text-muted-foreground">{`@${user.userName}`}</p>
              </div>
              {isOwnProfile ? (
                <Button className="mt-4 md:mt-0">Edit Profile</Button>
              ) : (
                <FollowButton userId={user.id} />
              )}{" "}
            </div>
            <p className="mt-4">{user.bio}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {`Member since ${new Date(user.createdAt).getFullYear()}`}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {mediaTypes.map(({ key }) => (
                <MediaChart
                  key={key}
                  stats={user[key]}
                  total={user[key].total}
                  title={key}
                />
              ))}
            </div>
            <MediaTracker username={user.name} media={media} />
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
