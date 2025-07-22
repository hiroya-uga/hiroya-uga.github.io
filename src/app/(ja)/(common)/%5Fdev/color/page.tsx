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

const TextColor = () => {
  return (
    <>
      <ul className="mb-8 grid grid-cols-4 gap-4">
        {[
          // new
          'text-primary',
          'text-secondary',
          'text-tertiary',
          'text-quaternary',
          'text-link',
          'text-alert',
        ].map((color) => (
          <li key={color}>
            <div className="size-100PX" style={{ background: `var(${color.replace('text', '--color')})` }}></div>
            <div className={`text-sm ${color}`}>{`.${color}`}</div>
          </li>
        ))}
      </ul>

      <Table>
        <thead>
          <tr>
            <th>CSS Variable</th>
            <th>Color</th>
            <th>Example1</th>
            <th>Example2</th>
          </tr>
        </thead>
        <tbody>
          {[
            // new
            '--v-color-text-primary',
            '--v-color-text-secondary',
            '--v-color-text-tertiary',
            '--v-color-text-quaternary',
            '--v-color-text-link',
            '--v-color-text-alert',
          ].map((color) => (
            <tr key={color}>
              <th>{color}</th>
              <td style={{ color: `var(${color})` }}>Example</td>
              <td style={{ color: `var(${color})` }}>Example</td>
              <td style={{ color: `var(${color})` }}>Example</td>
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
          '--v-color-text-tertiary': 'ハイコントラストベーステキスト',
          '--v-color-text-quaternary': '逆ハイコントラストベーステキスト',
          '--v-color-text-error': 'エラーテキスト',
          '--v-color-text-link': 'リンクテキスト',
          '--v-color-background-primary': '背景色1',
          '--v-color-background-secondary': '背景色2',
          '--v-color-background-tertiary': '背景色3',
          '--v-color-background-success': '背景色：成功',
          '--v-color-background-warn': '背景色：警告',
          '--v-color-background-error': '背景色：エラー',
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
      <Heading level={2}>Tags</Heading>
      <div className="px-4">
        <ul className="transition-bg border-primary rounded-lg border p-4">
          {['bg-tag-success', 'bg-tag-warn', 'bg-tag-error'].map((key) => (
            <li key={key} className={`${key} text-tertiary text-sm`}>
              {key}
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
              {[
                // new
                '--v-color-text-primary',
                '--v-color-text-link',
                '--v-color-text-alert',
              ].map((color) => (
                <div key={color} className="text-sm" style={{ color: `var(${color})` }}>
                  {color}
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
          '--v-color-background-table',
          '--v-color-background-table-header',
          '--v-color-border-textfield',
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
