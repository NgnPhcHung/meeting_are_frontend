"use server";

import { CreateRoomDto } from "@/dtos/createRoomDto";
import { CREATE_ROOM } from "@/graphql/mutations/room";
import { GET_LIST_ROOMS } from "@/graphql/queries/room";
import { getClient } from "@/libs/apolloClient";
import { RoomResponse } from "@/types/room";

export const createRoom = async (
  body: CreateRoomDto,
  refetchQueries?: string[],
) => {
  try {
    const queriesToRefetch = refetchQueries?.includes("GET_LIST_ROOMS")
      ? [{ query: GET_LIST_ROOMS }]
      : [];
    const { data } = await getClient().mutate<{
      createRoom: RoomResponse;
    }>({
      mutation: CREATE_ROOM,
      variables: { input: body },
      refetchQueries: queriesToRefetch,
    });

    if (!data || !data.createRoom) {
      return {
        success: false,
        message: "Failed to create a room",
      };
    }

    return { success: true, message: "Create room successful", data };
  } catch (error) {
    console.error("Create room error:", error);
    throw {
      success: false,
      message: (error as Error).message,
    };
  }
};
