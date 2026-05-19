interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * NIST Randomness Beacon MCP.
 */


const BASE = 'https://beacon.nist.gov/beacon/2.0';
const UA = 'pipeworx-mcp-nist-beacon/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'last_pulse', description: 'Most recent pulse.', inputSchema: { type: 'object', properties: {} } },
  { name: 'pulse_at', description: 'Pulse at UTC time (epoch ms).', inputSchema: { type: 'object', properties: { time_ms: { type: 'number' } }, required: ['time_ms'] } },
  {
    name: 'pulse_by_chain_pulse',
    description: 'Pulse by chain + pulse index.',
    inputSchema: { type: 'object', properties: { chain_id: { type: 'number' }, pulse_id: { type: 'number' } }, required: ['chain_id', 'pulse_id'] },
  },
  { name: 'latest_in_chain', description: 'Latest pulse in chain.', inputSchema: { type: 'object', properties: { chain_id: { type: 'number' } }, required: ['chain_id'] } },
  { name: 'chain_info', description: 'Chain metadata.', inputSchema: { type: 'object', properties: { chain_id: { type: 'number' } }, required: ['chain_id'] } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const get = async (path: string) => {
    const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (!res.ok) throw new Error(`NIST Beacon: ${res.status}`);
    return res.json();
  };
  const reqNum = (k: string, ex: string) => {
    const v = args[k];
    if (v == null || typeof v !== 'number') throw new Error(`Required argument "${k}" is missing. Pass a number like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'last_pulse':
      return get('/pulse/last');
    case 'pulse_at':
      return get(`/pulse/time/${reqNum('time_ms', '1716120000000')}`);
    case 'pulse_by_chain_pulse':
      return get(`/chain/${reqNum('chain_id', '1')}/pulse/${reqNum('pulse_id', '12345')}`);
    case 'latest_in_chain':
      return get(`/chain/${reqNum('chain_id', '1')}/pulse/last`);
    case 'chain_info':
      return get(`/chain/${reqNum('chain_id', '1')}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
