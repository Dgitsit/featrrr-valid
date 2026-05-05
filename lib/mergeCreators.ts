import { validateProfiles } from "@/data/creators";
import { featrrrUsers } from "@/data/featrrrUsers";

export function getMergedCreators() {
  return validateProfiles.map((profile) => {
    const featrrrData = featrrrUsers.find(
      (user) => user.id === profile.featrrrUserId
    );

    return {
      ...profile,
      isFeatrrrUser: !!featrrrData,
      featrrrData: featrrrData || null,
    };
  });
}
