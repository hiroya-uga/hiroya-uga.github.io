import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SlackReminderCommandGenerator } from '../';

describe('SlackReminderCommandGenerator', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
    vi.setSystemTime(new Date('2026-03-07T21:34:56').getTime());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const getPreviewText = () => {
    const remindToken = screen.getByText('/remind');
    const preview = remindToken.parentElement;

    expect(preview).not.toBeNull();
    return preview?.textContent;
  };

  const setCommonFields = async ({ who, message }: { who: string; message: string }) => {
    const user = userEvent.setup();
    const whoInput = screen.getByLabelText('宛先');
    const messageInput = screen.getByLabelText('本文');

    await user.clear(whoInput);
    await user.type(whoInput, who);
    await user.clear(messageInput);
    await user.type(messageInput, message);

    return user;
  };

  describe('毎日・毎週', () => {
    it('宛先・本文・毎週水曜日の設定がリザルトと一致する', async () => {
      render(<SlackReminderCommandGenerator />);

      const who = '@team-channel';
      const message = '定例MTG';
      const time = '21:00'; // new Date()のモックが返す時間に合わせて21:00に設定

      const user = await setCommonFields({ who, message });
      const dailyWeeklyPanel = screen.getByRole('tabpanel', { name: '毎日・毎週' });
      const wednesdayCheckbox = within(dailyWeeklyPanel).getByLabelText('水曜日');

      await user.click(wednesdayCheckbox);
      const previewText = getPreviewText();

      expect(previewText).toBe(`/remind ${who} "${message}" every Wednesday at ${time}`);
    });

    it('時間の値を削除すると午前9時が設定される', async () => {
      render(<SlackReminderCommandGenerator />);

      const user = userEvent.setup({ delay: null });
      const dailyWeeklyPanel = screen.getByRole('tabpanel', { name: '毎日・毎週' });
      const timeInput = within(dailyWeeklyPanel).getByLabelText('通知時刻');

      await user.clear(timeInput);

      const previewText = getPreviewText();
      expect(previewText).toContain(' at 9:00');
    });

    describe('平日チェックボックスの挙動', () => {
      it('「平日」を選ぶと every weekday になる', async () => {
        render(<SlackReminderCommandGenerator />);

        const user = userEvent.setup({ delay: null });
        const panel = screen.getByRole('tabpanel', { name: '毎日・毎週' });
        const weekdayCheckbox = within(panel).getByLabelText('平日');

        await user.click(weekdayCheckbox);

        expect(getPreviewText()).toContain('every weekday');
      });

      it('「土曜日」「日曜日」「平日」をすべて選ぶと every day になる', async () => {
        render(<SlackReminderCommandGenerator />);

        const user = userEvent.setup({ delay: null });
        const panel = screen.getByRole('tabpanel', { name: '毎日・毎週' });

        await user.click(within(panel).getByLabelText('土曜日'));
        await user.click(within(panel).getByLabelText('日曜日'));
        await user.click(within(panel).getByLabelText('平日'));

        expect(getPreviewText()).toContain('every day');
      });

      it('「平日」を選んで「月曜日」を外すと「平日」チェックボックスも unchecked になる', async () => {
        render(<SlackReminderCommandGenerator />);

        const user = userEvent.setup({ delay: null });
        const panel = screen.getByRole('tabpanel', { name: '毎日・毎週' });
        const weekdayCheckbox = within(panel).getByLabelText<HTMLInputElement>('平日');
        const mondayCheckbox = within(panel).getByLabelText<HTMLInputElement>('月曜日');

        await user.click(weekdayCheckbox);
        expect(weekdayCheckbox.checked).toBe(true);

        await user.click(mondayCheckbox);
        expect(weekdayCheckbox.checked).toBe(false);
      });

      it('「土曜日」「日曜日」「平日」を選んだ後に「平日」を外しても土日のチェックは維持される', async () => {
        render(<SlackReminderCommandGenerator />);

        const user = userEvent.setup({ delay: null });
        const panel = screen.getByRole('tabpanel', { name: '毎日・毎週' });
        const saturdayCheckbox = within(panel).getByLabelText<HTMLInputElement>('土曜日');
        const sundayCheckbox = within(panel).getByLabelText<HTMLInputElement>('日曜日');
        const weekdayCheckbox = within(panel).getByLabelText('平日');

        await user.click(saturdayCheckbox);
        await user.click(sundayCheckbox);
        await user.click(weekdayCheckbox);
        await user.click(weekdayCheckbox);

        expect(saturdayCheckbox.checked).toBe(true);
        expect(sundayCheckbox.checked).toBe(true);
      });
    });
  });

  it('毎週の開始日あり設定がリザルト textContent と一致する', async () => {
    render(<SlackReminderCommandGenerator />);

    const who = '@team';
    const message = '週次報告';
    const time = '11:00';
    const starting = '2026-04-01';

    const user = await setCommonFields({ who, message });
    const dailyWeeklyPanel = screen.getByRole('tabpanel', { name: '毎日・毎週' });
    const timeInput = within(dailyWeeklyPanel).getByLabelText('通知時刻');
    const wednesdayCheckbox = within(dailyWeeklyPanel).getByLabelText('水曜日');
    const startingInput = within(dailyWeeklyPanel).getByLabelText('開始日');

    await user.click(wednesdayCheckbox);
    await user.clear(timeInput);
    await user.type(timeInput, time);
    await user.clear(startingInput);
    await user.type(startingInput, starting);

    const previewText = getPreviewText();
    expect(previewText).toBe(`/remind ${who} "${message}" every Wednesday at ${time} starting ${starting}`);
  });

  it('隔週設定がリザルト textContent と一致する', async () => {
    render(<SlackReminderCommandGenerator />);

    const who = '@qa';
    const message = '隔週定例';
    const time = '10:15';

    const user = await setCommonFields({ who, message });
    await user.click(screen.getByRole('tab', { name: '隔週' }));

    const biweeklyPanel = screen.getByRole('tabpanel', { name: '隔週' });
    const wednesdayRadio = within(biweeklyPanel).getByLabelText('水曜日');
    const timeInput = within(biweeklyPanel).getByLabelText('通知時刻');

    await user.click(wednesdayRadio);
    await user.clear(timeInput);
    await user.type(timeInput, time);

    const previewText = getPreviewText();
    expect(previewText).toBe(`/remind ${who} "${message}" every other Wednesday at ${time}`);
  });

  describe('毎月', () => {
    it('毎月設定がリザルト textContent と一致する', async () => {
      render(<SlackReminderCommandGenerator />);

      const who = '#general';
      const message = '請求締め';
      const time = '08:45';

      const user = await setCommonFields({ who, message });
      await user.click(screen.getByRole('tab', { name: '毎月' }));

      const monthlyPanel = screen.getByRole('tabpanel', { name: '毎月' });
      const dayInput = within(monthlyPanel).getByLabelText('日');
      const timeInput = within(monthlyPanel).getByLabelText('通知時刻');

      await user.clear(dayInput);
      // クリアしても初期値は必ず1になるため、5を入れると15になる
      await user.type(dayInput, '5');
      await user.clear(timeInput);
      await user.type(timeInput, time);

      const previewText = getPreviewText();
      expect(previewText).toBe(`/remind ${who} "${message}" on the 15th every month at ${time}`);
    });

    describe('序数表現・月末の挙動', () => {
      it('序数表現で「第2・木曜日」を選ぶと on the second Thursday every month になる', async () => {
        render(<SlackReminderCommandGenerator />);

        const who = '@team';
        const message = '月次確認';
        const time = '10:00';

        const user = await setCommonFields({ who, message });
        await user.click(screen.getByRole('tab', { name: '毎月' }));

        const monthlyPanel = screen.getByRole('tabpanel', { name: '毎月' });
        await user.click(within(monthlyPanel).getByLabelText('序数表現（e.g. 第3土曜日）'));
        await user.click(within(monthlyPanel).getByLabelText('第2'));
        await user.click(within(monthlyPanel).getByLabelText('木曜日'));

        const timeInput = within(monthlyPanel).getByLabelText('通知時刻');
        await user.clear(timeInput);
        await user.type(timeInput, time);

        expect(getPreviewText()).toBe(`/remind ${who} "${message}" on the second Thursday every month at ${time}`);
      });

      it('月末パターンを選ぶと on the last day every month になる', async () => {
        render(<SlackReminderCommandGenerator />);

        const who = '@finance';
        const message = '月末締め作業';
        const time = '17:00';

        const user = await setCommonFields({ who, message });
        await user.click(screen.getByRole('tab', { name: '毎月' }));

        const monthlyPanel = screen.getByRole('tabpanel', { name: '毎月' });
        await user.click(within(monthlyPanel).getByLabelText('月末'));

        const timeInput = within(monthlyPanel).getByLabelText('通知時刻');
        await user.clear(timeInput);
        await user.type(timeInput, time);

        expect(getPreviewText()).toBe(`/remind ${who} "${message}" on the last day every month at ${time}`);
      });
    });
  });

  it('毎年設定がリザルト textContent と一致する', async () => {
    render(<SlackReminderCommandGenerator />);

    const who = '@all';
    const message = 'クリスマス告知';
    const time = '09:30';

    const user = await setCommonFields({ who, message });
    await user.click(screen.getByRole('tab', { name: '毎年' }));

    const yearlyPanel = screen.getByRole('tabpanel', { name: '毎年' });
    const monthInput = within(yearlyPanel).getByLabelText('月');
    const dayInput = within(yearlyPanel).getByLabelText('日');
    const timeInput = within(yearlyPanel).getByLabelText('通知時刻');

    await user.clear(monthInput);
    await user.type(monthInput, '12');
    await user.clear(dayInput);
    await user.type(dayInput, '25');
    await user.clear(timeInput);
    await user.type(timeInput, time);

    const previewText = getPreviewText();
    expect(previewText).toBe(`/remind ${who} "${message}" on December 25 every year at ${time}`);
  });

  it('繰り返しなし設定がリザルト textContent と一致する', async () => {
    render(<SlackReminderCommandGenerator />);

    const who = 'me';
    const message = '単発タスク';
    const time = '07:20';
    const date = '2026-03-20';

    const user = await setCommonFields({ who, message });
    await user.click(screen.getByRole('tab', { name: '繰り返しなし' }));

    const oneTimePanel = screen.getByRole('tabpanel', { name: '繰り返しなし' });
    const dateInput = within(oneTimePanel).getByLabelText('日付');
    const timeInput = within(oneTimePanel).getByLabelText('通知時刻');

    await user.clear(dateInput);
    await user.type(dateInput, date);
    await user.clear(timeInput);
    await user.type(timeInput, time);

    const previewText = getPreviewText();
    expect(previewText).toBe(`/remind ${who} "${message}" on 03/20/2026 at ${time}`);
  });

  it('開始日を入力後、他タブに移動しても戻っても開始日が保持される', async () => {
    render(<SlackReminderCommandGenerator />);

    const user = userEvent.setup({ delay: null });

    await setCommonFields({ who: '@test', message: 'テスト' });

    // 1. 毎日・毎週タブを選択
    const dailyWeeklyTab = screen.getByRole('tab', { name: '毎日・毎週' });
    await user.click(dailyWeeklyTab);

    const dailyWeeklyPanel = screen.getByRole('tabpanel', { name: '毎日・毎週' });
    const startingInput = within(dailyWeeklyPanel).getByLabelText('開始日');

    // 開始日を入力
    const startingDate = '2026-05-15';
    await user.clear(startingInput);
    await user.type(startingInput, startingDate);

    // starting が入っているか
    expect(getPreviewText()).toContain(`starting ${startingDate}`);

    // 2. 別のタブ（例: 隔週）に移動
    const biweeklyTab = screen.getByRole('tab', { name: '隔週' });
    await user.click(biweeklyTab);

    const startingInputAfterSwitch = within(
      screen.getByRole('tabpanel', { name: '隔週' }),
    ).getByLabelText<HTMLInputElement>('開始日');
    expect(startingInputAfterSwitch.value).toBe(startingDate);

    // 3. もう一度毎日・毎週に戻る
    await user.click(dailyWeeklyTab);

    // 開始日入力欄がまだ存在し、値が保持されているか
    const startingInputAfterBack = within(
      screen.getByRole('tabpanel', { name: '毎日・毎週' }),
    ).getByLabelText<HTMLInputElement>('開始日');

    expect(startingInputAfterBack).toHaveValue(startingDate);

    // プレビューも再確認
    expect(getPreviewText()).toContain(`starting ${startingDate}`);
  });
});
