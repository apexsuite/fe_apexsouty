import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
  Save,
  Loader,
} from 'lucide-react';

import {
  getUser,
  updateUserSubscriptionCapacity,
} from '@/services/user-managment';
import LoadingSpinner from '@/components/LoadingSpinner';
import { InfoSection } from '@/components/common/info-section';
import { formatDate } from '@/lib/utils';
import StatusBadge, {
  type StatusVariant,
} from '@/components/common/status-badge';
import { TAGS } from '@/utils/constants/tags';
import Empty from '@/components/common/empty';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ControlledInputNumber } from '@/components/FormInputs';
import { toastManager } from '@/components/ui/toast';
import type { IUserRole } from '@/services/user-managment/types';

interface CapacityFormData {
  customCapacity: number;
}

export default function UserInformation() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: [TAGS.USER, id],
    queryFn: () => getUser(id!),
    enabled: !!id,
  });

  const { control, handleSubmit, reset, watch } = useForm<CapacityFormData>({
    defaultValues: {
      customCapacity: user?.subscription?.customCapacity ?? 0,
    },
  });

  // User verisi geldiğinde form'u güncelle
  useEffect(() => {
    if (user?.subscription) {
      reset({
        customCapacity: user.subscription.customCapacity ?? 0,
      });
    }
  }, [user?.subscription, reset]);

  const { mutate: updateCapacityMutation, isPending: isUpdating } = useMutation(
    {
      mutationFn: (customCapacity: number) =>
        updateUserSubscriptionCapacity(id!, customCapacity),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [TAGS.USER, id],
        });
        toastManager.add({
          title: 'Subscription capacity updated successfully',
          type: 'success',
        });
      },
      onError: (error: Error) => {
        toastManager.add({
          title: error.message ?? 'Failed to update subscription capacity',
          type: 'error',
        });
      },
    }
  );

  const onSubmit = (data: CapacityFormData) => {
    updateCapacityMutation(Number(data.customCapacity));
  };

  const currentCapacity = watch('customCapacity');
  const hasChanges =
    user?.subscription && currentCapacity !== user.subscription.customCapacity;

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
      value: (
        <div className="flex flex-wrap gap-1">
          {getUserRoles(user?.roles ?? [])}
        </div>
      ),
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
    <section className="space-y-2">
      <InfoSection
        title="User Information"
        layout="grid"
        icon={<User />}
        items={USER_INFORMATION_ITEMS}
      />

      {user?.subscription && (
        <>
          <InfoSection
            title="Subscription Information"
            layout="grid"
            icon={<CreditCard />}
            items={SUBSCRIPTION_INFORMATION_ITEMS}
          />
          <InfoSection
            title="Update Subscription Capacity"
            layout="grid"
            icon={<CreditCard />}
            children={
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <ControlledInputNumber
                      control={control}
                      name="customCapacity"
                      label="Custom Capacity"
                      placeholder="Enter custom capacity"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        reset({
                          customCapacity:
                            user?.subscription?.customCapacity ?? 0,
                        });
                      }}
                      disabled={!hasChanges || isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!hasChanges || isUpdating}
                      variant="default"
                    >
                      {isUpdating ? (
                        <>
                          <Loader className="size-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="size-4" />
                          Update Capacity
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            }
          />
        </>
      )}
    </section>
  );
}
