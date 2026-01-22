import domtoimage from 'dom-to-image-more';
import FileSaver from 'file-saver';
import { Model, Size } from '../types';
import { icons as availableIcons } from '../examples/initialData';

export const generateGenericFilename = (extension: string) => {
  return `fossflow-export-${new Date().toISOString()}.${extension}`;
};

export const base64ToBlob = (
  base64: string,
  contentType: string,
  sliceSize = 512
) => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });

  return blob;
};

export const downloadFile = (data: Blob, filename: string) => {
  FileSaver.saveAs(data, filename);
};

export const transformToCompactFormat = (model: Model) => {
  const { items, views, icons, title } = model;

  // Compact format: ultra-minimal for LLM generation
  const compactItems = items.map((item, index) => [
    item.name.substring(0, 30), // Truncated name
    item.icon || 'block', // Icon reference only (no base64)
    item.description?.substring(0, 100) || '' // Truncated description
  ]);

  const compactViews = views.map((view) => {
    const positions = view.items.map((viewItem) => {
      const itemIndex = items.findIndex(item => item.id === viewItem.id);
      return [itemIndex, viewItem.tile.x, viewItem.tile.y];
    });

    const connections = view.connectors?.map((connector) => {
      const fromIndex = items.findIndex(item => item.id === connector.anchors[0]?.ref.item);
      const toIndex = items.findIndex(item => item.id === connector.anchors[connector.anchors.length - 1]?.ref.item);
      return [fromIndex, toIndex];
    }).filter(conn => conn[0] !== -1 && conn[1] !== -1) || [];

    return [positions, connections];
  });

  return {
    t: title?.substring(0, 40) || 'Untitled',
    i: compactItems,
    v: compactViews,
    _: { f: 'compact', v: '1.0' }
  };
};

export const transformFromCompactFormat = (compactModel: any): Model => {
  const { t, i, v, _ } = compactModel;

  // Restore from compact format
  const fullItems = i.map((item: any, index: number) => ({
    id: `item_${index}`,
    name: item[0],
    icon: item[1],
    description: item[2] || '' // Restore description if available
  }));

  // Resolve icons from the internal icon library
  const iconSet = new Set<string>();
  i.forEach((item: any) => {
    if (item[1]) iconSet.add(item[1]);
  });

  const fullIcons = Array.from(iconSet).map(iconName => {
    // Find the icon in the available icons library
    const existingIcon = availableIcons.find(icon => icon.id === iconName || icon.name === iconName);
    
    if (existingIcon) {
      // Use the existing icon data with proper URL
      return {
        id: iconName,
        name: existingIcon.name,
        url: existingIcon.url,
        collection: existingIcon.collection,
        isIsometric: existingIcon.isIsometric ?? true
      };
    } else {
      // Fallback for unknown icons
      return {
        id: iconName,
        name: iconName,
        url: '', // App will use default icon
        isIsometric: true
      };
    }
  });

  const fullViews = v.map((view: any, viewIndex: number) => {
    const [positions, connections] = view;

    const viewItems = positions.map((pos: any) => {
      const [itemIndex, x, y] = pos;
      return {
        id: `item_${itemIndex}`,
        tile: { x, y },
        labelHeight: 80
      };
    });

    const connectors = connections.map((conn: any, connIndex: number) => {
      const [fromIndex, toIndex] = conn;
      return {
        id: `conn_${viewIndex}_${connIndex}`,
        color: 'color1',
        anchors: [
          { id: `a_${viewIndex}_${connIndex}_0`, ref: { item: `item_${fromIndex}` } },
          { id: `a_${viewIndex}_${connIndex}_1`, ref: { item: `item_${toIndex}` } }
        ],
        width: 10,
        description: '',
        style: 'SOLID'
      };
    });

    return {
      id: `view_${viewIndex}`,
      name: `View ${viewIndex + 1}`,
      items: viewItems,
      connectors,
      rectangles: [],
      textBoxes: []
    };
  });

  return {
    title: t,
    version: '1.0',
    items: fullItems,
    views: fullViews,
    icons: fullIcons,
    colors: [{ id: 'color1', value: '#a5b8f3' }]
  };
};

export const exportAsJSON = (model: Model) => {
  const data = new Blob([JSON.stringify(model)], {
    type: 'application/json;charset=utf-8'
  });

  downloadFile(data, generateGenericFilename('json'));
};

export const exportAsCompactJSON = (model: Model) => {
  const compactModel = transformToCompactFormat(model);
  const data = new Blob([JSON.stringify(compactModel)], {
    type: 'application/json;charset=utf-8'
  });

  downloadFile(data, generateGenericFilename('compact.json'));
};

export const exportAsImage = async (
  el: HTMLDivElement,
  size?: Size,
  scale: number = 1,
  bgcolor: string = '#ffffff'
) => {
  // Calculate scaled dimensions
  const width = size ? size.width * scale : el.clientWidth * scale;
  const height = size ? size.height * scale : el.clientHeight * scale;

  // dom-to-image-more is a better maintained fork
  const options = {
    width,
    height,
    cacheBust: true,
    bgcolor,
    quality: 1.0,
    // Apply CSS transform for high-quality scaling
    style: scale !== 1 ? {
      transform: `scale(${scale})`,
      transformOrigin: 'top left'
    } : undefined
  };

  try {
    const imageData = await domtoimage.toPng(el, options);
    return imageData;
  } catch (error) {
    console.error('Export failed, trying fallback method:', error);
    // Fallback: try with minimal options
    return await domtoimage.toPng(el, {
      width,
      height,
      cacheBust: true,
      bgcolor
    });
  }
};

export const exportAsSVG = async (
  el: HTMLDivElement,
  size?: Size,
  bgcolor: string = '#ffffff'
) => {
  const width = size ? size.width : el.clientWidth;
  const height = size ? size.height : el.clientHeight;

  const options = {
    width,
    height,
    cacheBust: true,
    bgcolor,
    quality: 1.0
  };

  try {
    const svgData = await domtoimage.toSvg(el, options);
    return svgData;
  } catch (error) {
    console.error('SVG export failed, trying fallback method:', error);
    // Fallback: try with minimal options
    return await domtoimage.toSvg(el, {
      width,
      height,
      cacheBust: true,
      bgcolor
    });
  }
};