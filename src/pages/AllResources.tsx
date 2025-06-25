import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useTranslation } from "react-i18next";

interface Resource {
  name: string;
  type: string;
  lastViewed: string;
  favorite?: number;
}

export default function AllResourcesPage() {
  const { t } = useTranslation();
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    import("@/data/resource.json").then((data) => {
      setResources(data.default as Resource[]);
    });
  }, []);

  return (
    <div className="w-full mx-auto px-6 md:px-12 py-12">
      <h1 className="text-2xl font-bold mb-8">{t("table.allResources")}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.name")}</TableHead>
            <TableHead>{t("table.type")}</TableHead>
            <TableHead>{t("table.lastViewed")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((r, i) => (
            <TableRow key={r.name + i}>
              <TableCell className="text-blue-700 font-medium cursor-pointer hover:underline">{r.name}</TableCell>
              <TableCell>{r.type}</TableCell>
              <TableCell className="whitespace-nowrap">{r.lastViewed}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 