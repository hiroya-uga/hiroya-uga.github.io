import { Metadata as MetadataOrigin } from 'next';

export type Metadata = MetadataOrigin & {
  title: string;
};
