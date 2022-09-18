import { Alert, AlertColor, Box, Snackbar } from "@mui/material";
import { memo, useEffect, useState } from "react";
import LazyInput from "../common/LazyInput";
import TranslateBlock from "../common/TranslateBlock";
import { useTranslatorModel } from "@/context/hook";
import { useAsync } from "react-async-hook";
import { observer } from "mobx-react-lite";
import { core } from "@/model/core";
import { TextractorClient } from "@/model/textractor/TextractorClient";
import { runInAction } from "mobx";

const defaultSnackbarConfig: {
  open: boolean;
  message: string;
  severity: AlertColor;
} = {
  open: false,
  message: "",
  severity: "info",
};

const TextractorPage = () => {
  const [url, setUrl] = useState("ws://localhost:1234");
  const textractor = core.textractor;
  const { currText } = textractor;
  const [snackbarConfig, setSnackbarConfig] = useState(defaultSnackbarConfig);

  const handleClose = () => setSnackbarConfig(defaultSnackbarConfig);
  const handleOpen = (message: string, severity: AlertColor = "info") =>
    setSnackbarConfig({ open: true, message, severity });

  const { open, message, severity } = snackbarConfig;

  useEffect(() => {
    handleOpen(`正在连接本地 Textractor`, "info");
    TextractorClient.create(url)
      .then((client) =>
        runInAction(() => {
          core.textractor = client;
          handleOpen(`连接本地 Textractor 成功`, "success");
        })
      )
      .catch(() => handleOpen(`连接本地 Textractor 失败`, "error"));
  }, [url]);

  const validPrefix = (input: string) =>
    input.startsWith("ws://") || input.startsWith("wss://");

  return (
    <Box sx={{ padding: "1em" }}>
      <LazyInput
        label="TextRactor Websocket地址"
        value={url}
        onSave={(url) => setUrl(url)}
        helperTextFn={(input) =>
          !validPrefix(input) ? "请输入以ws://开头的地址" : ""
        }
        errorFn={(input) => !validPrefix(input)}
      />
      <ListItem src={currText} />
      {/* <Stack direction="column-reverse">
        {list.map((item) => (
          <ListItem key={md5(item)} src={item} />
        ))}
      </Stack> */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const ListItem = memo(({ src }: { src: string }) => {
  const translatorModel = useTranslatorModel();
  const { result } = useAsync(
    (src: string) => translatorModel.translate(src),
    [src]
  );
  return <TranslateBlock src={src} dest={result ? result.dest : "正在加载"} />;
});

export default observer(TextractorPage);
