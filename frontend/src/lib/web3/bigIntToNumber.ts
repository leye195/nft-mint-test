import { formatUnits } from "viem";

const convertBigIntToNumber = (input: string | bigint | number) =>
  formatUnits(BigInt(input), 0);

export default convertBigIntToNumber;
