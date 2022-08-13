import { writeText } from "clipboard-polyfill/text";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DoneIcon from "@mui/icons-material/Done";
import Tooltip from "@mui/material/Tooltip";

import { forwardRef, memo, useState } from "react";
import { useTranslation } from "react-i18next";

const ClipboardButton = forwardRef<HTMLButtonElement, { text: string }>(
  (props, buttonRef) => {
    const [displaySuccess, setDisplaySuccess] = useState(false);
    const { t } = useTranslation();

    const copy = (e:React.MouseEvent) => {
      e.stopPropagation();
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
      <button
        onClick={copy}
        style={{ display: "inline-block" }}
        ref={buttonRef}
      >
        {displaySuccess ? (
          <Tooltip title={t("clipboard.success") as string}>
            <DoneIcon fontSize="medium" />
          </Tooltip>
        ) : (
          <Tooltip title={t("clipboard.copyText") as string}>
            <ContentPasteIcon fontSize="medium" />
          </Tooltip>
        )}
      </button>
    );
  }
);

export default memo(ClipboardButton);
