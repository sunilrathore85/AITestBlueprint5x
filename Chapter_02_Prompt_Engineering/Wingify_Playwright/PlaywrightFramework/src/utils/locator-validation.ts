import { Page } from '@playwright/test';
import { LoginXPaths } from '../config/login-locators';

export interface LocatorValidationResult {
  xpath: string;
  matchCount: number;
  visible: boolean;
}

export async function validateLoginLocators(page: Page): Promise<LocatorValidationResult[]> {
  return page.evaluate((xpaths: Record<string, string>) => {
    const evaluateXPath = (xpath: string): { count: number; visible: boolean } => {
      const snapshot = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      const count = snapshot.snapshotLength;
      let visible = false;

      if (count > 0) {
        const node = snapshot.snapshotItem(0) as HTMLElement | null;
        visible = Boolean(node && node.offsetParent !== null);
      }

      return { count, visible };
    };

    return Object.values(xpaths).map((xpath) => {
      const { count, visible } = evaluateXPath(xpath);
      return { xpath, matchCount: count, visible };
    });
  }, LoginXPaths as unknown as Record<string, string>);
}