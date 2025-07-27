"use client";

import { GET_ME_QUERY } from "@/graphql/queries/user";
import { UserQuery } from "@/types/user";
import { useQuery } from "@apollo/client";
import { Button, Flex, Spin, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data, loading, error } = useQuery<UserQuery>(GET_ME_QUERY);

  useEffect(() => {
    if (data?.getMe) localStorage.setItem("user", JSON.stringify(data.getMe));
    if (error) {
      console.log(error);
    }
  }, [data, error]);

  if (loading) {
    return <Spin />;
  }

  return (
    <Flex>
      <Typography>Welcome to summoner's rift</Typography>
      <Button onClick={() => router.push("selection")}>Go to selection</Button>
    </Flex>
  );
}
