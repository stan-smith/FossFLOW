import mdlbeastTemplate from './mdlbeast-event.json';

export interface DiagramTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  data: any;
}

export const TEMPLATES: DiagramTemplate[] = [
  {
    id: 'mdlbeast-event',
    name: 'MDL Beast - Event Capacity',
    description: 'Music festival RF deployment with Tri-Beam COWs, macro sites, MW/fiber backhaul, and coverage zones for 233K+ users',
    category: 'Event Capacity',
    data: mdlbeastTemplate
  }
];
