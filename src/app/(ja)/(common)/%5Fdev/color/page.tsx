import { TextField } from '@/components/Form';
import { Heading } from '@/components/Heading';
import { Table } from '@/components/Table';
import { SITE_NAME } from '@/constants/meta';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `CSS Variables | ${SITE_NAME}`,
  robots: {
    index: false,
    follow: false,
  },
};

const textColors = [
  'text-primary',
  'text-secondary',
  'text-high-contrast',
  'text-high-contrast-reverse',
  'text-link',
  'text-alert',
];

const TextColor = () => {
  return (
    <>
      <ul className="@w640:grid-cols-4 @w400:grid-cols-2 @w500:grid-cols-3 mb-8 grid gap-4">
        {textColors.map((color) => (
          <li key={color}>
            <div className="size-100PX" style={{ background: `var(${color.replace('text', '--color')})` }}></div>
            <div className={`text-sm ${color}`}>{`.${color}`}</div>
          </li>
        ))}
      </ul>

      <Table>
        <thead>
          <tr>
            <th>className</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {textColors.map((className) => (
            <tr key={className}>
              <th>{className}</th>
              <td className={className}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque totam asperiores ad pariatur alias sint
                velit blanditiis voluptates porro placeat sapiente iste, cum harum commodi aut! Voluptatem perferendis
                suscipit nostrum.
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default function Page() {
  return (
    <>
      <Heading level={2}>Color</Heading>
      <div className="@w640:grid-cols-2 @w800:grid-cols-3 grid gap-4 p-4">
        {Object.entries({
          '--v-color-text-primary': 'ベーステキスト',
          '--v-color-text-secondary': 'サブテキスト',
          '--v-color-text-high-contrast': 'ハイコントラストベーステキスト',
          '--v-color-text-high-contrast-reverse': '逆ハイコントラストベーステキスト',
          '--v-color-text-error': 'エラーテキスト',
          '--v-color-text-link': 'リンクテキスト',
          '--v-color-background-primary': '背景色1',
          '--v-color-background-secondary': '背景色2',
          '--v-color-background-tertiary': '背景色3',
          '--v-color-background-success': '背景色：成功',
          '--v-color-background-warn': '背景色：警告',
          '--v-color-background-error': '背景色：エラー',
          '--v-color-border-primary': 'ボーダー色：プライマリー',
          '--v-color-border-secondary': 'ボーダー色：セカンダリー',
          '--v-color-accent': 'アクセント',
        }).map(([color, description]) => (
          <div key={color} className="grid grid-cols-[100px_auto] gap-4">
            <div className="size-100PX block border border-solid" style={{ background: `var(${color})` }}></div>
            <div>
              <div className="text-2xs">{color}</div>
              <div className="font-bold">{description}</div>
            </div>
          </div>
        ))}
      </div>

      <Heading level={2}>Background Color</Heading>
      {[
        // new
        'bg-primary',
        'bg-secondary',
        'bg-tertiary',
      ].map((className) => (
        <div key={className} className={`mb-8 p-8 ${className}`}>
          <Heading level={3}>{`Text Colors on .${className}`}</Heading>

          <div className="px-4">
            <div className="mb-8">
              <TextField label="Example" description="This is an example text field." required />
            </div>
            <TextColor />
          </div>
        </div>
      ))}
      <Heading level={2}>Status</Heading>
      <div className="px-4">
        <ul className="transition-bg border-primary space-y-4">
          {['bg-success', 'bg-warn', 'bg-error'].map((className) => (
            <li key={className} className={`${className} text-high-contrast rounded-lg p-3 text-sm`}>
              {`.${className}`}
            </li>
          ))}
        </ul>
      </div>
      <Heading level={2}>Panels</Heading>
      {Object.entries({ 'bg-panel-primary': 'bg-panel-primary hover:bg-panel-primary-hover' }).map(
        ([key, className]) => (
          <div key={key} className="px-4">
            <Heading level={3}>{key}</Heading>

            <div className={`${className} transition-bg border-primary rounded-lg border p-4`}>
              {textColors.map((className) => (
                <div key={className} className={`text-sm ${className}`}>
                  {className}
                </div>
              ))}
            </div>
          </div>
        ),
      )}
      <Heading level={2}>WIP</Heading>
      <div className="grid grid-cols-4 gap-4">
        {[
          // 既存
          '--v-color-background-alert',
          '--v-color-background-loading',
          '--v-color-background-card',
          '--v-color-background-card-secondary',
          '--v-color-background-required',
          '--v-color-background-scroll-hint',
          '--v-color-background-scroll-hint-shadow',
          '--v-color-background-section-primary',
          '--v-color-background-textfield',
          '--v-color-background-table-header',
        ].map((color) => (
          <div key={color}>
            <span className="size-100PX block" style={{ background: `var(${color})` }}></span>
            <span className="text-secondary text-sm">{color}</span>
          </div>
        ))}
      </div>
    </>
  );
}
