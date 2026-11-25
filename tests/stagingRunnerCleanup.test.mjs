import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanupSyntheticStagingRecord,
  deriveStagingIdentity,
  findStagingRowNumbers
} from "../tools/run-contact-staging-outbox.mjs";
import {
  CONTACT_STAGING_SPREADSHEET_ID,
  CONTACT_TALENT_STAGING_SYNTHETIC_MARKER
} from "../tools/contactStagingGate.mjs";

const key = "tag08-contact-talent-staging:test-run:contact";
const marker = "test-run:contact";
const identity = deriveStagingIdentity("contact_lead", key);
const source = `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER}:${marker}`;
const rowFor = ({ deliveryId = identity.deliveryId, recordId = identity.recordId, sourceValue = source } = {}) => {
  const row = Array(23).fill("");
  row[0] = deliveryId;
  row[1] = recordId;
  row[14] = sourceValue;
  return row;
};

const createSheet = ({ rowNumber = 2, row = rowFor(), duplicateAt } = {}) => {
  const rows = [];
  rows[0] = Array(23).fill(""); // header row; its contents are irrelevant to cleanup
  rows[rowNumber - 1] = row;
  if (duplicateAt) rows[duplicateAt - 1] = [...row];
  const cleared = [];

  const readValues = async (_token, range) => {
    const tab = range.split("!")[0];
    if (range.endsWith("!A2:A")) {
      const values = Array.from(rows.slice(1), (item) => [item?.[0] || ""]);
      while (values.length && values.at(-1)[0] === "") values.pop();
      return values;
    }
    const match = range.match(/!A(\d+):[A-Z]+\d+$/);
    assert.ok(match, `unexpected mocked range ${range}`);
    const found = rows[Number(match[1]) - 1];
    return found ? [[...found]] : [];
  };
  const clearRow = async (_token, flow, targetRow, spreadsheetId) => {
    assert.equal(spreadsheetId, CONTACT_STAGING_SPREADSHEET_ID);
    cleared.push({ flow, rowNumber: targetRow });
    rows[targetRow - 1] = Array(rows[targetRow - 1]?.length || 23).fill("");
  };
  return { rows, cleared, readValues, clearRow };
};

const cleanup = (sheet, overrides = {}) => cleanupSyntheticStagingRecord({
  accessToken: "mock-token",
  flow: "contact",
  key,
  sourceMarker: marker,
  readValues: sheet.readValues,
  clearRow: sheet.clearRow,
  ...overrides
});

test("localiza Delivery ID além da linha 1003 usando intervalo aberto", async () => {
  const sheet = createSheet({ rowNumber: 1207 });
  const matches = await findStagingRowNumbers({
    accessToken: "mock-token", flow: "contact", deliveryId: identity.deliveryId, readValues: sheet.readValues
  });
  assert.deepEqual(matches, [1207]);
  assert.equal(await cleanup(sheet).then((result) => result.cleared), true);
  assert.deepEqual(sheet.cleared, [{ flow: "contact", rowNumber: 1207 }]);
});

test("limpa Talentos pelo marcador e coluna de origem específicos do fluxo", async () => {
  const talentKey = "tag08-contact-talent-staging:test-run:talent";
  const talentMarker = "test-run:talent";
  const talentIdentity = deriveStagingIdentity("talent_application", talentKey);
  const talentRow = Array(24).fill("");
  talentRow[0] = talentIdentity.deliveryId;
  talentRow[1] = talentIdentity.recordId;
  talentRow[15] = `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER}:${talentMarker}`;
  const sheet = createSheet({ rowNumber: 1104, row: talentRow });
  const result = await cleanupSyntheticStagingRecord({
    accessToken: "mock-token", flow: "talent", key: talentKey, sourceMarker: talentMarker,
    readValues: sheet.readValues, clearRow: sheet.clearRow
  });
  assert.equal(result.cleared, true);
  assert.deepEqual(sheet.cleared, [{ flow: "talent", rowNumber: 1104 }]);
});

test("marcador divergente ou registro de outra execução bloqueia a limpeza", async () => {
  const sheet = createSheet({ row: rowFor({ sourceValue: `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER}:another-run` }) });
  await assert.rejects(cleanup(sheet), /staging_cleanup_contact_marker_mismatch/);
  assert.equal(sheet.cleared.length, 0);
});

test("registro inexistente bloqueia e não é tratado como limpeza concluída", async () => {
  const sheet = createSheet({ rowNumber: 2, row: rowFor({ deliveryId: "another-delivery" }) });
  await assert.rejects(cleanup(sheet), /staging_cleanup_contact_row_missing/);
  assert.equal(sheet.cleared.length, 0);
});

test("duplicidade do Delivery ID bloqueia a operação como ambígua", async () => {
  const sheet = createSheet({ rowNumber: 12, duplicateAt: 1207 });
  await assert.rejects(cleanup(sheet), /staging_cleanup_contact_row_ambiguous/);
  assert.equal(sheet.cleared.length, 0);
});

test("relê a posição por Delivery ID quando a linha se desloca", async () => {
  const sheet = createSheet({ rowNumber: 50 });
  let moved = false;
  const readValues = async (token, range) => {
    if (!moved && range === "Leads!A50:W50") {
      sheet.rows[1049] = sheet.rows[49];
      sheet.rows[49] = Array(23).fill("");
      moved = true;
    }
    return sheet.readValues(token, range);
  };
  const result = await cleanup(sheet, { readValues });
  assert.equal(result.rowNumber, 1050);
  assert.deepEqual(sheet.cleared, [{ flow: "contact", rowNumber: 1050 }]);
});

test("falha HTTP de limpeza é propagada sem confirmação", async () => {
  const sheet = createSheet();
  await assert.rejects(cleanup(sheet, {
    clearRow: async () => { throw new Error("staging_cleanup_contact_row_clear_failed"); }
  }), /staging_cleanup_contact_row_clear_failed/);
});

test("resposta de limpeza sem remoção do Delivery ID falha na confirmação", async () => {
  const sheet = createSheet();
  await assert.rejects(cleanup(sheet, { clearRow: async () => {} }), /staging_cleanup_contact_delivery_id_remains/);
});

test("destino que não seja staging é rejeitado antes de leitura ou exclusão", async () => {
  const sheet = createSheet();
  let reads = 0;
  await assert.rejects(cleanup(sheet, {
    spreadsheetId: "not-staging",
    readValues: async (...args) => { reads += 1; return sheet.readValues(...args); }
  }), /staging_sheet_mismatch/);
  assert.equal(reads, 0);
  assert.equal(sheet.cleared.length, 0);
});

test("marcador ausente e Record ID alterado bloqueiam a limpeza", async (t) => {
  await t.test("marcador ausente", async () => {
    const sheet = createSheet();
    await assert.rejects(cleanup(sheet, { sourceMarker: "" }), /staging_cleanup_marker_missing/);
    assert.equal(sheet.cleared.length, 0);
  });
  await t.test("Record ID divergente", async () => {
    const sheet = createSheet({ row: rowFor({ recordId: "rec_other" }) });
    await assert.rejects(cleanup(sheet), /staging_cleanup_contact_identity_mismatch/);
    assert.equal(sheet.cleared.length, 0);
  });
});
