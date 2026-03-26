import { TextLink } from '@/components/Clickable';

interface Props {
  lang: 'ja' | 'en';
}

export const PrivacyPolicyMessage = ({ lang }: Props) => {
  if (lang === 'ja') {
    return (
      <>
        入力された値は収集されたり外部に送信されることはありません。
        <span className="inline-block">
          詳しくは
          <TextLink href="/privacy-policy">プライバシーポリシー</TextLink>をご覧ください。
        </span>
      </>
    );
  }

  return (
    <>
      The entered values will not be collected or sent to the outside.
      <span className="inline-block">
        For more details, please see our
        <TextLink href="/privacy-policy" hrefLang="ja">
          Privacy Policy（Japanese）
        </TextLink>
        .
      </span>
    </>
  );
};
