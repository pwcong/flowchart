import {
  mxUtils,
  mxCodec,
  mxClient,
  mxEvent,
} from '../components/mxgraph';
import {
  IConfig,
  IChartConfig,
  ICell,
  ICellGeometry,
  EChartLayout,
} from '../types';
/**
 * 加载绘图数据
 * @param graph 绘图对象
 * @param xml 绘图数据
 */
export function loadXml(graph, xml: string) {
  const xmlDoc = mxUtils.parseXml(xml);
  const dec = new mxCodec(xmlDoc);
  const node = xmlDoc.documentElement;
  dec.decode(node, graph.getModel());
}

/**
 * 导出绘图数据
 * @param graph 绘图对象
 * @param pretty 格式化输出
 */
export function exportXml(graph, pretty?: boolean) {
  const enc = new mxCodec(mxUtils.createXmlDocument());
  const node = enc.encode(graph.getModel());
  const xml = pretty ? mxUtils.getPrettyXml(node) : mxUtils.getXml(node);
  return xml;
}

/**
 * 展开节点
 * @param cells 节点映射
 */
export function expandCells(cells) {
  return Object.keys(cells).map((k) => cells[k]);
}

/**
 * 获取节点对象
 * @param graph 绘图对象
 * @param id 节点ID
 */
export function getCell(graph, id: string) {
  return graph.model.getCell(id);
}

/**
 * 获取节点列表
 * @param graph 绘图对象
 */
export function getCells(graph) {
  return expandCells(graph.getModel().cells || {});
}

/**
 * 获取子节点
 * @param graph 绘图对象
 * @param id 节点ID
 * @param first 首节点
 * @param map 节点字典
 */

export function getChildCellsMap(
  graph,
  id: string,
  first?: boolean,
  map?: Map<string, any>
) {
  map = map || new Map<string, any>();

  const cell = getCell(graph, id);

  if (!cell) {
    return map;
  }

  if (first === false) {
    map.set(cell.id, cell);
  }

  const outgoingEdges = graph.model.getOutgoingEdges(cell);
  for (let i = 0, l = outgoingEdges.length; i < l; i++) {
    const t = outgoingEdges[i];
    map.set(t.id, t);
    if (t.target && !map.has(t.target.id)) {
      getChildCellsMap(graph, t.target.id, false, map);
    }
  }

  return map;
}

/**
 * 获取子线条
 * @param graph 绘图对象
 * @param id 节点ID
 */
export function getChildEdges(graph, id: string) {
  return Array.from(getChildCellsMap(graph, id).values()).filter((c) =>
    graph.model.isEdge(c)
  );
}

/**
 * 获取子节点
 * @param graph 绘图对象
 * @param id 节点ID
 */
export function getChildVertexs(graph, id: string) {
  return Array.from(getChildCellsMap(graph, id).values()).filter((c) =>
    graph.model.isVertex(c)
  );
}

/**
 * 包含节点样式
 * @param cell 节点
 * @param style 样式
 */
export function hasStyle(cell, style: string) {
  return (cell.getStyle() || '').indexOf(style) >= 0;
}

/**
 * 预制节点样式
 * @param graph 绘图对象
 * @param key 键值
 * @param style 样式
 */
export function putStyle(graph, key, style: object) {
  const styleObj = new Object();
  Object.keys(style).forEach((k) => (styleObj[k] = style[k]));
  graph.getStylesheet().putCellStyle(key, styleObj);
}

/**
 * 更新对象
 * @param graph 绘图对象
 * @param cells 操作对象
 * @param updater 更新操作
 */
export function updateCells(
  graph,
  cells: Array<any>,
  updater: (graph, cell, index: number, cells: Array<any>) => void
) {
  graph.model.beginUpdate();
  try {
    for (let i = 0, l = cells.length; i < l; i++) {
      const cell = graph.model.getCell(cells[i].id);
      cell && updater(graph, cell, i, cells);
    }
  } finally {
    graph.model.endUpdate();
  }
}

/**
 * 判断是否为滚轮事件
 * @param evt 事件对象
 */
export function isZoomWheelEvent(evt) {
  return mxClient.IS_MAC ? mxEvent.isMetaDown(evt) : mxEvent.isControlDown(evt);
}

/**
 * 获取拓展配置信息
 * @param config 绘图配置
 */
export function getChartConfig(config: IConfig): IChartConfig {
  const {
    editable = true,
    menubar = {
      data: [],
      map: {},
    },
    toolbar = {
      data: [],
      map: {},
    },
    onSelectCells = () => {},
    afterUpdateCells = () => {},
    layout = EChartLayout.hierarchical,
  } = config;

  return {
    editable,
    menubar,
    toolbar,
    onSelectCells,
    afterUpdateCells,
    layout,
  };
}

/**
 * 获取默认坐标参数
 * @param cell 节点配置
 */
export function getDefaultGeometry(cell: ICell) {
  const geo = cell.geometry || ({} as ICellGeometry);

  const { x = 0, y = 0, width = 50, height = 50 } = geo;

  return {
    width,
    height,
    x,
    y,
  };
}

/**
 * 获取中心坐标
 * @param cell 节点对象
 */
export function getCenterGeometry(cell) {
  const geo = cell.getGeometry() || {};

  const { x = 0, y = 0, width = 50, height = 50 } = geo;

  return {
    width,
    height,
    x: x + width / 2,
    y: y + height / 2,
  };
}
