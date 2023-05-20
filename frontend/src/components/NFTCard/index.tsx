import Flex from "../Flex";
import "./nftcard.css";

type Props = {
  type: string;
  imageSize?: string;
};

const NFTCard = ({ type, imageSize = "100px" }: Props) => {
  return (
    <Flex flexDirection="column" width="100%">
      <figure className="nft-image-wrapper">
        <img
          src={`images/${type}.png`}
          alt={type}
          width={imageSize}
          height={imageSize}
        />
      </figure>
    </Flex>
  );
};

export default NFTCard;
