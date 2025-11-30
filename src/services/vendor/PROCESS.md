```json
{
  "description": "string",
  "name": "string",
  "vendorFiles": [
    {
      "fileName": "string",
      "filePath": "string"
    }
  ]
}
```

- Payload bu şekilde. vendorFiles'lar için aşağıdaki şekilde hareket edilmesi bekleniyor. presignedurl kullanılacağı için dosyanın upload işlemini FE takip edecek. upload işlemi sonrası backend'den gelecek olan filepath ile FE'de bulunan fileName bilgilerinin be'e array olarak gönderilmesi gerekecek. dosya upload içerisinde sadece "csv" dosyasını şimdilik zorunlu tutalım.

dosya yüklemek için ilk önce

POST /api/files

```json
{
  "fileName": "string",
  "folderType": "string"
}
```

- Dosya adı ile birlikte şuan kullandığımız folderType = "vendors" kullanılacak.

Bu endpoint'den bir uploadURL ve filePath response olarak gönderilecek.

FE tarafından bu uploadURL'ye PUT methodu ile kullanıcı tarafından yüklenmesi beklenen dosya yüklenecek.
filepath ise filename ile birlikte başarılı yükleme yapılır ise backend'e yukarıdaki payload içerisinde gönderilecek.

```json
{
  "data": {
    "filePath": "string/febea7fb-073f-4213-8fb4-847635027652/f45e432d-9cde-4390-bd0f-8a253c10aad0_string",
    "uploadURL": "https://scouty.blob.core.windows.net/suppliers/string/febea7fb-073f-4213-8fb4-847635027652/f45e432d-9cde-4390-bd0f-8a253c10aad0_string?se=2025-11-24T14%3A30%3A36Z&sig=eDd8OBzWQ7FpupgLtM0%2FpagnnR4%2FFouuhqRepcwjKdY%3D&sp=racw&spr=https&sr=b&st=2025-11-23T14%3A25%3A36Z&sv=2025-11-05"
  },
  "error": null
}
```

örnek uploadURL

oluşturma işlemi sonrasında BE'den oluşturulan VendorResponse verisi gönderilecek. Detay sayfasına gidilecek ve kullanıcı tarafından eklenen dosyaların detay bilgilerinin eklenmesi beklenecek. açılacak detay sayfasında dosya seçildiği zaman

GET /api/vendors/:vendorId/files/:vendorFileId/sample endpoint'inden seçilen dosya ile ilgili ilk kısımları be'den gönderilecek. gelecek olan response'da 10k veri gösterilecek. bu kısımda kullanıcı tarafından dosyada her satırda kullanılan delimeter seçilecek. default ";" seçilebilir. alan eşleştirmesi için

```json
{
  "columnMappings": [
    {
      "columnName": "string",
      "index": 0
    }
  ],
  "fileDelimeter": "string"
}
```

kullanılacak payload bu olacak, columnName olarak aşağıdaki seçenekleri seçmesi beklenecek.

```json
"asin/upc"
"sku"
"url"
"brand"
"price"
"name"
"category"
```

bu seçeneklerden name, price, asin/upc zorunlu olarak seçilecek diğerleri isteğe bağlı olabilecek.

bu eşleştirmeler sonrasında yukarıdaki payload hazırlanıp

POST /api/vendors/:vendorId/files/:vendorFileId/config endpoint'ine bu değerler gönderilecek.
get işleminde eğer delimeter ve columnMappings değerleri var ise daha önce ayarlandığı anlamı çıkacaktır. ona göre düzenleme ekranındakiler açıldığında set edilebilir.

Detay ekranında her bir dosyanın detayları arasında "isProcessed" verisi gelecek, eğer false ise daha önce bu dosyanın işlem görmediği anlaşılır,
Kullanıcı yeni eklediği dosyalarla birlikte bu dosyaların BE tarafında işleme alınmasını başlatacağı kısım. isterse eklediği dosyayı

POST /:vendorId/process/:vendorFileId
endpoint'i ile işleme başlatacak. (eğer daha önce işlem gördüyse payload içerisinde "processAgain" true gönderilir ise yeniden işleme yapılacaktır.)

POST /:vendorId/process/all hepsini birden tek bir seferde işleme başlatmak için kullanacağı endpoint bunda da eğer listede daha önce işlem görmüş olduklarını da başlatması gerekir ise processAgain true olarak gönderilmesi gerekecek.
