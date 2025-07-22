import styles from '@/components/Table/Table.module.css';

type Props = {
  children: React.ReactElement | React.ReactElement[];
};

export const Table = (props: Props) => {
  return (
    <div className={`${styles.root} scroll-hint-x`}>
      <table {...props} />
    </div>
  );
};
