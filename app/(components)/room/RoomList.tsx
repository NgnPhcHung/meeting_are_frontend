import { GET_LIST_ROOMS } from "@/graphql/queries/room";
import { RoomQueries } from "@/types/room";
import { useQuery } from "@apollo/client";
import { Empty, Space, Spin } from "antd";
import { RoomListItem } from "./RoomListItem";

export const RoomList = () => {
  const { data, loading, error } = useQuery<RoomQueries>(GET_LIST_ROOMS);

  if (loading) {
    return <Spin />;
  }
  if (error) {
    console.error("Query error:", error);
    return <div>Error: {error.message}</div>;
  }
  if (!data?.getListRooms.length) {
    return <Empty />;
  }

  return (
    <Space direction="horizontal" size="middle" wrap>
      {data.getListRooms.map((room) => (
        <RoomListItem key={room.id} {...room} />
      ))}
    </Space>
  );
};
