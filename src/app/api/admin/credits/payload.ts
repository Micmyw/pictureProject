export function buildCreditEntry(workspaceId: string, amount: number) {
  return {
    workspace_id: workspaceId,
    entry_kind: "manual_adjustment",
    amount
  };
}
