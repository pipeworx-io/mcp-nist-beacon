# @pipeworx/nist-beacon

[NIST Randomness Beacon v2](https://csrc.nist.gov/projects/interoperable-randomness-beacons) MCP — public, signed 512-bit random pulses every 60 seconds. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `last_pulse()` — most recent pulse
- `pulse_at(time_ms)` — pulse at a UTC time (epoch ms)
- `pulse_by_chain_pulse(chain_id, pulse_id)` — specific pulse by chain + pulse index
- `latest_in_chain(chain_id)` — latest pulse in a chain (chain 1 = primary)
- `chain_info(chain_id)` — chain metadata

## Use cases

Verifiable public randomness — lotteries, audits, election seeding, fair sampling.

## Data source

`https://beacon.nist.gov/beacon/2.0`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "nist-beacon": {
      "url": "https://gateway.pipeworx.io/nist-beacon/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Nist Beacon data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
