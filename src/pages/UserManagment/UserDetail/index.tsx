import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  ToggleRight,
  CreditCard,
  Shield,
  UserCircle,
  Package,
  Clock,
  Hash,
} from 'lucide-react';

import { getUser } from '@/services/user-managment';
import LoadingSpinner from '@/components/LoadingSpinner';
import { InfoSection } from '@/components/common/info-section';
import { formatDate } from '@/lib/utils';
import StatusBadge, {
  type StatusVariant,
} from '@/components/common/status-badge';
import { TAGS } from '@/utils/constants/tags';
import Empty from '@/components/common/empty';
import { DetailPage } from '@/components/CustomPageLayout/detail-page';
import { Badge } from '@/components/ui/badge';
import type { IUserRole } from '@/services/user-managment/types';

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

  if (!user) {
    return (
      <Empty
        title="User not found"
        description="The user you are looking for does not exist"
        icon={<User />}
      />
    );
  }

  const getUserRoles = (roles: IUserRole[]) => {
    return roles?.map(role => (
      <Badge key={role.id} variant="warning">
        {role.roleName}
      </Badge>
    ));
  };

  const USER_INFORMATION_ITEMS = [
    {
      label: 'First Name',
      value: `${user?.firstname} ${user?.lastname}`,
      icon: <UserCircle />,
    },
    {
      label: 'Email',
      value: user?.email,
      icon: <Mail />,
    },
    {
      label: 'Status',
      value: <StatusBadge isActive={user?.isActive} />,
      icon: <ToggleRight />,
    },
    {
      label: 'Roles',
      value: getUserRoles(user?.roles ?? []) || '-',
      icon: <Shield />,
    },
    {
      label: 'User Type',
      value: <Badge variant="info">{user?.userType}</Badge>,
      icon: <Shield />,
    },
  ];

  const SUBSCRIPTION_INFORMATION_ITEMS = [
    {
      label: 'Product Name',
      value: <Badge variant="info">{user?.subscription?.productName}</Badge>,
      icon: <Package />,
    },

    {
      label: 'Status',
      value: (
        <StatusBadge status={user?.subscription?.status as StatusVariant} />
      ),
      icon: <ToggleRight />,
    },
    {
      label: 'Custom Capacity',
      value: String(user?.subscription?.customCapacity ?? '-'),
      icon: <Hash />,
    },
    {
      label: 'Start Date',
      value: user?.subscription?.startDate
        ? formatDate(user?.subscription?.startDate)
        : '-',
      icon: <Calendar />,
    },
    {
      label: 'Current Period Start',
      value: user?.subscription?.currentPeriodStart
        ? formatDate(user?.subscription?.currentPeriodStart)
        : '-',
      icon: <Clock />,
    },
    {
      label: 'Current Period End',
      value: user?.subscription?.currentPeriodEnd
        ? formatDate(user?.subscription?.currentPeriodEnd)
        : '-',
      icon: <Clock />,
    },
    {
      label: 'Next Billing Date',
      value: user?.subscription?.nextBillingDate
        ? formatDate(user?.subscription?.nextBillingDate)
        : '-',
      icon: <Calendar />,
    },
    {
      label: 'Subscription Created At',
      value: user?.subscription?.createdAt
        ? formatDate(user?.subscription?.createdAt)
        : '-',
      icon: <Calendar />,
    },
  ];

  return (
    <DetailPage
      name={`${user?.firstname} ${user?.lastname}`}
      edit={{
        label: 'Edit User',
        path: `/user-management/${id}/edit`,
      }}
    >
      <InfoSection
        title="User Information"
        layout="grid"
        icon={<User />}
        items={USER_INFORMATION_ITEMS}
      />

      {user?.subscription && (
        <InfoSection
          title="Subscription Information"
          layout="grid"
          icon={<CreditCard />}
          items={SUBSCRIPTION_INFORMATION_ITEMS}
        />
      )}
    </DetailPage>
  );
}
