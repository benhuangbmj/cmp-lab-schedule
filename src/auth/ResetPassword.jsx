//Note: Currently ResetPassword is removed from the app
import { useState, useRef } from "react";
import "reactjs-popup/dist/index.css";

import bcrypt from "bcryptjs";

import { update } from "/src/api-operations";
import { generateVerificationCode } from "/src/utils.js";
import utils from "/src/utils.js";
import myContentful from "/src/api-operations.js";
import sendEmail from "/src/utils/sendEmail";

import Popup from "reactjs-popup";
import Button from "react-bootstrap/Button";

export default function ResetPassword({ fetchInfo, info }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const codeEntered = useRef();
  const user = useRef();

  const handleSendCode = (user) => {
    const verificationCode = generateVerificationCode();
    myContentful
      .update2_0("resetPassword", [user], verificationCode)
      .then(() => setSent(true));
    const body = `Here is the verification code to reset your passowrd: ${verificationCode.code}. This code will expire in 15 minutes;`;
    sendEmail(user, body);
  };

  const handleResetPassword = async (user, codeEntered) => {
    const resetInfo = await myContentful.fetchKey(user, "resetPassword");
    const verified =
      resetInfo.code == codeEntered &&
      Date.now() - resetInfo.generatedTime < 1000 * 60 * 15;
    if (verified) {
      const initialPassword = bcrypt.hashSync(user, 10);
      myContentful.update2_0("password", [user], initialPassword).then(() => {
        alert("Your password has been reset to your username.");
        setOpen(false);
      });
    } else {
      alert(
        "The verification code you entered is incorrect or it has past the validation time.",
      );
    }
  };

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Forget password?
      </Button>

      <Popup open={open} closeOnDocumentClick={false}>
        <div className="modal">
          <label>Username: </label>
          <input ref={user} />
          <br />
          <label>Verification code: </label>
          <input ref={codeEntered} />
          <br />
          <Button
            type="button"
            onClick={() => {
              handleSendCode(user.current.value);
            }}
          >
            Send verification code
          </Button>
          <Button
            type="button"
            onClick={() => {
              handleResetPassword(
                user.current.value,
                codeEntered.current.value,
              );
            }}
          >
            Reset password
          </Button>
          <Button type="button" onClick={() => setOpen(false)}>
            Close
          </Button>
          {sent && <p>The verification code is sent to your email.</p>}
        </div>
      </Popup>
    </>
  );
}
