import { GroupFormStateObjProps, GroupList, GroupLists } from '@/types/recruit';

import { axiosInstance } from './axios';

interface getAllMyGroupsProps {
  group_id: number;
  name: string;
  recruitment_status: boolean;
  meeting_type: string;
  day: string;
  time: string;
  region: string;
  description: string;
  participant_limit: number;
  open_chat_link: string;
  group_lead: string;
  is_group_lead: boolean;
  is_participant: boolean;
  userGroup: {
    nickname: string;
    photoId: string;
    photoUrl: string;
    userInfo: string;
    gender: string;
    age: string;
    provider: string;
    groups: number[];
  }[];
}

export const getReadingGroupData = async (
  page: number,
): Promise<GroupLists> => {
  try {
    const { data } = await axiosInstance.request<GroupLists>({
      method: 'GET',
      url: `/groups/find?page=${page}&limit=5`,
    });

    if (data) {
      return data;
    } else {
      throw new Error('모임 데이터를 찾을 수 없습니다.');
    }
  } catch {
    throw new Error('모임 조회 작업 중 오류가 발생하였습니다.');
  }
};

//독서모임 개설
export const postReadingGroupOpen = async ({
  groupName,
  groupType,
  groupDay,
  groupTime,
  groupRegion,
  groupDescription,
  groupPeopleNumber,
  groupKakaoLink,
}: GroupFormStateObjProps) => {
  const body = {
    name: groupName,
    recruitment_status: true,
    meeting_type: groupType,
    day: groupDay,
    time: groupTime,
    region: groupRegion,
    description: groupDescription,
    participant_limit: parseInt(groupPeopleNumber),
    open_chat_link: groupKakaoLink,
  };

  try {
    const {
      data: { group_id },
    } = await axiosInstance.request<{ group_id: string }>({
      method: 'POST',
      url: `/groups`,
      data: body,
    });

    if (group_id) return group_id;

    throw new Error(
      '모임 추가 작업은 완료했지만 group_id를 조회할 수 없습니다.',
    );
  } catch {
    throw new Error('모임 추가 작업 중 에러가 발생하였습니다.');
  }
};

//독서모임 정보 상세 조회
export const fetchReadingGroupInfo = async (
  groupId: string,
): Promise<GroupList> => {
  try {
    const {
      data: { group: groupDataObj },
    } = await axiosInstance.request({
      method: 'GET',
      url: `/groups/${groupId}`,
    });

    if (groupDataObj) {
      return groupDataObj;
    } else {
      throw new Error('독서 모임 상세 데이터를 찾을 수 없습니다.');
    }
  } catch (error) {
    throw new Error('독서 모임 상세 데이터 fetch 시 문제가 발생하였습니다.');
  }
};

//독서모임 가입
export const postGroupJoinUser = async (groupId: number) => {
  try {
    await axiosInstance.request({
      method: 'POST',
      url: `/groups/user/${groupId}/join`,
    });
  } catch (error) {
    console.error(error);
  }
};

//독서모임 탈퇴
export const postGroupLeaveUser = async (groupId: number) => {
  try {
    await axiosInstance.request({
      method: 'POST',
      url: `/groups/user/${groupId}/leave`,
    });
  } catch (error) {
    console.error(error);
  }
};

interface patchReadingGroupChangeType {
  groupId: number;
  groupData: Partial<GroupList> | GroupFormStateObjProps;
}

//독서모임 수정 patch api
export const patchReadingGroupChange = async ({
  groupId,
  groupData,
}: patchReadingGroupChangeType) => {
  try {
    await axiosInstance.request({
      method: 'PATCH',
      url: `/groups/${groupId}`,
      data: groupData,
    });
  } catch (error) {
    console.error(error);
  }
};

// 유저가 속한 모든 그룹 조희
export const getGroupsApi = async (
  userId?: string,
): Promise<getAllMyGroupsProps[]> => {
  try {
    const { data } = await axiosInstance.request({
      method: 'GET',
      url: `${userId ? `/groups/user-group/${userId}` : '/groups/user-group'}`,
    });

    return data;
  } catch (error) {
    throw new Error('그룹을 불러올 수 없습니다.');
  }
};

//리더가 멤버 강퇴하기
export const deleteGroupMember = async ({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) => {
  try {
    await axiosInstance.request({
      method: 'DELETE',
      url: `/groups/${groupId}/delete-user/${userId}`,
    });
  } catch (error) {
    throw new Error('그룹을 불러올 수 없습니다.');
  }
};
