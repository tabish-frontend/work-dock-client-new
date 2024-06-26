import type { User } from "src/types/user";

export const useMockedUser = (): any => {
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  return {
    _id: "5e86809283e28b96d2d38537",
    avatar: "/assets/avatars/avatar-anika-visser.png",
    name: "Anika Visser",
    email: "anika.visser@devias.io",
  };
};
