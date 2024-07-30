import { currentUser } from "@/lib/auth";
import UserInfo from "./_component/user-info";

const Profile = async () => {
  const user = await currentUser();
  return (
    <div className="m-5 p-5">
      <UserInfo label="Info" user={user} />
    </div>
  );
};

export default Profile;
