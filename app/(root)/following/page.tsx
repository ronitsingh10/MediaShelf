// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   Bell,
//   Check,
//   ChevronRight,
//   Film,
//   MoreHorizontal,
//   Star,
//   Tv,
//   UserPlus,
//   Users,
//   X,
// } from "lucide-react";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { getMyFollowing } from "@/server/actions/follow-actions";
// import { getSearchControl } from "@/components/searchBar";
// import { getActivity } from "@/server/actions/feed-actions";
// // import { useToast } from "@/hooks/use-toast";

// // Mock data for people you follow
// const initialFollowing = [
//   {
//     id: "1",
//     name: "Alex Johnson",
//     username: "alexj",
//     avatar: "/placeholder.svg?height=100&width=100",
//     followers: 1243,
//     following: 356,
//     status: "active",
//     lastActive: "2 hours ago",
//     recentActivity: {
//       type: "rating",
//       media: "Dune: Part Two",
//       mediaType: "movie",
//       rating: 4.5,
//       timestamp: "1 day ago",
//     },
//   },
//   {
//     id: "2",
//     name: "Sam Rivera",
//     username: "samr",
//     avatar: "/placeholder.svg?height=100&width=100",
//     followers: 892,
//     following: 127,
//     status: "active",
//     lastActive: "Just now",
//     recentActivity: {
//       type: "watched",
//       media: "The Last of Us",
//       mediaType: "tv",
//       timestamp: "3 hours ago",
//     },
//   },
//   {
//     id: "3",
//     name: "Taylor Kim",
//     username: "taylork",
//     avatar: "/placeholder.svg?height=100&width=100",
//     followers: 3452,
//     following: 412,
//     status: "inactive",
//     lastActive: "3 days ago",
//     recentActivity: {
//       type: "wishlist",
//       media: "Foundation",
//       mediaType: "tv",
//       timestamp: "5 days ago",
//     },
//   },
//   {
//     id: "4",
//     name: "Jordan Patel",
//     username: "jordanp",
//     avatar: "/placeholder.svg?height=100&width=100",
//     followers: 567,
//     following: 231,
//     status: "active",
//     lastActive: "5 hours ago",
//     recentActivity: {
//       type: "rating",
//       media: "Elden Ring",
//       mediaType: "game",
//       rating: 5.0,
//       timestamp: "2 days ago",
//     },
//   },
// ];

// // Mock data for follow requests (if you have a private account)
// const initialFollowRequests = [
//   {
//     id: "5",
//     name: "Jamie Smith",
//     username: "jamies",
//     avatar: "/placeholder.svg?height=100&width=100",
//     followers: 423,
//     following: 512,
//     requestTime: "2 days ago",
//   },
//   {
//     id: "6",
//     name: "Casey Wong",
//     username: "caseyw",
//     avatar: "/placeholder.svg?height=100&width=100",
//     followers: 1287,
//     following: 354,
//     requestTime: "5 hours ago",
//   },
// ];

// export default function FollowingPage() {
//   const [following, setFollowing] = useState(initialFollowing);
//   const [followRequests, setFollowRequests] = useState(initialFollowRequests);
//   const [activeTab, setActiveTab] = useState("all");
//   //   const { toast } = useToast();

//   const getFollowingActivity = async () => {
//     const res = await getMyFollowing();
//     if (!res.success || !res.data) return;

//     const activityPromises = res.data.map(async (user) => {
//       try {
//         const activity = await getActivity(user);
//         return { user, activity };
//       } catch (err) {
//         console.error(`Failed to get activity for user ${user}:`, err);
//         return { user, activity: null };
//       }
//     });

//     const activities = await Promise.all(activityPromises);
//     activities.forEach(({ user, activity }) => {
//       console.log(user, activity);
//     });
//   };

//   //   const getFollowingActivity = async () => {
//   //     const res = await getMyFollowing();
//   //     // console.log(data);
//   //     for (const user of res.data) {
//   //       const activity = await getActivity(user);
//   //       console.log(activity);
//   //     }
//   //   };

//   useEffect(() => {
//     getFollowingActivity();
//   }, []);

//   const handleDiscoverPeopleClick = () => {
//     const searchControl = getSearchControl();

//     if (searchControl && searchControl.openSearchCallback) {
//       // Open search with "users" tab selected
//       searchControl.openSearchCallback("users");
//     } else {
//       console.log("Search control not available.");
//     }
//   };

//   const unfollow = (id: string) => {
//     setFollowing(following.filter((user) => user.id !== id));
//     toast({
//       title: "Unfollowed",
//       description: "You are no longer following this user",
//     });
//   };

//   const acceptFollowRequest = (id: string) => {
//     const acceptedUser = followRequests.find((request) => request.id === id);
//     if (acceptedUser) {
//       setFollowRequests(followRequests.filter((request) => request.id !== id));
//       //   toast({
//       //     title: "Follow request accepted",
//       //     description: `${acceptedUser.name} can now see your activity`,
//       //   });
//     }
//   };

//   const rejectFollowRequest = (id: string) => {
//     setFollowRequests(followRequests.filter((request) => request.id !== id));
//     // toast({
//     //   title: "Follow request rejected",
//     //   description: "The follow request has been declined",
//     // });
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-3xl font-bold">Following</h1>
//           <p className="text-muted-foreground mt-1">
//             People you follow and their activity
//           </p>
//         </div>
//         <Button onClick={handleDiscoverPeopleClick}>
//           <UserPlus className="h-4 w-4 mr-2" />
//           Discover People
//         </Button>
//       </div>

//       <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
//         <TabsList className="mb-4">
//           <TabsTrigger value="all">All Following</TabsTrigger>
//           <TabsTrigger value="active">Active Now</TabsTrigger>
//           <TabsTrigger value="recent">Recent Activity</TabsTrigger>
//         </TabsList>

//         <TabsContent value="all" className="mt-0">
//           {renderFollowingContent(following, unfollow)}
//         </TabsContent>
//         <TabsContent value="active" className="mt-0">
//           {renderFollowingContent(
//             following.filter((user) => user.status === "active"),
//             unfollow
//           )}
//         </TabsContent>
//         <TabsContent value="recent" className="mt-0">
//           {renderFollowingContent(
//             [...following].sort((a, b) => {
//               const timeA = getTimeInHours(a.recentActivity.timestamp);
//               const timeB = getTimeInHours(b.recentActivity.timestamp);
//               return timeA - timeB;
//             }),
//             unfollow
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// function renderFollowingContent(
//   users: typeof initialFollowing,
//   unfollowHandler: (id: string) => void,
//   discoverPeopleHandler: () => void
// ) {
//   if (users.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-16 text-center">
//         <Users className="h-16 w-16 text-muted-foreground mb-4" />
//         <h3 className="text-xl font-semibold mb-2">
//           You're not following anyone yet
//         </h3>
//         <p className="text-muted-foreground max-w-md mb-6">
//           Follow other users to see their activity and discover new content
//           based on what they're watching.
//         </p>
//         <Button onClick={discoverPeopleHandler}>
//           <UserPlus className="h-4 w-4 mr-2" />
//           Discover People
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {users.map((user) => (
//         <Card key={user.id} className="overflow-hidden">
//           <CardHeader className="pb-2">
//             <div className="flex justify-between items-start">
//               <div className="flex items-center gap-3">
//                 <Avatar>
//                   <AvatarImage
//                     src={user.avatar || "/placeholder.svg"}
//                     alt={user.name}
//                   />
//                   <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <CardTitle className="text-lg">{user.name}</CardTitle>
//                   <CardDescription>@{user.username}</CardDescription>
//                 </div>
//               </div>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon">
//                     <MoreHorizontal className="h-5 w-5" />
//                     <span className="sr-only">More options</span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem>View Profile</DropdownMenuItem>
//                   <DropdownMenuItem>View Watchlist</DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => unfollowHandler(user.id)}
//                     className="text-destructive"
//                   >
//                     Unfollow
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="bg-muted/50 rounded-lg p-3 mb-4">
//               <div className="text-sm font-medium mb-1">Recent Activity</div>
//               <div className="flex items-center text-sm">
//                 {renderActivityIcon(user.recentActivity.mediaType)}
//                 <span className="ml-2">
//                   {renderActivity(user.recentActivity)}
//                 </span>
//               </div>
//               <div className="text-xs text-muted-foreground mt-1">
//                 {user.recentActivity.timestamp}
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="bg-muted/30 py-2 px-4">
//             <Link
//               href={`/feed?user=${user.username}`}
//               className="text-sm flex items-center w-full justify-center text-muted-foreground hover:text-foreground transition-colors"
//             >
//               View All Activity
//               <ChevronRight className="h-4 w-4 ml-1" />
//             </Link>
//           </CardFooter>
//         </Card>
//       ))}
//     </div>
//   );
// }

// function renderActivityIcon(mediaType: string) {
//   switch (mediaType) {
//     case "movie":
//       return <Film className="h-4 w-4" />;
//     case "tv":
//       return <Tv className="h-4 w-4" />;
//     case "game":
//       return <Star className="h-4 w-4" />;
//     default:
//       return <Star className="h-4 w-4" />;
//   }
// }

// function renderActivity(activity: any) {
//   switch (activity.type) {
//     case "rating":
//       return (
//         <span>
//           Rated <span className="font-medium">{activity.media}</span>{" "}
//           {activity.rating}/5
//         </span>
//       );
//     case "watched":
//       return (
//         <span>
//           Watched <span className="font-medium">{activity.media}</span>
//         </span>
//       );
//     case "wishlist":
//       return (
//         <span>
//           Added <span className="font-medium">{activity.media}</span> to
//           wishlist
//         </span>
//       );
//     default:
//       return null;
//   }
// }

// // Helper function to convert time strings to approximate hours for sorting
// function getTimeInHours(timeString: string): number {
//   if (timeString.includes("Just now")) return 0;
//   if (timeString.includes("hour")) {
//     const hours = Number.parseInt(timeString.split(" ")[0]);
//     return hours;
//   }
//   if (timeString.includes("day")) {
//     const days = Number.parseInt(timeString.split(" ")[0]);
//     return days * 24;
//   }
//   return 1000; // Default for unknown formats, putting them at the end
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Film, MoreHorizontal, UserPlus, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import UserActivityModal from "./components/user-activity-modal";
import { getMyFollowing } from "@/server/actions/follow-actions";
import { getActivity } from "@/server/actions/feed-actions";
import { getSearchControl } from "@/components/searchBar";

// Group activities by user to create following list
interface FollowingUser {
  userId: string;
  userName: string;
  userImage: string | null;
  name: string;
  lastActivity?: {
    type: string;
    mediaTitle: string;
    mediaType: string;
    timestamp: number;
  };
  followersCount?: number;
  fullActivity?: any[];
}

export default function FollowingPage() {
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<FollowingUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        setLoading(true);
        const getFollowingActivity = async () => {
          const res = await getMyFollowing();
          if (!res.success || !res.data) return;

          const activityPromises = res.data.map(async (user) => {
            try {
              const activity = await getActivity(user);
              return { user, activity };
            } catch (err) {
              console.error(`Failed to get activity for user ${user}:`, err);
              return { user, activity: null };
            }
          });

          return await Promise.all(activityPromises);
        };

        const followingWithActivity = await getFollowingActivity();
        console.log("OG", followingWithActivity);

        const transformedFollowing = followingWithActivity.map(
          ({ user, activity }) => {
            // Extract the first activity item to use as lastActivity
            const lastActivityItem =
              activity.data && activity.data.length > 0
                ? activity.data[0]
                : null;
            console.log(user, lastActivityItem, activity);

            return {
              userId: user,
              userName: lastActivityItem.userName,
              userImage: lastActivityItem.userImage,
              name: lastActivityItem.Name,
              lastActivity: lastActivityItem
                ? {
                    type: lastActivityItem.activityType,
                    mediaTitle: lastActivityItem.mediaTitle,
                    mediaType: lastActivityItem.mediaType,
                    timestamp: lastActivityItem.timestamp,
                  }
                : undefined,
              followersCount: user.followersCount || 0,
              // Store the full activity data for use in the modal
              fullActivity: activity,
            };
          }
        );

        console.log(transformedFollowing);

        setFollowing(transformedFollowing);
      } catch (error) {
        console.error("Error fetching following:", error);
        toast.error("Failed to fetch following");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [toast]);

  const handleDiscoverPeopleClick = () => {
    const searchControl = getSearchControl();

    if (searchControl && searchControl.openSearchCallback) {
      // Open search with "users" tab selected
      searchControl.openSearchCallback("users");
    } else {
      console.log("Search control not available.");
    }
  };

  const unfollow = (userId: string) => {
    setFollowing(following.filter((user) => user.userId !== userId));
    toast.success("You are no longer following this user");
  };

  const openUserActivityModal = (user: FollowingUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeUserActivityModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Following</h1>
          <p className="text-muted-foreground mt-1">
            People you follow and their activity
          </p>
        </div>
        {/* <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Discover People
        </Button> */}
        <Button onClick={handleDiscoverPeopleClick}>
          <UserPlus className="h-4 w-4 mr-2" />
          Discover People
        </Button>
      </div>

      <div className="mb-8">
        {renderFollowingContent(
          [...following].sort((a, b) => {
            const timeA = a.lastActivity?.timestamp || 0;
            const timeB = b.lastActivity?.timestamp || 0;
            return timeB - timeA;
          }),
          unfollow,
          loading,
          openUserActivityModal
        )}
      </div>

      {selectedUser && (
        <UserActivityModal
          isOpen={isModalOpen}
          onClose={closeUserActivityModal}
          userName={selectedUser.userName}
          userId={selectedUser.userId}
          userImage={selectedUser.userImage}
          name={selectedUser.name}
          userData={selectedUser}
        />
      )}
    </div>
  );
}

function renderFollowingContent(
  users: FollowingUser[],
  unfollowHandler: (id: string) => void,
  loading: boolean,
  openUserActivityModal: (user: FollowingUser) => void
) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Users className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          You're not following anyone yet
        </h3>
        <p className="text-muted-foreground max-w-md mb-6">
          Follow other users to see their activity and discover new content
          based on what they're watching and reading.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <Card key={user.userId} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={
                      user.userImage || "/placeholder.svg?height=100&width=100"
                    }
                    alt={user.name}
                  />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <CardDescription>@{user.userName}</CardDescription>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/profile/${user.userName}`} passHref>
                    <DropdownMenuItem asChild>
                      <span>View Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={() => unfollowHandler(user.userId)}
                    className="text-destructive"
                  >
                    Unfollow
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            {user.lastActivity && (
              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <div className="text-sm font-medium mb-1">Recent Activity</div>
                <div className="flex items-center text-sm">
                  {user.lastActivity.mediaType === "movies" ? (
                    <Film className="h-4 w-4 mr-2" />
                  ) : (
                    <BookOpen className="h-4 w-4 mr-2" />
                  )}
                  <span>
                    {getActivityVerb(user.lastActivity.type)}{" "}
                    <span className="font-medium">
                      {user.lastActivity.mediaTitle}
                    </span>
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatTimestamp(user.lastActivity.timestamp)}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/30 py-2 px-4">
            <Button
              onClick={() => openUserActivityModal(user)}
              className="text-sm flex items-center w-full justify-center text-muted-foreground hover:text-foreground transition-colors"
              variant="ghost"
            >
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function getActivityVerb(activityType: string): string {
  switch (activityType) {
    case "review":
      return "Reviewed";
    case "rated":
      return "Rated";
    case "progress":
      return "Made progress on";
    case "updated":
      return "Updated";
    case "added":
      return "Added";
    default:
      return activityType;
  }
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  // Convert to appropriate time format
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else {
    return "Just now";
  }
}
