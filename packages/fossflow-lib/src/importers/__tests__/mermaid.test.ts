import { parseMermaid, importMermaid } from '../mermaid';
import { modelSchema } from '../../schemas/model';

describe('Mermaid Importer', () => {
  const complexDiagram = `
flowchart TD
  A[TCP Devices / GPS / IoT] -->|TCP Message| B(TCP Server) 
  B -->|RawMessage| C(Worker Pool)
  C -->|Dispatch| D(Message Gateway)
  D -->|Route| E1[Suntech Decoder]
  D -->|Route| E2[Queclink Decoder]
  E1 -->|Decoded Data| F1[Suntech Translator]
  E2 -->|Decoded Data| F2[Queclink Translator]
  F1 -->|Normalized Data| G(Serializer)
  F2 -->|Normalized Data| G
  G -->|JSON/Protobuf| H(Adapter)
  H -->|Publish| I1[Kafka/Redpanda]
  H -->|Publish| I2[Mosquitto MQTT]
  B -.-> J[Health Server]
  C -.-> K[Metrics/Telemetry]
  H -.-> K
  J -.-> L[HTTP Health Endpoints]
  K -.-> M[Telegraf/InfluxDB]
`;

  it('should parse complex diagrams correctly', () => {
    const { nodes, edges } = parseMermaid(complexDiagram);
    
    // Check nodes (at least some key ones)
    const nodeA = nodes.find(n => n.id === 'A');
    expect(nodeA?.label).toBe('TCP Devices / GPS / IoT');
    
    const nodeB = nodes.find(n => n.id === 'B');
    expect(nodeB?.label).toBe('TCP Server');
    
    // Check edges
    expect(edges.length).toBeGreaterThan(15);
    const edgeAtoB = edges.find(e => e.from === 'A' && e.to === 'B');
    expect(edgeAtoB?.label).toBe('TCP Message');
    
    const edgeBtoJ = edges.find(e => e.from === 'B' && e.to === 'J');
    expect(edgeBtoJ).toBeDefined();
  });

  it('should produce a valid FossFLOW model that passes Zod validation', () => {
    const model = importMermaid(complexDiagram);
    const result = modelSchema.safeParse(model);
    
    if (!result.success) {
      console.log('Validation failed:', JSON.stringify(result.error.format(), null, 2));
    }
    
    expect(result.success).toBe(true);
  });
});
