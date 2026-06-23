const dateInputPattern = /^\d{4}-\d{2}-\d{2}$/;

export function isProjectDateRangeValid(startLabel: string, targetLabel: string) {
  if (!dateInputPattern.test(startLabel) || !dateInputPattern.test(targetLabel)) {
    return false;
  }

  return targetLabel >= startLabel;
}
