import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import styles from "../../../styles/components/registerV3.module.css";
import { FormContext } from "@/context/FormProvider";
import { FormType } from "@/utils/constants";
import { getDomainWithStark, isValidEmail } from "@/utils/stringService";
import TextField from "../../UI/textField";
import SwissForm from "../swissForm";
import SelectIdentity from "../selectIdentity";
import NumberTextField from "@/components/UI/numberTextField";
import { useAccount } from "@starknet-react/core";
import ConnectButton from "@/components/UI/connectButton";
import Button from "@/components/UI/button";
import RenewalDomainsBox from "../renewalDomainsBox";
import { areDomainSelected } from "@/utils/priceService";

type UserInfoFormProps = {
  type: FormType;
  goToNextStep: () => void;
  imageUrl: string;
  canUpdateDuration?: boolean;
  minDuration?: number;
};

export enum IncrementType {
  INCREMENT,
  DECREMENT,
  SET,
}

const UserInfoForm: FunctionComponent<UserInfoFormProps> = ({
  type,
  goToNextStep,
  imageUrl,
  canUpdateDuration = true,
  minDuration = 1,
}) => {
  const maxYearsToRegister = 25;
  const { address } = useAccount();
  const { formState, updateFormState } = useContext(FormContext);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(true);
  const [selectedDomains, setSelectedDomains] =
    useState<Record<string, boolean>>();

  useEffect(() => {
    if (type === FormType.REGISTER) return;
    updateFormState({ selectedDomains });
  }, [selectedDomains]);

  function changeEmail(value: string): void {
    setEmail(value);
    setEmailError(isValidEmail(value) ? false : true);
    updateFormState({ email: value });
  }

  function changeTokenId(value: number): void {
    updateFormState({ tokenId: value });
  }

  function changeDuration(
    type: IncrementType,
    value: number = formState.duration
  ): void {
    if (!canUpdateDuration) return;
    let newValue = value;

    switch (type) {
      case IncrementType.INCREMENT:
        newValue = value < maxYearsToRegister ? value + 1 : value;
        break;
      case IncrementType.DECREMENT:
        newValue = value > minDuration ? value - 1 : value;
        break;
      case IncrementType.SET:
        break;
    }

    if (isNaN(newValue) || newValue > maxYearsToRegister || newValue < 1)
      return;
    updateFormState({
      duration: newValue,
      isUpselled: newValue === minDuration ? true : false,
    });
  }

  const getTitle = () => {
    switch (type) {
      case FormType.REGISTER:
        // Fetch the domain name from the selectedDomains object in context for the title of the section
        return getDomainWithStark(Object.keys(formState.selectedDomains)[0]);
      case FormType.RENEW:
        return "Renew Your domain(s)";
      default:
        return "";
    }
  };

  const getButtonText = (): string => {
    return formState.needMetadata && emailError
      ? "Enter a valid Email"
      : type === FormType.RENEW && !areDomainSelected(formState.selectedDomains)
      ? "Select a domain to renew"
      : "Next step";
  };

  const isDisabled = (): boolean => {
    return (
      !formState.duration ||
      formState.duration < minDuration ||
      (formState.needMetadata && emailError) ||
      (type === FormType.RENEW && !areDomainSelected(formState.selectedDomains))
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.form}>
          <div className="flex flex-col items-start gap-4 self-stretch">
            <p className={styles.legend}>{type}</p>
            <h3 className={styles.domain}>{getTitle()}</h3>
          </div>
          <div className="flex flex-col items-start gap-6 self-stretch">
            {formState.needMetadata ? (
              <TextField
                helperText="Secure your domain's future and stay ahead with vital updates. Your email stays private with us, always."
                label="Email address"
                value={email}
                onChange={(e) => changeEmail(e.target.value)}
                color="secondary"
                error={emailError}
                errorMessage="Please enter a valid email address"
                type="email"
              />
            ) : null}

            {formState.needMetadata ? (
              <SwissForm
                isSwissResident={formState.isSwissResident}
                onSwissResidentChange={() =>
                  updateFormState({
                    isSwissResident: !formState.isSwissResident,
                  })
                }
              />
            ) : null}
            {type === FormType.REGISTER ? (
              <SelectIdentity
                tokenId={formState.tokenId}
                changeTokenId={changeTokenId}
              />
            ) : null}
            {canUpdateDuration ? (
              <NumberTextField
                value={formState.duration}
                label="Years to register (max 25 years)"
                placeholder="years"
                onChange={(e) =>
                  changeDuration(IncrementType.SET, Number(e.target.value))
                }
                incrementValue={() => changeDuration(IncrementType.INCREMENT)}
                decrementValue={() => changeDuration(IncrementType.DECREMENT)}
                color="secondary"
                required
              />
            ) : null}
            {type === FormType.RENEW ? (
              <RenewalDomainsBox
                helperText="Check the box of the domains you want to renew"
                setSelectedDomains={setSelectedDomains}
                selectedDomains={formState.selectedDomains}
              />
            ) : null}
          </div>
        </div>
        <div className={styles.summary}>
          <div>
            {address ? (
              <Button onClick={goToNextStep} disabled={isDisabled()}>
                {getButtonText()}
              </Button>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
      </div>
      <img className={styles.image} src={imageUrl} />
    </div>
  );
};

export default UserInfoForm;
