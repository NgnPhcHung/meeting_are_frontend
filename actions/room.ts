"use server";

import { CreateRoomDto } from "@/dtos/createRoomDto";
import { UpdateRoomDto } from "@/dtos/updateRoomDto";
import { CREATE_ROOM, UPDATE_ROOM } from "@/graphql/mutations/room";
import { GET_LIST_ROOMS } from "@/graphql/queries/room";
import { getClient } from "@/libs/apolloClient";
import { RoomMutation } from "@/types/room";

export const createRoom = async (
  body: CreateRoomDto,
  refetchQueries?: string[],
) => {
  try {
    const queriesToRefetch = refetchQueries?.includes("GET_LIST_ROOMS")
      ? [{ query: GET_LIST_ROOMS }]
      : [];
    const { data } = await getClient().mutate<RoomMutation>({
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

export const updateRoom = async (body: UpdateRoomDto) => {
  try {
    const { data } = await getClient().mutate<RoomMutation>({
      mutation: UPDATE_ROOM,
      variables: { input: body },
    });

    if (!data || !data.createRoom) {
      return {
        success: false,
        message: "Failed to update a room",
      };
    }

    return { success: true, message: "Room successful updated", data };
  } catch (error) {
    console.error("Update room error:", error);
    throw {
      success: false,
      message: (error as Error).message,
    };
  }
};
