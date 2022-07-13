import React from 'react';
import {Box} from 'theme-ui';
import {Link} from 'react-router-dom';

import type {Inbox, OnboardingStatus} from '../../types';
import {colors, Button, Divider, Text} from '../common';
import {CheckOutlined} from '../icons';

type StepMetadata = {
  completed?: boolean;
  ctaHref: string;
  ctaText: string;
  text: React.ReactElement;
};

type StepsProps = {
  onboardingStatus: OnboardingStatus;
  inbox: Inbox;
};

const Steps = ({onboardingStatus, inbox}: StepsProps) => {
  const stepsMetadata: Array<StepMetadata> = getStepsMetadata(
    onboardingStatus,
    inbox
  );

  return (
    <>
      {stepsMetadata.map((stepMetadata, index) => (
        <Step {...stepMetadata} value={index + 1} key={stepMetadata.ctaText} />
      ))}
    </>
  );
};

const getStepsMetadata = (
  onboardingStatus: OnboardingStatus,
  inbox: Inbox
): Array<StepMetadata> => {
  const {id: inboxId} = inbox;

  return [
    {
      completed: onboardingStatus.has_configured_inbox,
      ctaHref: `/inboxes/${inboxId}`,
      ctaText: '配置您的收件箱',
      text: (
        <>
          <Text strong>配置您的收件箱</Text> 开始通过以下方式接收信息{' '}
          <Link to={`/inboxes/${inboxId}/chat-widget`}>实时聊天</Link>{' '}
          和其他渠道.
        </>
      ),
    },
    {
      completed: onboardingStatus.has_configured_profile,
      ctaHref: '/settings/profile',
      ctaText: '设置资料',
      text: (
        <>
          <Text strong>设置你的个人资料</Text> 使你的客户有个性化的体验。
        </>
      ),
    },
    {
      completed: onboardingStatus.has_invited_teammates,
      ctaHref: '/settings/team',
      ctaText: '邀请团队成员',
      text: (
        <>
          <Text strong>邀请你的团队成员</Text> 与你的客户建立联系并提供支持。
        </>
      ),
    },
    {
      completed: onboardingStatus.has_integrations,
      ctaHref: '/integrations',
      ctaText: '添加集成',
      text: (
        <>
          <Text strong>连接更多的集成</Text> 以充分利用 Papercups。
        </>
      ),
    },
    {
      completed: onboardingStatus.has_upgraded_subscription,
      ctaHref: '/settings/billing',
      ctaText: '账户设置',
      text: <>配置工作时间、对话提醒、团队信息等。</>,
    },
  ];
};

type StepProps = {
  completed?: boolean;
  ctaHref: string;
  ctaText: string;
  text: React.ReactNode;
  value: number;
};

const Step = ({completed, ctaHref, ctaText, text, value}: StepProps) => {
  const opacity = completed ? 0.6 : 1;

  return (
    <>
      <Box p={3} sx={{display: 'flex', alignItems: 'center'}}>
        <StepIcon value={value} completed={completed} />
        <Box mx={3} mr={4} sx={{flexGrow: 1, opacity}}>
          {text}
        </Box>
        <Link
          to={ctaHref}
          style={{
            alignContent: 'flex-end',
          }}
        >
          <Button type="default">{ctaText}</Button>
        </Link>
      </Box>
      <Divider />
    </>
  );
};

type StepIconProps = {
  completed?: boolean;
  value: number;
};

const StepIcon = ({completed, value}: StepIconProps) => {
  const styles = {
    alignItems: 'center',
    borderRadius: '50%',
    display: 'flex',
    height: '32px',
    justifyContent: 'center',
    minWidth: '32px',
    width: '32px',
  };

  if (completed) {
    return (
      <Box
        sx={{
          ...styles,
          backgroundColor: colors.primary,
          color: colors.white,
        }}
      >
        <CheckOutlined />
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          ...styles,
          border: `1px solid ${colors.primary}`,
          color: colors.primary,
        }}
      >
        {value}
      </Box>
    );
  }
};

export default Steps;
