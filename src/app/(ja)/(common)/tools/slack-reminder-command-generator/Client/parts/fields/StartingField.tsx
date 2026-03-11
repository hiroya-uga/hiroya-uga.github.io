import type { SlackReminder } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import { TextField } from '@/components/Form';

type StartingValue = SlackReminder.FormState['starting'];

type Props = {
  value: StartingValue;
  handleChange: (value: StartingValue) => void;
};

export const StartingField = ({ value, handleChange }: Props) => {
  return (
    <div className="not-last:mb-10">
      <TextField
        type="date"
        label="開始日"
        description="指定すると、その日時以降の次の該当タイミングからリマインダーが開始されます。"
        value={value}
        onInput={(e) => handleChange(e.currentTarget.value)}
      />
    </div>
  );
};
