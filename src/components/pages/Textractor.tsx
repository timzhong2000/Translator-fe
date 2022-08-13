import useTextractor from "@/utils/hooks/useTextractor";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { memo, useEffect, useState } from "react";
import LazyInput from "../shared/LazyInput";
import TranslateBlock from "../shared/TranslateBlock";
import md5 from "md5";
import { useTranslatorModel } from "@/context/hook";
import { useAsync } from "react-async-hook";

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
        value={url}
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

const ListItem = memo(({ src }: { src: string }) => {
  const translatorModel = useTranslatorModel();
  const { result } = useAsync(
    (src: string) => translatorModel.translate(src),
    [src]
  );
  return <TranslateBlock src={src} dest={result ? result.dest : "正在加载"} />;
});

export default TextractorPage;
