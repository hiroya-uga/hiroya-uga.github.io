import { SITE_NAME } from '@/constants/meta';
import { Metadata } from 'next';

import { NotFoundClient } from '@/app/NotFoundClient';

export const metadata: Metadata = {
  title: `HTTP 404 未検出 - ${SITE_NAME}`,
};

export default function NotFound() {
  return <NotFoundClient />;
}
