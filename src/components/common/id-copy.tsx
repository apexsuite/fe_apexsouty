import React from "react";
import CustomButton from "@/components/CustomButton";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";
import i18n from "@/locales";

interface IdCopyProps {
  value?: string | null;
  /**
   * @description Tooltip metni (örn: "Copy Created By ID")
   */
  tooltip?: string;
  /**
   * @description Kısaltılmış gösterim uzunluğu. Örn: 6 => abc123...z9x8
   */
  shortLength?: number;
  /**
   * @description Toast mesajı (kopyalama başarılı olduğunda gösterilir)
   */
  successMessage?: string;
}

/**
 * @description
 * ID gibi uzun metinleri kısaltarak gösteren ve tek tıkla panoya kopyalayan ortak bileşen.
 * Satır tıklamasını tetiklememek için kendi tıklamasını durdurur ve kullanıcıya toast ile geri bildirim verir.
 */
const IdCopy = ({
  value,
  tooltip,
  shortLength = 6,
  successMessage = i18n.t("support.list.copy.genericSuccess"),
}: IdCopyProps) => {
  if (!value) {
    return <span className="text-xs text-muted-foreground">-</span>;
  }

  const display =
    value.length > shortLength * 2
      ? `${value.slice(0, shortLength)}...${value.slice(-shortLength)}`
      : value;

  const handleCopy: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    // Satır tıklamasını tetiklememek için
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(value);
      toast.success(successMessage);
    } catch {
      toast.error(i18n.t("support.list.copy.error"));
    }
  };

  return (
    <div className="flex items-center gap-2 max-w-[180px]">
      <span className="font-mono text-xs truncate">{display}</span>
      <CustomButton
        size="icon"
        variant="outline"
        tooltip={tooltip}
        icon={<Copy className="w-3 h-3" />}
        onClick={handleCopy}
      />
    </div>
  );
};

export default IdCopy;


