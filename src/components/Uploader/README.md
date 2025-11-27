# Uploader Component

React Hook Form ile entegre edilmiş dosya yükleme componenti.

## Kullanım

```tsx
import { useForm, FormProvider } from 'react-hook-form';
import { Uploader } from '@/components/Uploader';

interface FormData {
  documents: File[];
  // diğer form alanları...
}

function MyForm() {
  const methods = useForm<FormData>({
    defaultValues: {
      documents: [],
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form data:', data);
    // Form submit işlemleri...
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Uploader
          name="documents"
          folderType="vendor-documents"
          maxFiles={5}
          multiple
          onUploadSuccess={(urls) => {
            console.log('Uploaded files:', urls);
          }}
          onUploadError={(error) => {
            console.error('Upload error:', error);
          }}
        />
        
        <button type="submit">Gönder</button>
      </form>
    </FormProvider>
  );
}
```

## Props

- `name` (string, zorunlu): React Hook Form field adı
- `folderType` (string, zorunlu): Dosyaların yükleneceği klasör tipi
- `maxFiles` (number, opsiyonel): Maksimum dosya sayısı (varsayılan: 2)
- `multiple` (boolean, opsiyonel): Çoklu dosya seçimi (varsayılan: true)
- `accept` (string, opsiyonel): Kabul edilen dosya tipleri (örn: "image/*,application/pdf")
- `maxSize` (number, opsiyonel): Maksimum dosya boyutu (byte)
- `disabled` (boolean, opsiyonel): Component devre dışı bırakma
- `onUploadSuccess` (function, opsiyonel): Yükleme başarılı olduğunda çağrılır
- `onUploadError` (function, opsiyonel): Yükleme hatası olduğunda çağrılır

## Özellikler

- ✅ React Hook Form entegrasyonu
- ✅ Gerçek API ile çalışma (uploadFile servisi)
- ✅ Progress tracking (ilerleme takibi)
- ✅ Drag & drop desteği
- ✅ Çoklu dosya yükleme
- ✅ Dosya boyutu ve tip kontrolü
- ✅ Hata yönetimi
- ✅ Toast bildirimleri
- ✅ Türkçe dil desteği




