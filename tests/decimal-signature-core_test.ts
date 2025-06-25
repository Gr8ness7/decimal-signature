import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from 'https://deno.land/x/clarinet@v1.0.4/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Decimal Signature Core: Create Financial Space",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const spaceName = "Team Project Expenses";

    const block = chain.mineBlock([
      Tx.contractCall('decimal-signature-core', 'create-space', [types.ascii(spaceName)], deployer.address)
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectUint(1);
  }
});

Clarinet.test({
  name: "Decimal Signature Core: Add Member to Space",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const alice = accounts.get('wallet_1')!;

    const block = chain.mineBlock([
      Tx.contractCall('decimal-signature-core', 'create-space', [types.ascii("Project Team")], deployer.address),
      Tx.contractCall('decimal-signature-core', 'add-member', [types.uint(1), types.principal(alice.address), types.uint(5000)], deployer.address)
    ]);

    assertEquals(block.height, 2);
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk().expectBool(true);
  }
});