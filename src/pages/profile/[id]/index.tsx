import { useRouter } from "next/router";

const Profile = () => {
  const router = useRouter();
  const { id } = router.query;

  return <div>Profile {id}</div>;
};

export default Profile;
