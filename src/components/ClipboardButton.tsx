import { writeText } from "clipboard-polyfill/text";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DoneIcon from "@mui/icons-material/Done";
import Tooltip from "@mui/material/Tooltip";

import { useState } from "react";

export const ClipboardButton: React.FC<{ text: string }> = (props) => {
  const [displaySuccess, setDisplaySuccess] = useState(false);
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
        <Tooltip title="成功">
          <DoneIcon fontSize="medium"/>
        </Tooltip>
      ) : (
        <Tooltip title="复制文本">
          <ContentPasteIcon fontSize="medium" />
        </Tooltip>
      )}
    </div>
  );
};
