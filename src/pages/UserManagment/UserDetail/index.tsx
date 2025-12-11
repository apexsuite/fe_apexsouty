import CustomTab from '@/components/CustomTab';
import UserInformation from './UserInformation';
import UserSessions from './UserSessions';
import UserRoles from './UserRoles';
import { DetailPage } from '@/components/CustomPageLayout/detail-page';
import { getUser } from '@/services/user-managment';
import { TAGS } from '@/utils/constants/tags';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Clock, User, Shield } from 'lucide-react';

const TABS = [
  {
    label: 'Information',
    icon: <User />,
    value: 'information',
    content: <UserInformation />,
  },
  {
    label: 'Sessions',
    icon: <Clock />,
    value: 'sessions',
    content: <UserSessions />,
  },
  {
    label: 'Roles',
    icon: <Shield />,
    value: 'roles',
    content: <UserRoles />,
  },
];

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useQuery({
    queryKey: [TAGS.USER, id],
    queryFn: () => getUser(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DetailPage
      name={`${user?.firstname} ${user?.lastname}`}
      edit={{ label: 'Edit User', path: `/user-management/${id}/edit` }}
    >
      <CustomTab tabs={TABS} syncUrl />
    </DetailPage>
  );
}
