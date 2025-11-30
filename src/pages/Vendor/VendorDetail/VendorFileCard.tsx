import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { updateVendorFileMapping } from '@/services/vendor';
import type {
  IVendorFileDetail,
  IColumnMapping,
  ColumnNameType,
} from '@/services/vendor/types';
import { COLUMN_NAME_OPTIONS } from '@/services/vendor/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Save,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VendorFileCardProps {
  vendorId: string;
  file: IVendorFileDetail;
  onMappingSuccess?: () => void;
}

/** Dosya adından orijinal adı çıkar (UUID prefix'i kaldır) */
const extractOriginalFileName = (fileName: string): string => {
  const parts = fileName.split('_');
  if (parts.length > 1) {
    return parts.slice(1).join('_');
  }
  return fileName;
};

/** Dosya status için badge varyantı */
const getFileStatusVariant = (
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'uploaded':
      return 'secondary';
    case 'processing':
      return 'default';
    case 'processed':
      return 'outline';
    case 'error':
      return 'destructive';
    default:
      return 'secondary';
  }
};

/** Dosya status için Türkçe etiket */
const getFileStatusLabel = (status: string): string => {
  switch (status) {
    case 'uploaded':
      return 'Yüklendi';
    case 'processing':
      return 'İşleniyor';
    case 'processed':
      return 'Tamamlandı';
    case 'error':
      return 'Hata';
    default:
      return status;
  }
};

/** Delimiter seçenekleri */
const DELIMITER_OPTIONS = [
  { value: ',', label: 'Virgül (,)' },
  { value: ';', label: 'Noktalı Virgül (;)' },
  { value: '\t', label: 'Tab' },
  { value: '|', label: 'Pipe (|)' },
];

/** CSV satırını parse et - tırnak içindeki virgülleri dikkate alarak */
const parseCSVLine = (line: string, delimiter: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // Eğer bir sonraki karakter de " ise, bu escape edilmiş tırnak
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Bir sonraki tırnağı atla
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Son değeri ekle
  result.push(current.trim());

  return result;
};

export const VendorFileCard = ({
  vendorId,
  file,
  onMappingSuccess,
}: VendorFileCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [delimiter, setDelimiter] = useState(file.fileDelimeter || ',');
  const [columnMappings, setColumnMappings] = useState<IColumnMapping[]>(
    file.columnMappings || []
  );

  // Column mapping güncelle
  const { mutate: updateMapping, isPending: isUpdating } = useMutation({
    mutationFn: () =>
      updateVendorFileMapping(vendorId, file.id, {
        columnMappings,
        fileDelimeter: delimiter,
      }),
    onSuccess: () => {
      toast.success('Alan eşleştirmesi başarıyla kaydedildi');
      onMappingSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Alan eşleştirmesi kaydedilemedi');
    },
  });

  // Sample veriyi parse et (delimiter'a göre)
  const parsedData = useMemo(() => {
    if (!file.sample) return null;

    // Satırlara ayır
    const lines = file.sample.split('\n').filter(line => line.trim());

    // Her satırı parse et
    return lines.map(line => parseCSVLine(line, delimiter));
  }, [file.sample, delimiter]);

  // İlk satırı header olarak kullan
  const headers = parsedData?.[0] || [];
  const dataRows = parsedData?.slice(1, 11) || []; // İlk 10 satır

  // Column index için mapping değerini getir
  const getMappingForIndex = (index: number): string => {
    const mapping = columnMappings.find(m => m.index === index);
    return mapping?.columnName || '';
  };

  // Column mapping güncelle
  const handleColumnMappingChange = (
    index: number,
    columnName: ColumnNameType | ''
  ) => {
    setColumnMappings(prev => {
      // Önce bu index için mevcut mapping'i kaldır
      const filtered = prev.filter(m => m.index !== index);

      // Eğer boş değilse yeni mapping ekle
      if (columnName) {
        // Aynı columnName başka bir index'te varsa onu da kaldır
        const withoutDuplicate = filtered.filter(
          m => m.columnName !== columnName
        );
        return [...withoutDuplicate, { columnName, index }];
      }

      return filtered;
    });
  };

  // Zorunlu alanların kontrol edilmesi
  const requiredColumns = COLUMN_NAME_OPTIONS.filter(opt => opt.required).map(
    opt => opt.value
  );
  const mappedColumns = columnMappings.map(m => m.columnName);
  const missingRequired = requiredColumns.filter(
    col => !mappedColumns.includes(col)
  );
  const isValid = missingRequired.length === 0;

  return (
    <Card>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-muted-foreground size-5" />
            <div>
              <CardTitle className="text-base">
                {extractOriginalFileName(file.fileName)}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant={getFileStatusVariant(file.status)}>
                  {getFileStatusLabel(file.status)}
                </Badge>
                {file.isProcessed && (
                  <span className="text-xs text-green-600">İşlendi</span>
                )}
                {file.fileDelimeter && (
                  <span className="text-xs">Ayırıcı: {file.fileDelimeter}</span>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {file.columnMappings && file.columnMappings.length > 0 && (
              <Badge variant="outline">
                {file.columnMappings.length} alan eşleştirildi
              </Badge>
            )}
            {isExpanded ? (
              <ChevronUp className="size-5" />
            ) : (
              <ChevronDown className="size-5" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Delimiter Seçimi */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Settings className="text-muted-foreground size-4" />
              <span className="text-sm font-medium">Ayırıcı Karakter:</span>
            </div>
            <Select value={delimiter} onValueChange={setDelimiter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ayırıcı seç" />
              </SelectTrigger>
              <SelectContent>
                {DELIMITER_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sample Data ve Column Mapping */}
          {parsedData && parsedData.length > 0 ? (
            <div className="space-y-4">
              {/* Column Mapping Seçicileri */}
              <div className="rounded-lg border p-4">
                <h4 className="mb-3 font-medium">Alan Eşleştirmesi</h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  Her sütun için karşılık gelen alanı seçin.{' '}
                  <span className="text-destructive font-medium">
                    Name, Price ve ASIN/UPC
                  </span>{' '}
                  zorunludur.
                </p>

                {/* Zorunlu alanlar uyarısı */}
                {missingRequired.length > 0 && (
                  <div className="bg-destructive/10 text-destructive mb-4 rounded-md p-3 text-sm">
                    Eksik zorunlu alanlar:{' '}
                    {missingRequired
                      .map(col => {
                        const opt = COLUMN_NAME_OPTIONS.find(
                          o => o.value === col
                        );
                        return opt?.label || col;
                      })
                      .join(', ')}
                  </div>
                )}

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {headers.map((header, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-md border p-2"
                    >
                      <span
                        className={cn(
                          'bg-muted truncate rounded px-2 py-1 text-xs font-medium',
                          'max-w-[120px]'
                        )}
                        title={String(header)}
                      >
                        {String(header) || `Sütun ${index + 1}`}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <Select
                        value={getMappingForIndex(index)}
                        onValueChange={value =>
                          handleColumnMappingChange(
                            index,
                            value as ColumnNameType | ''
                          )
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Alan seç" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Seçim yok</SelectItem>
                          {COLUMN_NAME_OPTIONS.map(opt => {
                            const isAlreadyMapped = columnMappings.some(
                              m =>
                                m.columnName === opt.value && m.index !== index
                            );
                            return (
                              <SelectItem
                                key={opt.value}
                                value={opt.value}
                                disabled={isAlreadyMapped}
                              >
                                {opt.label}
                                {opt.required && (
                                  <span className="text-destructive ml-1">
                                    *
                                  </span>
                                )}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Data Tablosu */}
              <div className="rounded-lg border">
                <div className="bg-muted/50 border-b px-4 py-2">
                  <h4 className="text-sm font-medium">
                    Örnek Veri (İlk 10 satır)
                  </h4>
                </div>
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {headers.map((header, index) => {
                          const mapping = getMappingForIndex(index);
                          const mappingOpt = COLUMN_NAME_OPTIONS.find(
                            o => o.value === mapping
                          );
                          return (
                            <TableHead
                              key={index}
                              className="min-w-[120px] whitespace-nowrap"
                            >
                              <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500">
                                  {String(header)}
                                </span>
                                {mappingOpt && (
                                  <Badge variant="outline" className="text-xs">
                                    {mappingOpt.label}
                                  </Badge>
                                )}
                              </div>
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataRows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell: string, cellIndex: number) => (
                            <TableCell
                              key={cellIndex}
                              className="max-w-[200px] truncate text-sm"
                              title={String(cell)}
                            >
                              {String(cell)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Kaydet Butonu */}
              <div className="flex justify-end">
                <Button
                  onClick={() => updateMapping()}
                  disabled={!isValid || isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 size-4" />
                  )}
                  Eşleştirmeyi Kaydet
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              Örnek veri bulunamadı
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
