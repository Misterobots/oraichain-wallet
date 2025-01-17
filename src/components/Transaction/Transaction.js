import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import cn from "classnames/bind";
import { FormProvider, useForm } from "react-hook-form";
import queryString from "query-string";
import _ from "lodash";
import Big from "big.js";
import ReactJson from "react-json-view";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import {
    getTxBodySend,
    getTxBodyMultiSend,
    getTxBodyDelegate,
    getTxCreateValidator,
    getTxBodyUndelegate,
    getTxBodyMsgWithdrawDelegatorReward,
    getTxBodyMsgWithdrawValidatorCommission,
    getTxBodyParameterChangeProposal,
    getTxBodyDepositProposal,
    getTxBodyVoteProposal,
} from "src/utils";
import AuthLayout from "src/components/AuthLayout";
import FormContainer from "src/components/FormContainer";
import FormTitle from "src/components/FormTitle";
import Pin from "src/components/Pin";
import TextField from "src/components/TextField";
import Button from "src/components/Button";
import Loading from "src/components/Loading";
import ButtonGroup from "src/components/ButtonGroup";
import PreviewButton from "src/components/PreviewButton";
import styles from "./Transaction.module.scss";

const cx = cn.bind(styles);

const Transaction = ({ user, showAlertBox }) => {
    const history = useHistory();
    const [openPin, setOpenPin] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isViewingJSON, setIsViewingJSON] = useState(false);
    const [jsonSrc, setJsonSrc] = useState(null);
    console.log(jsonSrc)
    const methods = useForm({
        defaultValue: {
            account: user.name,
        },
    });
    const { getValues } = methods;
    const queryStringParse = queryString.parse(history.location.search) || {};
    let payload = {};
    if (!_.isNil(queryStringParse?.raw_message)) {
        payload = JSON.parse(queryStringParse.raw_message);
    } else if (!_.isNil(queryStringParse?.payload)) {
        payload = JSON.parse(queryStringParse.payload);
    }

    const cosmos = window.cosmos;

    if (!showResult && !openPin && _.isNil(jsonSrc)) {
        if (window.stdSignMsgByPayload) {
            const txBody = window.stdSignMsgByPayload;
            setJsonSrc(txBody);
        } else if (payload && !_.isNil(payload.value)) {
            const cloneObj = JSON.parse(JSON.stringify(payload));
            if (_.get(cloneObj, "value.fee.amount") && cloneObj.value.fee.amount[0]) {
                cloneObj.value.fee.amount[0] = (new Big(cloneObj.value.fee.amount[0])).toString();
            }
            if (_.get(cloneObj, "value.msg.0.value.amount.0.amount")) {
                const amountString = _.get(cloneObj, "value.msg.0.value.amount.0.amount");
                _.set(cloneObj, "value.msg.0.value.amount.0.amount", (new Big(amountString)).toString());
            }
            if (_.get(cloneObj, "value.msg.0.value.amount.amount")) {
                const amountString = _.get(cloneObj, "value.msg.0.value.amount.amount");
                _.set(cloneObj, "value.msg.0.value.amount.amount", (new Big(amountString)).toString());
            }
            setJsonSrc(cloneObj.value);
        }
    }

    const deny = () => {
        if (!_.isNil(window?.opener)) {
            window.opener.postMessage("deny", "*");
            window.close();
        }
    };

    const allow = () => {
        setOpenPin(true);
    };

    const onChildKey = async (childKey) => {
        try {
            setLoading(true);
            // will allow return childKey from Pin
            console.log("payload: ", payload);
            const type = _.get(payload, "type");
            let txBody;
            const memo = _.get(payload, "value.memo") || "";
            if (type.includes("MsgDelegate")) {
                const amount = new Big(_.get(payload, "value.msg.0.value.amount.amount") || 0).toString();
                const validator_address = _.get(payload, "value.msg.0.value.validator_address");
                txBody = getTxBodyDelegate(user, validator_address, amount, memo);
            } else if (type.includes("MsgUndelegate")) {
                const amount = new Big(_.get(payload, "value.msg.0.value.amount.amount") || 0).toString();
                const validator_address = _.get(payload, "value.msg.0.value.validator_address");
                txBody = getTxBodyUndelegate(user, validator_address, amount, memo);
            } else if (type.includes("MsgCreateValidator")) {
                txBody = getTxCreateValidator(_.get(payload, "value.msg.0.value"));
            } else if (type.includes("MsgWithdrawDelegatorReward")) {
                txBody = getTxBodyMsgWithdrawDelegatorReward(
                    user,
                    _.get(payload, "value.msg.0.value.validator_address")
                );
            } else if (type.includes("MsgWithdrawValidatorCommission")) {
                txBody = getTxBodyMsgWithdrawValidatorCommission(_.get(payload, "value.msg.0.value.validator_address"));
            } else if (type.includes("ParameterChangeProposal")) {
                txBody = getTxBodyParameterChangeProposal(_.get(payload, "value.msg.0.value"), childKey);
            } else if (type.includes("MsgDeposit")) {
                txBody = getTxBodyDepositProposal(_.get(payload, "value.msg.value"));
            } else if (type.includes("MsgVote")) {
                txBody = getTxBodyVoteProposal(_.get(payload, "value.msg.value"));
            } else {
                const msgs = _.get(payload, "value.msg");
                if (msgs.length > 1) {
                    txBody = getTxBodyMultiSend(user, msgs, memo);
                } else {
                    const amount = new Big(_.get(payload, "value.msg.0.value.amount.0.amount") || 0).toString();
                    const to = _.get(payload, "value.msg.0.value.to_address");
                    txBody = getTxBodySend(user, to, amount, memo);
                }
            }
            const { amount, gas } = _.get(payload, "value.fee");
            console.log("fees: ", { amount, gas });
            console.log("amount: ", amount[0])

            // higher gas limit
            const res = (await cosmos.submit(childKey, txBody, "BROADCAST_MODE_BLOCK", isNaN(parseInt(amount[0])) ? 0 : amount[0], gas)) || {};
            showAlertBox({
                variant: "success",
                message: "Sent successfully",
                onHide: () => {

                },
            });

            if (!_.isNil(window.opener)) {
                window.opener.postMessage({ source: jsonSrc, res: res.tx_response }, "*");
                window.close();
            } else {
                setJsonSrc(res.tx_response);
                setShowResult(true);
            }

            setLoading(false);
        } catch (ex) {
            showAlertBox({
                variant: "error",
                message: ex.message,
            });
            setLoading(false);
        } finally {
            // setBlocking(false);
        }
    };

    const getEncryptedPassword = () => {
        const pw = getValues("password");
        if (!!pw) {
            return pw;
        }
        const storageKey = user.account + "-password";
        return localStorage.getItem(storageKey);
    }

    const toogleViewJSON = () => {
        setIsViewingJSON(!isViewingJSON);
    }

    return (
        <AuthLayout>
            {showResult ? (
                <>
                    <FormTitle>Result of sign transaction</FormTitle>
                    <div className="d-flex flex-row align-items-end mb-4">
                        <PreviewButton
                            onClick={() => {
                                window.open(
                                    `${process.env.REACT_APP_ORAI_SCAN || "https://scan.orai.io"}/txs/${jsonSrc?.txhash ?? ""
                                    }`
                                );
                            }}
                        >
                            View on oraiscan
                        </PreviewButton>
                    </div>
                    {jsonSrc && (
                        <div className="w-100 overflow-auto">
                            <ReactJson
                                theme="monokai"
                                style={{ backgroundColor: "inherit", wordBreak: "break-all" }}
                                src={jsonSrc}
                            />
                        </div>
                    )}
                </>
            ) : (
                <>
                    {openPin ? (
                        <FormContainer>
                            <Pin
                                pinType="tx"
                                onChildKey={onChildKey}
                                closePin={() => {
                                    setOpenPin(false);
                                }}
                                encryptedPassword={getEncryptedPassword()}
                            />
                        </FormContainer>
                    ) : (
                        <FormProvider {...methods}>
                            <form>
                                <FormTitle>Sign Transaction</FormTitle>
                                <ButtonGroup className="my-3">
                                    <Button variant="primary" size="lg" onClick={allow}>
                                        ALLOW
                                    </Button>

                                    <Button variant="secondary" size="lg" onClick={deny}>
                                        DENY
                                    </Button>
                                </ButtonGroup>

                                <TextField type="text" name="account" className="d-none" />
                                <TextField
                                    type="password"
                                    name="password"
                                    className="d-none"
                                    autoComplete="current-password"
                                />

                                {jsonSrc && (
                                    <div className="w-100 overflow-auto">
                                        <div className={cx("view-raw-tx")} onClick={toogleViewJSON}>
                                            View raw transaction{isViewingJSON ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                                        </div>
                                        {isViewingJSON &&
                                            <ReactJson
                                                theme="monokai"
                                                style={{ backgroundColor: "inherit", wordBreak: "break-all" }}
                                                src={jsonSrc}
                                                name={false}
                                                displayObjectSize={false}
                                                displayDataTypes={false}
                                            />
                                        }

                                    </div>
                                )}
                            </form>
                        </FormProvider>
                    )}

                    {loading && <Loading message="Submitting..." />}
                </>
            )}
        </AuthLayout>
    );
};

Transaction.propTypes = {
    user: PropTypes.any,
    showAlertBox: PropTypes.func,
};
Transaction.defaultProps = {};

export default Transaction;