import { React, useState } from "react";
import cn from "classnames/bind";
import { ArrowBack, Close } from "@material-ui/icons";
import PropTypes from "prop-types";
import _ from "lodash";
import styles from "./Pin.module.scss";
import { useHistory } from "react-router";
// import { useTranslation } from "react-i18next";
import { getChildkeyFromDecrypted, encryptAES, decryptAES } from "../../utils";

const cx = cn.bind(styles);

const Pin = ({
    setStep,
    setEnteredPin,
    setEncryptedMnemonics,
    updateUser,
    onChildKey,
    closePopup,
    closePin,
    message,
    currentStep,
    pinType,
    walletName,
    mnemonics,
    encryptedMnemonics,
    setUser,
    onConfirmSuccess,
    footerElement
}) => {
    const history = useHistory();
    // const { t, i18n } = useTranslation();
    const cosmos = window.cosmos;

    let [pinArray, setPinArray] = useState([]);
    const [pinEvaluateStatus, setPinEvaluateStatus] = useState("");

    const goToNextStep = () => {
        setStep && setStep(currentStep + 1);
    };

    const goToPrevStep = () => {
        setStep && setStep(currentStep - 1);
    };

    const handleClick = (e) => {
        switch (e) {
            case "back":
                pinArray.pop();
                setPinArray([...pinArray]);
                setPinEvaluateStatus("");
                break;
            case "reset":
                pinArray = [];
                setPinArray([]);
                setPinEvaluateStatus("");
                break;
            default:
                if (pinArray.length < 5) {
                    pinArray.push(e);
                    setPinArray([...pinArray]);
                }
        }

        if (pinArray.length === 5) {
            pinType === "confirm" || pinType === "signin" || pinType === "tx" ? evaluatePin() : encryptMnemonic();
        }
    };

    const evaluatePin = () => {
        const enteredPin = pinArray.join("");
        const decryptedMnemonics = decryptAES(encryptedMnemonics, enteredPin);
        if (decryptedMnemonics !== "") {
            setTimeout(() => {
                const childKey = getChildkeyFromDecrypted(decryptedMnemonics);
                setPinEvaluateStatus("success");
                setTimeout(() => {
                    if (pinType === "confirm") {
                        goToNextStep();
                        onConfirmSuccess && onConfirmSuccess(childKey);
                    } else if (pinType === "signin") {
                        const address = cosmos.getAddress(childKey);
                        setUser && setUser({ address: address, account: walletName, childKey });

                        // go to transaction with address, other go to send
                        // updateUser({ name: walletName, address });
                        if (window.stdSignMsgByPayload) {
                            // history.push(`/${i18n.language}/transaction`);
                        } else if (closePopup) {
                            if (onConfirmSuccess) {
                                onConfirmSuccess(childKey);
                            } else {
                                window.opener.postMessage({ address: address, account: walletName }, "*");
                                window.close();
                            }
                        } else {
                            // history.push(`/${i18n.language}/`);
                        }
                    } else if (pinType === "tx") {
                        onChildKey(childKey);
                    }
                }, 300);
            }, 200);
        } else {
            setTimeout(() => {
                setPinEvaluateStatus("error");
                setTimeout(() => {
                    setPinEvaluateStatus("");
                    setPinArray([]);
                }, 300);
            }, 200);
        }
        setEnteredPin?.(enteredPin);
    };

    const encryptMnemonic = () => {
        const enteredPin = pinArray.join("");
        setEncryptedMnemonics(encryptAES(mnemonics, enteredPin));
        goToNextStep();
    };

    const NumPad = () => (
        <div className={cx("keypad", "numpad")}>
            <div className={cx("keypad-row")}>
                <div className={cx("keypad-button")} onClick={() => handleClick(7)}>
                    7
                </div>
                <div className={cx("keypad-button")} onClick={() => handleClick(8)}>
                    8
                </div>
                <div className={cx("keypad-button")} onClick={() => handleClick(9)}>
                    9
                </div>
            </div>
            <div className={cx("keypad-row")}>
                <div className={cx("keypad-button")} onClick={() => handleClick(4)}>
                    4
                </div>
                <div className={cx("keypad-button")} onClick={() => handleClick(5)}>
                    5
                </div>
                <div className={cx("keypad-button")} onClick={() => handleClick(6)}>
                    6
                </div>
            </div>
            <div className={cx("keypad-row")}>
                <div className={cx("keypad-button")} onClick={() => handleClick(1)}>
                    1
                </div>
                <div className={cx("keypad-button")} onClick={() => handleClick(2)}>
                    2
                </div>
                <div className={cx("keypad-button")} onClick={() => handleClick(3)}>
                    3
                </div>
            </div>
            <div className={cx("keypad-row")}>
                <div className={cx("keypad-button")} onClick={() => handleClick("back")}>
                    <ArrowBack />
                </div>
                <div className={cx("keypad-button")} onClick={() => handleClick(0)}>
                    0
                </div>
                <div className={cx("reset-button")} onClick={() => handleClick("reset")}>
                    <Close />
                </div>
            </div>
        </div>
    );

    const CharPad = () => {
        const rows = [];

        rows.push(
            <div className={cx("keypad-row")} key="row1">
                {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((button) => (
                    <div className={cx("keypad-button")} key={button} onClick={() => handleClick(button)}>
                        {button}
                    </div>
                ))}
            </div>
        );

        rows.push(
            <div className={cx("keypad-row")} key="row2">
                {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((button) => (
                    <div className={cx("keypad-button")} key={button} onClick={() => handleClick(button)}>
                        {button}
                    </div>
                ))}
            </div>
        );

        rows.push(
            <div className={cx("keypad-row")} key="row3">
                {["back", "Z", "X", "C", "V", "B", "N", "M", "reset"].map((button) => {
                    switch (button) {
                        case "back":
                            return (
                                <div className={cx("keypad-button")} key={button} onClick={() => handleClick("back")}>
                                    <ArrowBack />
                                </div>
                            );
                        case "reset":
                            return (
                                <div className={cx("reset-button")} key={button} onClick={() => handleClick("reset")}>
                                    <Close />
                                </div>
                            );
                        default:
                            return (
                                <div className={cx("keypad-button")} key={button} onClick={() => handleClick(button)}>
                                    {button}
                                </div>
                            );
                    }
                })}
            </div>
        );

        return <div className={cx("keypad", "charpad")}> {rows} </div>;
    };

    return (
        <div className={cx("pin-wrapper")}>
            <div className={cx("pin-display")}>
                <div className="text-right">
                    <div
                        className={cx("close")}
                        onClick={() => {
                            goToPrevStep();
                            closePin?.();
                        }}
                    >
                        <Close />
                    </div>
                </div>


                <div>
                    <div className={cx("pin-title1")}>{message}</div>
                    <div className={cx("pin-title2")}>PIN is required for every transaction.</div>
                    <div className={cx("pin-title3")}>If lost, you cannot reset or recover your PIN.</div>
                </div>

                <div className={cx("confirmation-dots")}>
                    <svg>
                        <g>
                            <circle
                                className={cx("pin-circle", pinArray.length > 0 ? "entered" : "", pinEvaluateStatus)}
                                cx="10"
                                cy="10"
                                r="8"
                            ></circle>
                            <circle
                                className={cx("pin-circle", pinArray.length > 1 ? "entered" : "", pinEvaluateStatus)}
                                cx="40"
                                cy="10"
                                r="8"
                            ></circle>
                            <circle
                                className={cx("pin-circle", pinArray.length > 2 ? "entered" : "", pinEvaluateStatus)}
                                cx="70"
                                cy="10"
                                r="8"
                            ></circle>
                            <circle
                                className={cx("pin-circle", pinArray.length > 3 ? "entered" : "", pinEvaluateStatus)}
                                cx="100"
                                cy="10"
                                r="8"
                            ></circle>
                            <circle
                                className={cx("pin-circle", pinArray.length > 4 ? "entered" : "", pinEvaluateStatus)}
                                cx="130"
                                cy="10"
                                r="8"
                            ></circle>
                        </g>
                    </svg>
                </div>

                {pinArray.length < 4 ? <NumPad /> : <CharPad />}

            </div>

            {!_.isNil(footerElement) && footerElement}
        </div>
    );
};

Pin.propTypes = {
    message: PropTypes.string,
};
Pin.defaultProps = {
    message: "Enter your PIN",
};

export default Pin;
