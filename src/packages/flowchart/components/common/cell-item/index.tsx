import React from 'react';

import classnames from 'classnames';

import { useClosuer } from '../../../utils/hook';
import { IBaseProps, ICell, ICellListenerCallback } from '../../../types';
import EditorUI from '../../editorui';

export interface IProps extends IBaseProps {
  editorUI: EditorUI;
  data: ICell;
}

export const cls = 'bpm-flowchart-cell-item';

export const Item: React.FunctionComponent<IProps> = (props) => {
  const { className, style, editorUI, data } = props;

  const ref = React.useRef<HTMLDivElement | null>(null);

  const [key, setKey] = React.useState<number>(0);

  const { listeners = [] } = data;

  const listenersCallback = {};
  listeners.forEach(
    (l) =>
      (listenersCallback[l.name] = useClosuer<ICellListenerCallback>(
        (event) => {
          l.callback(
            {
              event,
              element: ref.current,
              render: () => setKey(key + 1),
            },
            editorUI,
            data
          );
        }
      ))
  );

  React.useEffect(() => {
    ref &&
      ref.current &&
      data.onInitial &&
      data.onInitial(ref.current, editorUI, data);

    listeners.forEach((l) =>
      editorUI.graph.addListener(l.name, listenersCallback[l.name])
    );

    return () => {
      data.onDestroy && data.onDestroy(editorUI, data);

      listeners.forEach((l) =>
        editorUI.graph.removeListener(listenersCallback[l.name])
      );
    };
  }, [editorUI, data]);

  const itemProps = {
    style,
    className: classnames(cls, className),
  };

  let cmpt = <div {...itemProps}>{data.component}</div>;

  if (data.getComponent) {
    cmpt = data.getComponent(cmpt, editorUI, data);
  }

  return React.cloneElement(cmpt, {
    ref,
    key,
  });
};

export default Item;
