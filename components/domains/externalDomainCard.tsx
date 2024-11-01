import React, { FunctionComponent } from "react";
import styles from "../../styles/components/externalDomainCard.module.css";
import {
  getDomainKind,
  minifyAddress,
  shortenDomain,
} from "../../utils/stringService";
import MainIcon from "../UI/iconsComponents/icons/mainIcon";
import StarknetIcon from "../UI/iconsComponents/icons/starknetIcon";
import theme from "../../styles/theme";
import CopyContent from "../UI/copyContent";

type ExternalDomainCardProps = {
  domain: string;
  targetAddress: string;
  isMainDomain: boolean;
};

const ExternalDomainCard: FunctionComponent<ExternalDomainCardProps> = ({
  domain,
  targetAddress,
  isMainDomain,
}) => {
  const responsiveDomain = shortenDomain(domain as string);
  const domainKind = getDomainKind(domain as string);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className="flex items-center justify-center gap-5 my-2 flex-wrap lg:flex-row ">
          <div className="my-2">
            <img
              src={
                domainKind === "braavos"
                  ? "/braavos/braavosLogoWithBackground.webp"
                  : domainKind === "sol"
                  ? "/solana/bonfida.webp"
                  : `https://identicon.starknet.id/0`
              }
              height={150}
              width={150}
              alt="identicon"
              className="rounded-[16px]"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row items-center justify-center">
              <h1 className={styles.domain}>{responsiveDomain}</h1>
              {isMainDomain && (
                <div className="ml-2">
                  <MainIcon
                    width="30"
                    firstColor={theme.palette.primary.main}
                    secondColor={theme.palette.primary.main}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-row lg:mt-6 mt-2">
              <StarknetIcon width="32px" color="" />
              <h2 className="ml-3 text-xl">{minifyAddress(targetAddress)}</h2>
              <CopyContent
                value={targetAddress}
                className="cursor-pointer ml-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalDomainCard;
