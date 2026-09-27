// クリック起因のイベントが Enter/Space などキーボード操作から発火した場合、MouseEvent.detail が 0 になる
// (マウスクリックはクリック回数を示す1以上の値を持つ)。この非自明な仕様を判定名として一箇所に集約する
export const isKeyboardActivatedClick = (e: Pick<MouseEvent, 'detail'>) => e.detail === 0;
