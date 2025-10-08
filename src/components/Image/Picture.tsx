'use client';

import Image from 'next/image';

import styles from '@/components/Image/Picture.module.css';
import { forwardRef } from 'react';

type Props = React.ComponentProps<typeof Image> & {
  alt: string;
};

const PictureComponent = (props: Props, ref: React.Ref<HTMLImageElement>) => {
  const { priority, loading, ...restProps } = props;

  return (
    <Image
      {...restProps}
      ref={ref}
      className={`${styles.root} ${props.className || ''}`.trim()}
      alt={props.alt}
      priority={priority ?? false}
      loading={priority ? undefined : (loading ?? 'lazy')}
      data-image-status="loading"
      onLoad={(e) => {
        e.currentTarget.removeAttribute('data-image-status');
        props.onLoad?.(e);
      }}
    />
  );
};

export const Picture = forwardRef(PictureComponent);
