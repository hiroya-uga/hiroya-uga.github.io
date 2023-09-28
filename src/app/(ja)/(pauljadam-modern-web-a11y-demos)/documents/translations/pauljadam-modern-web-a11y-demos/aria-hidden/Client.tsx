'use client';

export const Tab = () => {
  const showTab = (arg: number) => {
    alert(`arg - ${arg}\nTODO: fix error - showTab is not defined`);
  };

  return (
    <>
      <ul id="tabs" role="tablist">
        <li role="presentation none">
          <a id="tab1" href="#" onClick={() => showTab(1)} role="tab" aria-controls="panel1" aria-selected="true">
            <span className="hidden" aria-hidden="true">
              選択された
            </span>
            タブ1
          </a>
        </li>
        <li role="presentation none">
          <a id="tab2" href="#" onClick={() => showTab(2)} role="tab" aria-controls="panel2" aria-selected="false">
            タブ2
          </a>
        </li>
        <li role="presentation none">
          <a id="tab3" href="#" onClick={() => showTab(3)} role="tab" aria-controls="panel3" aria-selected="false">
            タブ3
          </a>
        </li>
      </ul>

      <div id="panel1" role="tabpanel" aria-labelledby="tab1">
        ...
      </div>
      <div id="panel2" role="tabpanel" aria-labelledby="tab2" hidden>
        ...
      </div>
      <div id="panel3" role="tabpanel" aria-labelledby="tab3" hidden>
        ...
      </div>
    </>
  );
};
