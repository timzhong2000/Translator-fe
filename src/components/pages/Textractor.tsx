import { configContext } from "@/context/config";
import useTextractor from "@/utils/hooks/useTextractor";
import { useTranslate } from "@/utils/hooks/useTranslate";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import React, { useContext, useEffect, useState } from "react";
import LazyInput from "../shared/LazyInput";
import TranslateBlock from "../shared/TranslateBlock";
import md5 from 'md5';

const TextractorPage = () => {
  const [url, setUrl] = useState("ws://localhost:1234");
  const { text } = useTextractor(url);
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    const newList = [...list, text];
    if (newList.length > 10) newList.slice(1);
    setList(newList);
  }, [text]);

  const validPrefix = (input: string) =>
    input.startsWith("ws://") || input.startsWith("wss://");

  return (
    <Box sx={{ padding: "1em" }}>
      <LazyInput
        label="TextRactor Websocket地址"
        initValue={url}
        onSave={(url) => setUrl(url)}
        helperTextFn={(input) =>
          !validPrefix(input) ? "请输入以ws://开头的地址" : ""
        }
        errorFn={(input) => !validPrefix(input)}
      />
      <Stack direction="column-reverse">
        {list.map((item) => (
          <ListItem key={md5(item)} src={item} />
        ))}
      </Stack>
    </Box>
  );
};
const ListItem: React.FC<{ src: string }> = ({ src }) => {
  const { translatorConfig } = useContext(configContext);
  const result = useTranslate(translatorConfig, src);

  return <TranslateBlock src={src} dest={result ? result.dest : "正在加载"} />;
};

export default TextractorPage;
