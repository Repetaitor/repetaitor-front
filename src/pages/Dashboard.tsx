import { useAuthContext } from '@/store/user-context';

const Dashboard = () => {
  const { activeUser } = useAuthContext();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Dashboard</h1>
      <p className="text-lg">Welcome to the Dashboard!</p>
      <div className="mt-4">
        <p className="text-lg">User: {activeUser?.email}</p>
        <p className="text-lg">Role: {activeUser?.role}</p>
        <p className="text-lg">ID: {activeUser?.id}</p>
        <p className="text-lg">Name: {activeUser?.firstName}</p>
        <p className="text-lg">lastName: {activeUser?.lastName}</p>
      </div>
    </div>
  );
};

export default Dashboard;
