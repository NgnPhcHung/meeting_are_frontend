import dynamic from "next/dynamic";

const SocketGame = dynamic(() => import("@/app/(components)/Game"), {
  ssr: false,
});

interface PageParam {
  slug: string;
}

interface Props {
  params: Promise<PageParam>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <SocketGame roomName={slug} />;
}
