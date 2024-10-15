import Image, { ImageProps } from 'next/image';

export const SampleImage = ({
  filename,
  alt = '',
  ...props
}: Pick<ImageProps, 'height' | 'width' | 'title'> & {
  filename: string;
  longdesc?: string;
  alt?: string;
}) => {
  return <Image src={`/documents/translations/pauljadam-modern-web-a11y-demos/img${filename}`} {...props} alt={alt} />;
};
