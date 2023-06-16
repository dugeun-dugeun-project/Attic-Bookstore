import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import React from 'react';

import { getReadingGroupInfo } from '@/api/recruit';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';
import Avatar from '@/components/common/Avartar';
import RecruitNotification from '@/components/recruit/detail/RecruitNotification';
import RecruitParticipationControl from '@/components/recruit/detail/RecruitParticipationControl';
import { GroupList } from '@/types/recruit';

const DUMMY = {
  group_id: 1,
  name: '책 읽는 행복한 모임',
  recruitment_status: true,
  meeting_type: 'offline',
  day: '월요일',
  time: '15:00',
  region: '서울 강서구',
  description: '자유롭게 책을 읽고 공유하는 모임 입니다.',
  participant_limit: 20,
  open_chat_link: 'https://naver.com',
  group_lead: '1',
  isLeader: false,
  isMember: true,
  userGroup: [
    {
      user_id: '1',
      nickname: '민아',
      profileImg: 'https://via.placeholder.com/40',
      userInfo: 'user_info',
      gender: 'female',
      age: '23',
      provider: 'kakao',
      groups: [1, 3, 4],
    },
    {
      user_id: '2',
      nickname: '여우',
      profileImg: 'https://via.placeholder.com/40',
      userInfo: 'user_info',
      gender: 'female',
      age: '23',
      provider: 'kakao',
      groups: [1, 3, 4],
    },
  ],
};

const GROUPLEADER = {
  user_id: '1',
  nickname: '민아',
  profileImg: 'https://via.placeholder.com/40',
  userInfo: 'user_info',
  gender: 'female',
  age: '23',
  provider: 'kakao',
  groups: [2, 3, 4],
};

const RecruitDetailPage = ({ groupInfo }: { groupInfo: GroupList }) => {
  const NotificationState = [
    { title: '요일/시간', detail: `매주 ${groupInfo.day} ${groupInfo.time}` },
    { title: '활동 장소', detail: `매주 ${groupInfo.region}` },
    {
      title: '참여 인원',
      detail: `${groupInfo.userGroup.length}/${groupInfo.participant_limit}`,
    },
    { title: '소통 방법', detail: `${groupInfo.open_chat_link}` },
  ];

  return (
    <AuthRequiredPage>
      <div className='h-full bg-white'>
        <div className='w-full h-[17.5rem] bg-[#FFFCEA]' />
        <main className='flex flex-col bg-white relative -top-10 px-5 rounded-t-[1.875rem] pb-20'>
          <div className='flex py-6'>
            <Avatar
              src={GROUPLEADER.profileImg}
              shape='circle'
              placeholder=''
              lazy={false}
              alt='모임장 프로필 이미지'
              width='w-[3.375rem]'
              height='h-[3.375rem]'
            />
            <div className='pl-4'>
              <h3 className='text-sm text-[#67A68A]'>
                {groupInfo.recruitment_status ? '모집중' : '모집완료'}
              </h3>
              <h1 className='text-xl font-bold'>{groupInfo.name}</h1>
            </div>
          </div>
          <p>{groupInfo.description}</p>
          <div className='w-full h-[1px] bg-[#EBEAEA] my-8' />
          <h3 className='text-[#67A68A] text-sm'>자세한 정보 알려드려요</h3>
          <h2 className='pt-1 pb-6 text-xl font-bold'>안내사항</h2>
          {NotificationState.map(({ title, detail }) => (
            <RecruitNotification
              key={title}
              title={title}
              detail={detail}
              meetingType={groupInfo.meeting_type === 'online'}
              isMember={DUMMY.isMember}
            />
          ))}
          <div className='w-full h-[1px] bg-[#EBEAEA] my-8' />
          <h3 className='text-[#67A68A] text-sm'>
            함께 독서하며 소통하고 있어요
          </h3>
          <div className='flex items-center justify-between pb-5'>
            <h2 className='pt-1 text-xl font-bold'>멤버 소개</h2>
            <Link href={`/recruit/detail/member`}>전체보기</Link>
          </div>
          <div className='flex'>
            {DUMMY.userGroup.map((member) => (
              <div key={member.user_id} className='pr-2'>
                {/**해당 아바타 클릭 시 해당 유저의 책장 페이지로 이동 */}
                <Avatar
                  src={member.profileImg}
                  shape='circle'
                  alt='구성원 프로필 이미지'
                  lazy={false}
                  placeholder=''
                  width='w-[3.1875rem]'
                  height='h-[3.1875rem]'
                />
              </div>
            ))}
          </div>
        </main>
        {!DUMMY.isLeader && (
          <RecruitParticipationControl
            isMember={DUMMY.isMember}
            recruitmentStatus={groupInfo.recruitment_status}
          />
        )}
      </div>
    </AuthRequiredPage>
  );
};

export default RecruitDetailPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['recruitDetail'], () =>
    getReadingGroupInfo(context.query.groupId as string),
  );

  return {
    props: {
      groupInfo: dehydrate(queryClient).queries[0].state.data,
    },
  };
};
