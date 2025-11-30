import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  getVendorFileSample,
  processSelectedVendorFile,
  updateVendorFileMapping,
} from '@/services/vendor';
import type {
  IVendorFileDetail,
  IColumnMapping,
  ColumnNameType,
} from '@/services/vendor/types';
import { COLUMN_NAME_OPTIONS } from '@/services/vendor/types';
import { Badge } from '@/components/ui/badge';
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
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  MousePointerClick,
  Save,
  TriangleAlertIcon,
} from 'lucide-react';
import Empty from '@/components/common/empty';
import LoadingSpinner from '@/components/LoadingSpinner';
import CustomButton from '@/components/CustomButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from '@/components/ui/frame';
import { motion, AnimatePresence } from 'framer-motion';

interface VendorFileCardProps {
  vendorId: string;
  file: IVendorFileDetail;
  onMappingSuccess?: () => void;
  onProcessSuccess?: () => void;
}

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
  onProcessSuccess,
}: VendorFileCardProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [delimiter, setDelimiter] = useState(file.fileDelimeter || ',');
  const [columnMappings, setColumnMappings] = useState<IColumnMapping[]>(
    file.columnMappings || []
  );

  // Sample data API çağrısı - expand edildiğinde çağrılır
  const {
    data: sampleData,
    isLoading: isSampleLoading,
    refetch: refetchSample,
  } = useQuery({
    queryKey: ['vendorFileSample', vendorId, file.id],
    queryFn: () => getVendorFileSample(vendorId, file.id),
  });

  // API'den gelen sample data veya file'dan gelen sample
  const sampleContent = sampleData?.sample || file.sample;

  // API'den gelen config değerleri ile state'i güncelle
  useEffect(() => {
    if (sampleData) {
      if (sampleData.fileDelimeter) {
        setDelimiter(sampleData.fileDelimeter);
      }
      if (sampleData.columnMappings && sampleData.columnMappings.length > 0) {
        setColumnMappings(sampleData.columnMappings);
      }
    }
  }, [sampleData]);

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
      refetchSample();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Alan eşleştirmesi kaydedilemedi');
    },
  });

  // Dosya işleme mutation
  const { mutate: processFile, isPending: isProcessing } = useMutation({
    mutationFn: (processAgain: boolean) =>
      processSelectedVendorFile(vendorId, {
        processAgain,
        vendorFileIds: [file.id],
      }),
    onSuccess: () => {
      toast.success(
        file.isProcessed
          ? 'Dosya yeniden işleme alındı'
          : 'Dosya işleme başlatıldı'
      );
      onProcessSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Dosya işleme başarısız');
    },
  });

  /** Process butonuna tıklandığında önce mapping kaydet, sonra process başlat */
  const handleProcess = async () => {
    // Önce mapping'i kaydet
    await updateVendorFileMapping(vendorId, file.id, {
      columnMappings,
      fileDelimeter: delimiter,
    });
    // Sonra process başlat
    processFile(file.isProcessed);
  };

  // Sample veriyi parse et (delimiter'a göre)
  const parsedData = useMemo(() => {
    if (!sampleContent) return null;

    // Satırlara ayır
    const lines = sampleContent.split('\n').filter(line => line.trim());

    // Her satırı parse et
    return lines.map(line => parseCSVLine(line, delimiter));
  }, [sampleContent, delimiter]);

  // İlk satırı header olarak kullan
  const headers = parsedData?.[0] || [];
  const dataRows = parsedData?.slice(1, 15) || []; // İlk 10 satır

  // "Seçim yok" için özel değer (boş string Select.Item'da kullanılamaz)
  const NONE_VALUE = '__none__';

  // Column index için mapping değerini getir
  const getMappingForIndex = (index: number): string => {
    const mapping = columnMappings.find(m => m.index === index);
    return mapping?.columnName || NONE_VALUE;
  };

  // Column mapping güncelle
  const handleColumnMappingChange = (
    index: number,
    columnName: ColumnNameType | typeof NONE_VALUE
  ) => {
    setColumnMappings(prev => {
      // Önce bu index için mevcut mapping'i kaldır
      const filtered = prev.filter(m => m.index !== index);

      // Eğer "seçim yok" değilse yeni mapping ekle
      if (columnName && columnName !== NONE_VALUE) {
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
    <Frame className="rounded-xl p-2">
      <FrameHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CustomButton
              variant="outline"
              size="icon-lg"
              icon={isExpanded ? <ChevronUp /> : <ChevronDown />}
              onClick={() => setIsExpanded(!isExpanded)}
            />
            <FrameTitle className="text-base">{file.fileName}</FrameTitle>

            {mappedColumns.length > 0 && (
              <Badge size="lg">
                {mappedColumns.length} / {headers.length} matched!
              </Badge>
            )}

            <Badge variant="warning" size="lg">
              {file.status}
            </Badge>

            {file.isProcessed && (
              <Badge variant="success" size="lg">
                Processed
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select value={delimiter} onValueChange={setDelimiter}>
              <SelectTrigger className="bg-background">
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
            <CustomButton
              variant="outline"
              label="Save Mapping"
              onClick={() => updateMapping()}
              disabled={!isValid || isUpdating}
              loading={isUpdating}
              size="lg"
              icon={<Save />}
            />
            <CustomButton
              label={file.isProcessed ? 'Process Again' : 'Process'}
              onClick={handleProcess}
              disabled={!isValid || isProcessing || isUpdating}
              loading={isProcessing || isUpdating}
              size="lg"
              icon={<MousePointerClick />}
              iconPosition="right"
            />
          </div>
        </div>
      </FrameHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
          >
            <FramePanel>
              {parsedData && parsedData.length > 0 ? (
                <div className="space-y-2">
                  <div className="bg-card rounded-lg border p-4">
                    {missingRequired.length > 0 && (
                      <Alert variant="error" className="mb-4">
                        <TriangleAlertIcon />
                        <AlertTitle>Required fields</AlertTitle>
                        <AlertDescription>
                          {missingRequired
                            .map(col => {
                              const opt = COLUMN_NAME_OPTIONS.find(
                                o => o.value === col
                              );
                              return opt?.label || col;
                            })
                            .join(', ')}
                          {''} {missingRequired.length > 1 ? 'are' : 'is'}{' '}
                          missing.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                      {headers.map((header, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="secondary" size="lg">
                            {String(header) || `Sütun ${index + 1}`}
                            <ArrowRight />
                          </Badge>
                          <Select
                            value={getMappingForIndex(index)}
                            onValueChange={value =>
                              handleColumnMappingChange(
                                index,
                                value as ColumnNameType | typeof NONE_VALUE
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={NONE_VALUE}>None</SelectItem>
                              {COLUMN_NAME_OPTIONS.map(opt => {
                                const isAlreadyMapped = columnMappings.some(
                                  m =>
                                    m.columnName === opt.value &&
                                    m.index !== index
                                );
                                return (
                                  <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    disabled={isAlreadyMapped}
                                  >
                                    {opt.label}
                                    {opt.required && (
                                      <Badge variant="error" className="ml-1">
                                        REQ
                                      </Badge>
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

                  <div className="bg-card rounded-lg border p-4">
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
                                className="whitespace-nowrap"
                              >
                                <div className="flex items-center gap-px">
                                  <Badge
                                    variant="secondary"
                                    className="truncate"
                                  >
                                    {String(header)}
                                  </Badge>
                                  {mappingOpt && (
                                    <div className="flex items-center gap-px">
                                      <ArrowRight className="size-3 stroke-3" />
                                      <Badge variant="warning">
                                        {mappingOpt.label}
                                      </Badge>
                                    </div>
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
                                className="max-w-32 truncate"
                                title={String(cell)}
                              >
                                {String(cell) || '-'}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : isSampleLoading ? (
                <LoadingSpinner />
              ) : (
                <Empty
                  title="File not processed yet"
                  description="This file has not been processed yet or the sample data is not available."
                  icon={<FileText />}
                />
              )}
            </FramePanel>
          </motion.div>
        )}
      </AnimatePresence>
    </Frame>
  );
};
