import { Model } from 'src/types';
import { icons } from './icons';
import { modelItems } from './modelItems';
import { views } from './views';
import { colors } from './colors';

export const model: Model = {
  version: '1.0.0',
  title: 'TestModel',
  description: 'TestModelDescription',
  colors,
  icons,
  items: modelItems,
  views
} as const;
