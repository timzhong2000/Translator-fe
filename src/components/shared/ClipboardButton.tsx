import { writeText } from "clipboard-polyfill/text";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DoneIcon from "@mui/icons-material/Done";
import Tooltip from "@mui/material/Tooltip";

import { useState } from "react";
import { useTranslation } from "react-i18next";

const ClipboardButton: React.FC<{ text: string }> = (props) => {
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const {t} = useTranslation();

  const copy = () => {
    writeText(props.text)
      .then(() => {
        setDisplaySuccess(true);
        setTimeout(() => {
          setDisplaySuccess(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div onClick={copy} style={{ display: "inline-block" }}>
      {displaySuccess ? (
        <Tooltip title={t("clipboard.success") as string}>
          <DoneIcon fontSize="medium" />
        </Tooltip>
      ) : (
        <Tooltip title={t("clipboard.copyText") as string}>
          <ContentPasteIcon fontSize="medium" />
        </Tooltip>
      )}
    </div>
  );
};

export default ClipboardButton;
