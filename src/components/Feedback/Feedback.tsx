import { FC } from 'react';

import defaultAvatar from '../../assets/img/default-avatar.jpg';
import { getDateName } from '../../shared/helpers/getDateName/getDateName';
import { FeedbackForm } from '../FeedbackForm/FeedbackForm';
import { LikeButton } from '../LikeButton/LikeButton';

import './Feedback.scss';

type Props = {
  name: string;
  date: Date;
  text: string;
  likeCount: number;
  profilePicture?: string;
  isLiked?: boolean;
  isReplyAllowed?: boolean;
  path?: string;
  onClick?: (status: boolean, path: string) => void;
  onSubmit?: (parentId: string, text: string) => void;
};

const Feedback: FC<Props> = ({
  name,
  date,
  text,
  likeCount,
  profilePicture = defaultAvatar,
  isLiked = false,
  isReplyAllowed = false,
  path = '',
  onClick,
  onSubmit,
}) => {
  const handleFeedbackSubmit = (replyText: string) => {
    onSubmit?.(replyText, path);
  };

  const handleFeedbackLike = (isFeedbackLiked: boolean) => {
    onClick?.(isFeedbackLiked, path);
  };

  return (
    <div className="feedback">
      <img
        className="feedback__image"
        src={profilePicture}
        alt="аватар автора отзыва"
      />
      <span className="feedback__name">{name.toLowerCase()}</span>
      <span className="feedback__date">{getDateName(date)}</span>
      <div className="feedback__like">
        <LikeButton
          likesAmount={likeCount}
          isLiked={isLiked}
          isActive={isReplyAllowed}
          onClick={handleFeedbackLike}
        />
      </div>
      <p className="feedback__description">{text}</p>
      {isReplyAllowed && (
        <details className="feedback__feedback-form">
          <summary className="feedback__summary">Ответить</summary>
          <FeedbackForm buttonText="Ответить" onSubmit={handleFeedbackSubmit} />
        </details>
      )}
    </div>
  );
};

export { Feedback };
