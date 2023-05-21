/**
 * @description 넘겨받은 문자열을 PascalCase로 변환해줍니다.
 * @param value
 */
export const convertPascalCase = (value: string) =>
  value
    ? value.replace(/\w+/g, (word) => {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      })
    : "";

/**
 * @description sign message 생성
 * @param message message
 */
export const getSignMessage = (message: string): string =>
  `0x${Buffer.from(message).toString("hex")}`;

/**
 * @description 1,000단위 콤마
 * @param num
 */
export const setComma = (num: number): string =>
  num.toLocaleString(undefined, { maximumFractionDigits: 4 });

/**
 * @description 주소길이 줄이기
 * @param account wallet account address
 * @param startIndex 시작 위치
 * @param endIndex 마지막 위치
 */
export const convertAddress = (
  account: string,
  startIndex?: number,
  endIndex?: number
): string =>
  `${account.substring(0, startIndex || 10)}...${account.substring(
    endIndex || 32
  )}`;

/**
 * @description portalRoot 생성
 * @param id root id
 */
export function createPortalRoot(id: string) {
  const drawerRoot = document.createElement("div");
  drawerRoot.setAttribute("id", id);

  return drawerRoot;
}
