import BookImage from './BookImage';

interface Props {
  size: 'small' | 'medium' | 'large';
}

const BookShelf = ({ size }: Props) => {
  return (
    <div
      className={`${
        shelfSize[`shelf-${size}`]
      } bg-gray-400 flex justify-center items-center`}
    >
      <BookImage
        lazy={true}
        placeholder=''
        src='https://image.yes24.com/momo/TopCate1261/MidCate008/70353017.jpg'
        alt='책장 속의 책입니다!'
        onImageClick={() => console.log('hi')}
        feed={`not-feed-${size}`}
      />
    </div>
  );
};

export default BookShelf;

interface shelfSizeType {
  [key: string]: string;
}

const shelfSize: shelfSizeType = {
  'shelf-large': 'aspect-square w-[100%]',
  'shelf-medium': 'aspect-square w-[50%]',
  'shelf-small': 'aspect-square w-[33%]',
};
