import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/layout/Layout';
import ProfileView from '../../components/profile/ProfileView';
import Loading from '../../components/common/Loading';
import api from '../../api/axios';

export default function Profile() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await api.get('/auth/profile');
      return data.user;
    }
  });

  if (isLoading) return <Loading />;

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <ProfileView user={user} />
        </div>
      </div>
    </Layout>
  );
}