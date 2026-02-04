export function ceilDiv(a: number, b: number): number {
  if (b <= 0) return 0;

  return Math.ceil(a / b);
}

export function computeAddedOutputByBatch(
  target: number,
  current: number,
  outputPerBatch: number
): number {
  const gap = Math.max(0, target - current);
  const batches = ceilDiv(gap, outputPerBatch);
  const addedOutput = batches * outputPerBatch;

  return addedOutput;
}

export function computeInputIncreaseByBatch(
  batches: number,
  inputPerBatch: number
): number {
  return batches * inputPerBatch;
}
