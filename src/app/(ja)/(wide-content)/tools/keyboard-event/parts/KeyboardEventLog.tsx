export type KeyboardEventLog = {
  type: string;
  getModifierState: ReturnType<KeyboardEvent['getModifierState']>;
  timestamp: string;
} & Pick<
  KeyboardEvent,
  'key' | 'code' | 'location' | 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey' | 'repeat' | 'isComposing'
>;

interface Props {
  inputLog: KeyboardEventLog[];
}

export const KeyboardEventLog = ({ inputLog }: Props) => {
  return (
    <div className="scroll-hint-x overflow-x-auto rounded-lg p-4">
      <table className="min-w-full text-sm">
        <thead className="bg-[#00000022]">
          <tr>
            <th>
              <a href="https://www.w3.org/TR/uievents/#events-keyboard-types" translate="no" hrefLang="en">
                type
              </a>{' '}
              <span className="block text-xs font-normal">イベント名</span>
            </th>
            <th>
              <a href="https://www.w3.org/TR/uievents/#dom-keyboardevent-key" translate="no" hrefLang="en">
                key
              </a>{' '}
              <span className="block text-xs font-normal">キー名</span>
            </th>
            <th>
              <a href="https://www.w3.org/TR/uievents/#dom-keyboardevent-code" translate="no" hrefLang="en">
                code
              </a>{' '}
              <span className="block text-xs font-normal">キーコード</span>
            </th>
            <th>
              <a href="https://www.w3.org/TR/uievents/#dom-keyboardevent-location" translate="no" hrefLang="en">
                location
              </a>{' '}
              <span className="block text-xs font-normal">キーの種別</span>
            </th>
            <th>
              <a href="https://www.w3.org/TR/uievents/#dom-keyboardevent-ctrlkey" translate="no" hrefLang="en">
                ctrlKey
              </a>
              <span className="block text-xs font-normal">を押下中</span>
            </th>
            <th>
              <a href="https://www.w3.org/TR/uievents/#dom-keyboardevent-shiftkey" translate="no" hrefLang="en">
                shiftKey
              </a>
              <span className="block text-xs font-normal">を押下中</span>
            </th>
            <th>
              <a href="https://www.w3.org/TR/uievents/#dom-keyboardevent-altkey" translate="no" hrefLang="en">
                altKey
              </a>
              <span className="block text-xs font-normal">を押下中</span>
            </th>
            <th>
              <a href="https://www.w3.org/TR/uievents/#dom-keyboardevent-metakey" translate="no" hrefLang="en">
                metaKey
              </a>
              <span className="block text-xs font-normal">を押下中</span>
            </th>
            <th>
              <a href="https://www.w3.org/TR/uievents/#dom-keyboardevent-repeat" translate="no" hrefLang="en">
                repeat
              </a>{' '}
              <span className="block text-xs font-normal">長押し中</span>
            </th>
            <th>
              <a href="https://www.w3.org/TR/uievents/#dom-keyboardevent-iscomposing" translate="no" hrefLang="en">
                isComposing
              </a>{' '}
              <span className="block text-xs font-normal">IMEが使用中</span>
            </th>
            <th>
              <a href="https://www.w3.org/TR/uievents/#dom-keyboardevent-getmodifierstate" translate="no" hrefLang="en">
                getModifierState(key)
              </a>{' '}
              <span className="block text-xs font-normal">押下またはロック中の修飾キーか</span>
            </th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {inputLog.map((log, index) => (
            <tr key={index}>
              <td>
                <code>{log.type}</code>
              </td>
              <td>
                <kbd>{log.key}</kbd>
              </td>
              <td>
                <code>{log.code}</code>
              </td>
              <td>{log.location}</td>
              <td className={log.ctrlKey ? 'text-(--v-true)' : 'text-(--v-false)'}>{log.ctrlKey ? 'true' : 'false'}</td>
              <td className={log.shiftKey ? 'text-(--v-true)' : 'text-(--v-false)'}>
                {log.shiftKey ? 'true' : 'false'}
              </td>
              <td className={log.altKey ? 'text-(--v-true)' : 'text-(--v-false)'}>{log.altKey ? 'true' : 'false'}</td>
              <td className={log.metaKey ? 'text-(--v-true)' : 'text-(--v-false)'}>{log.metaKey ? 'true' : 'false'}</td>
              <td className={log.repeat ? 'text-(--v-true)' : 'text-(--v-false)'}>{log.repeat ? 'true' : 'false'}</td>
              <td className={log.isComposing ? 'text-(--v-true)' : 'text-(--v-false)'}>
                {log.isComposing ? 'true' : 'false'}
              </td>
              <td className={log.getModifierState ? 'text-(--v-true)' : 'text-(--v-false)'}>
                {log.getModifierState ? 'true' : 'false'}
              </td>
              <td className="text-xs leading-none">{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
