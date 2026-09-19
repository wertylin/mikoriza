// Server-only module — do not import in client components.
import {
  Contract,
  TransactionBuilder,
  Networks,
  Account,
  BASE_FEE,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import { Server } from "@stellar/stellar-sdk/rpc";

const CONTRACT_ID = "CBQ7EUAUUZLKUD2VAMQHPIIMYRLZQI4UFAGFNUTB6LXOXXDATZ7OH4OU";
const SOROBAN_RPC = "https://soroban-testnet.stellar.org";
// A well-known testnet account used only as a dummy source for simulation.
const DUMMY_SOURCE = "GCF2MC3TYKF3TGDZK77MYNUVTEFGNE7FJLFA35NXJ6LEOXUQL3KYF24U"; // funded testnet (vitalik)

function allianceIdToScVal(id: string): xdr.ScVal {
  const buf = Buffer.alloc(32, 0);
  Buffer.from(id, "utf8").copy(buf, 0, 0, Math.min(id.length, 32));
  return xdr.ScVal.scvBytes(buf);
}

async function simulateCall(
  funcName: string,
  args: xdr.ScVal[],
): Promise<xdr.ScVal> {
  const server = new Server(SOROBAN_RPC);
  const contract = new Contract(CONTRACT_ID);
  const account = new Account(DUMMY_SOURCE, "0");

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call(funcName, ...args))
    .setTimeout(30)
    .build();

  const result = await server.simulateTransaction(tx);

  if ("error" in result) {
    throw new Error(`Soroban simulation error: ${result.error}`);
  }
  if (!result.result?.retval) {
    throw new Error(`No return value from ${funcName}`);
  }
  return result.result.retval;
}

export type AllianceData = {
  id: string;
  name: string;
  protocol: string;
  created_by: string;
  created_at: number;
  members: string[];
};

export async function fetchAllianceData(id: string): Promise<AllianceData> {
  const idScVal = allianceIdToScVal(id);

  const [allianceScVal, membersScVal] = await Promise.all([
    simulateCall("get_alliance", [idScVal]),
    simulateCall("list_members", [idScVal]),
  ]);

  // get_alliance returns AllianceInfo struct (ScMap with symbol keys)
  // scValToNative converts ScMap -> Map<string, native> or plain object
  const raw = scValToNative(allianceScVal) as
    | Map<string, unknown>
    | Record<string, unknown>;

  function getField(key: string): unknown {
    if (raw instanceof Map) return raw.get(key);
    return (raw as Record<string, unknown>)[key];
  }

  const name = String(getField("name") ?? "");
  const protocol = String(getField("protocol") ?? "");
  const created_by = String(getField("created_by") ?? "");
  const created_at = Number(getField("created_at") ?? 0);

  // list_members returns Vec<Address> → array of address strings
  const membersRaw = scValToNative(membersScVal);
  const members: string[] = Array.isArray(membersRaw)
    ? membersRaw.map(String)
    : [];

  return { id, name, protocol, created_by, created_at, members };
}
