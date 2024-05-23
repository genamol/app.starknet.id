import React from "react";
import { FunctionComponent, useEffect, useState } from "react";
import Button from "../UI/button";
import { useAccount, useContractWrite } from "@starknet-react/core";
import { utils } from "starknetid.js";
import { getDomainWithStark } from "../../utils/stringService";
import { numberToFixedString } from "../../utils/feltService";
import { Call } from "starknet";
import { posthog } from "posthog-js";
import TxConfirmationModal from "../UI/txConfirmationModal";
import styles from "../../styles/components/registerV2.module.css";
import TextField from "../UI/textField";
import { Divider } from "@mui/material";
import RegisterSummary from "../domains/registerSummary";
import registrationCalls from "../../utils/callData/registrationCalls";
import { computeMetadataHash, generateSalt } from "../../utils/userDataService";
import BackButton from "../UI/backButton";
import { useNotificationManager } from "../../hooks/useNotificationManager";
import { NotificationType, TransactionType } from "../../utils/constants";
import ConnectButton from "../UI/connectButton";
import { getFreeDomain } from "@/utils/campaignService";
import TermCheckbox from "../domains/termCheckbox";

type RegisterFreeProps = {
  domain: string;
  duration: number;
  customMessage: string;
  goBack: () => void;
  couponCode?: boolean;
  couponHelper?: string;
  banner: string;
};

const RegisterFree: FunctionComponent<RegisterFreeProps> = ({
  domain,
  duration,
  customMessage,
  goBack,
  couponCode,
  couponHelper,
  banner,
}) => {
  const [targetAddress, setTargetAddress] = useState<string>("");
  const [callData, setCallData] = useState<Call[]>([]);
  const [salt, setSalt] = useState<string | undefined>();
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const encodedDomain = utils
    .encodeDomain(domain)
    .map((element) => element.toString())[0];
  const [termsBox, setTermsBox] = useState<boolean>(true);
  const [metadataHash, setMetadataHash] = useState<string | undefined>();
  const { account, address } = useAccount();
  const { writeAsync: execute, data: registerData } = useContractWrite({
    calls: callData,
  });
  const [domainsMinting, setDomainsMinting] = useState<Map<string, boolean>>(
    new Map()
  );
  const [coupon, setCoupon] = useState<string>("");
  const [lastSuccessCoupon, setLastSuccessCoupon] = useState<string>("");
  const [couponError, setCouponError] = useState<string>("");
  const [signature, setSignature] = useState<string[]>(["", ""]);
  const [loadingCoupon, setLoadingCoupon] = useState<boolean>(false);
  const { addTransaction } = useNotificationManager();

  // on first load, we generate a salt
  useEffect(() => {
    setSalt(generateSalt());
  }, []);

  useEffect(() => {
    if (address) setTargetAddress(address);
  }, [address]);

  useEffect(() => {
    // salt must not be empty to preserve privacy
    if (!salt) return;
    (async () => {
      setMetadataHash(await computeMetadataHash("none", "none", salt));
    })();
  }, [salt]);

  useEffect(() => {
    // Variables
    const newTokenId: number = Math.floor(Math.random() * 1000000000000);
    const txMetadataHash = ("0x" + metadataHash) as HexString;

    const freeRegisterCalls = registrationCalls.getFreeRegistrationCalls(
      newTokenId,
      encodedDomain,
      signature,
      coupon,
      txMetadataHash
    );
    return setCallData(freeRegisterCalls);
  }, [metadataHash, encodedDomain, coupon, signature]);

  function changeCoupon(value: string): void {
    setCoupon(value);
    setLoadingCoupon(true);
  }

  useEffect(() => {
    if (!registerData?.transaction_hash) return;
    posthog?.capture("register");
    addTransaction({
      timestamp: Date.now(),
      subtext: "Domain registration",
      type: NotificationType.TRANSACTION,
      data: {
        type: TransactionType.BUY_DOMAIN,
        hash: registerData.transaction_hash,
        status: "pending",
      },
    });
    setIsTxModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerData]);

  useEffect(() => {
    if (!coupon) {
      setCouponError("Please enter a coupon code");
      setLoadingCoupon(false);
      return;
    }
    if (coupon === lastSuccessCoupon) {
      setCouponError("");
      setLoadingCoupon(false);
      return;
    }
    if (!address) return;
    getFreeDomain(address, `${domain}.stark`, coupon).then((res) => {
      if (res.error) setCouponError(JSON.stringify(res.error));
      else {
        setSignature([res.r, res.s]);
        setLastSuccessCoupon(coupon);
        setCouponError("");
      }
      setLoadingCoupon(false);
    });
  }, [coupon, domain, address, lastSuccessCoupon]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.form}>
          <BackButton onClick={() => goBack()} />
          <div className="flex flex-col items-start gap-4 self-stretch">
            <p className={styles.legend}>Your registration</p>
            <h3 className={styles.domain}>{getDomainWithStark(domain)}</h3>
          </div>
          <div className="flex flex-col items-start gap-6 self-stretch">
            {couponCode ? (
              <TextField
                helperText={couponHelper}
                label="Coupon code"
                value={coupon}
                onChange={(e) => changeCoupon(e.target.value)}
                color="secondary"
                error={Boolean(couponError)}
                errorMessage={couponError}
              />
            ) : null}
          </div>
        </div>
        <div className={styles.summary}>
          <RegisterSummary
            duration={Number(numberToFixedString(duration / 365))}
            renewalBox={false}
            customMessage={customMessage}
            isFree={true}
          />
          <Divider className="w-full" />
          <TermCheckbox
            checked={termsBox}
            onChange={() => setTermsBox(!termsBox)}
          />
          {address ? (
            <Button
              onClick={() =>
                execute().then(() =>
                  setDomainsMinting((prev) =>
                    new Map(prev).set(encodedDomain.toString(), true)
                  )
                )
              }
              disabled={
                (domainsMinting.get(encodedDomain) as boolean) ||
                !account ||
                !duration ||
                !targetAddress ||
                !termsBox ||
                Boolean(couponError) ||
                loadingCoupon
              }
            >
              {!termsBox
                ? "Please accept terms & policies"
                : couponError
                ? "Enter a valid Coupon"
                : "Register my domain"}
            </Button>
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
      <img className={styles.image} src={banner} />
      <TxConfirmationModal
        txHash={registerData?.transaction_hash}
        isTxModalOpen={isTxModalOpen}
        closeModal={() => setIsTxModalOpen(false)}
        title="Your domain is on it's way !"
      />
    </div>
  );
};

export default RegisterFree;