'use client';

import { useId, useState } from 'react';
import styles from './NotesSearch.module.css';

export const NotesSearch = () => {
  const id = useId();
  const [keyword, setKeyword] = useState('');

  const onSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form =
      document.querySelector<HTMLFormElement>('form[action="https://www.google.com/search"]') ??
      document.createElement('form');
    form.replaceChildren();
    form.action = 'https://www.google.com/search';
    form.method = 'get';
    const input = document.createElement('input');
    input.name = 'q';
    input.value = `site:uga.dev/notes/ ${keyword}`;
    form.append(input);
    document.body.append(form);
    form.submit();
  };

  return (
    <form role="search" className={styles.root} onSubmit={onSubmit}>
      <p>
        <label htmlFor={id} className={styles.label}>
          サイト内検索
        </label>
        <span className={styles.field}>
          <input
            type="search"
            id={id}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ここにキーワードを入力"
            required
          />
          <button type="submit">検索</button>
        </span>
      </p>
    </form>
  );
};
