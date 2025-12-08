import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Copy, Eye, Check } from 'lucide-react';
import {
  Popover,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import CustomButton from '@/components/CustomButton';
import { toastManager } from '@/components/ui/toast';
import { getUserSession } from '@/services/user-managment';
import { TAGS } from '@/utils/constants/tags';
import type { IUserSessions, TokenType } from '@/services/user-managment/types';
import dayjs from 'dayjs';
import DetailField from './DetailField';

interface SessionDetailPopoverProps {
  userId: string;
  session: IUserSessions;
}

export default function SessionDetailPopover({
  userId,
  session,
}: SessionDetailPopoverProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const { data: sessionDetail, isLoading } = useQuery({
    queryKey: [
      TAGS.USER,
      userId,
      'sessions',
      session.tokenType,
      session.tokenId,
    ],
    queryFn: () =>
      getUserSession(userId, {
        user_id: userId,
        token_type: session.tokenType as TokenType,
        token_id: session.tokenId,
      }),
    enabled: open,
  });

  const claimsString: string =
    sessionDetail?.claims != null && typeof sessionDetail.claims === 'object'
      ? JSON.stringify(sessionDetail.claims, null, 2)
      : '';

  const handleCopyClaims = async () => {
    if (!claimsString) return;

    try {
      await navigator.clipboard.writeText(claimsString);
      setCopied(true);
      toastManager.add({
        title: 'Claims copied to clipboard',
        type: 'success',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toastManager.add({
        title: 'Failed to copy claims',
        type: 'error',
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <CustomButton
            variant="outline"
            icon={<Eye />}
            tooltip="View Details"
            size="icon"
          />
        }
      />
      <PopoverPopup className="w-xl">
        {isLoading ? (
          <div className="space-y-4">
            <div className="space-y-3 text-sm">
              <DetailField
                label="Token Type:"
                isLoading
                valueClassName="w-24"
              />
              <DetailField
                label="Token ID:"
                isLoading
                valueClassName="w-full"
              />
              <DetailField
                label="Expires At:"
                isLoading
                valueClassName="w-32"
              />
              <DetailField
                label="Claims:"
                isLoading
                valueClassName="h-20 w-full"
              />
            </div>
          </div>
        ) : sessionDetail ? (
          <div className="space-y-4">
            <div>
              <PopoverTitle className="text-base">Session Details</PopoverTitle>
              <PopoverDescription>
                Detailed information about this session
              </PopoverDescription>
            </div>
            <div className="space-y-3 text-sm">
              <DetailField
                label="Token Type:"
                value={
                  <span className="capitalize">
                    {sessionDetail.tokenType?.replace('_', ' ')}
                  </span>
                }
              />
              <DetailField label="Token ID:" value={sessionDetail.tokenId} />
              <DetailField
                label="Expires At:"
                value={dayjs(sessionDetail.expiresAt).format(
                  'DD/MM/YYYY HH:mm:ss'
                )}
              />
              <DetailField
                label="Token:"
                value={
                  <span className="font-mono text-xs break-all">
                    {sessionDetail.token}
                  </span>
                }
              />
              {sessionDetail.claims != null && claimsString && (
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">
                      Claims:
                    </span>
                    <CustomButton
                      variant="ghost"
                      size="icon-xs"
                      onClick={handleCopyClaims}
                      tooltip="Copy claims"
                      icon={
                        copied ? <Check className="text-success" /> : <Copy />
                      }
                    />
                  </div>
                  <pre className="bg-muted overflow-auto rounded-md p-4 text-xs">
                    {claimsString}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground py-4 text-center text-sm">
            No details available
          </div>
        )}
      </PopoverPopup>
    </Popover>
  );
}
