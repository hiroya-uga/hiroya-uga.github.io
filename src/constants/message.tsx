import { TextLink } from '@/components/Clickable';

export const PrivacyPolicyMessage = () => {
  return (
    <>
      入力された値は収集されたり外部に送信されることはありません。
      <span className="inline-block">
        詳しくは
        <TextLink href="/privacy-policy">プライバシーポリシー</TextLink>をご覧ください。
      </span>
    </>
  );
};
