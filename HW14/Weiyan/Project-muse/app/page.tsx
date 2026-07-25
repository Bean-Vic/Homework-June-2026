import { Dashboard } from "./components/Dashboard";
import { claimLegacyDataForUser, requirePageUser } from "./lib/auth-user";

export default async function Home() {
  const user = await requirePageUser();
  await claimLegacyDataForUser(user.id);

  return <Dashboard user={user} />;
}
