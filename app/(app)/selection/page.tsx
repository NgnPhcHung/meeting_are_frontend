"use client";

import { CreateRoomForm } from "@/app/(components)/room/CreateRoomForm";
import { RoomList } from "@/app/(components)/room/RoomList";
import { GET_LIST_ROOMS } from "@/graphql/queries/room";
import { RoomQueries } from "@/types/room";
import { useQuery } from "@apollo/client";
import { Spin } from "antd";

export default function SelectionPage() {
  const { data, loading } = useQuery<RoomQueries>(GET_LIST_ROOMS);

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="space-y-4">
      <CreateRoomForm rooms={data?.getListRooms} />
      <RoomList rooms={data?.getListRooms} />
    </div>
  );
}
