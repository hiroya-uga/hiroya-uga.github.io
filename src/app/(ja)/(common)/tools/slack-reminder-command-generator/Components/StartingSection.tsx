import { TextField } from '@/components/Form';

type StartingProps = {
  value: string;
  dispatch: React.Dispatch<React.SetStateAction<string>>;
};

export const StartingSection = ({ value, dispatch }: StartingProps) => {
  return (
    <div className="[&:not(:last-child)]:mb-8">
      <TextField
        type="date"
        label="開始日"
        description="指定すると、その日時以降の次の該当タイミングからリマインダーが開始されます。"
        value={value}
        onInput={(e) => dispatch(e.currentTarget.value)}
      />
    </div>
  );
};
