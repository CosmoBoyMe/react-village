import { Feedback } from './Feedback';

type RoomData = {
  roomNumber: number;
  furniture: { id: string; limit: number }[];
  capacity: { id: string; limit: number }[];
  reservedDates: { from: string; to: string }[];
  bookedDates?: {
    [key: string]: {
      dates: { from: string; to: string };
      userId: string;
    };
  };
  details: {
    withTV?: boolean;
    withBabyBed?: boolean;
    withBabyChair?: boolean;
    withBreakfast?: boolean;
    withDesk?: boolean;
    withGuests?: boolean;
    withShampoo?: boolean;
    withWideHallway?: boolean;
    withAssistance?: boolean;
    withPets?: boolean;
    canSmoke?: boolean;
  };

  reviews?: {
    [key: string]: {
      profilePicture: string;
      userId: string;
    };
  };

  feedback?: Feedback;
  images: string[];
  imagesDetailed: string[];
  isLux: boolean;
  price: number;
  rating: number;
  reviewsCount: number;
  information: {
    [key: string]: boolean;
  };
  votes?: { count: number; rating: number }[];
  comments?: {
    avatar: string;
    date: string;
    likeCount: number;
    name: string;
    text: string;
    isLiked: boolean;
    id: number;
  }[];
};

export type { RoomData };
