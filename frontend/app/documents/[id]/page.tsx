import { DocumentDetailPage } from "@/components/page-kit";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DocumentDetailPage id={id} />;
}
