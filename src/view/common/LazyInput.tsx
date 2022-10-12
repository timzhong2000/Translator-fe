import { memo, useState } from "react";
import { Stack, TextField, Button } from "@mui/material";

// 带有确认按钮的输入框
const LazyInput: React.FC<{
  label: string;
  value: string;
  onSave: (text: string) => void;
  errorFn?: (input: string) => boolean;
  helperTextFn?: (input: string) => string;
  saveBtnTextFn?: (input: string) => string;
}> = ({ label, value, onSave, errorFn, helperTextFn, saveBtnTextFn }) => {
  const [input, setInput] = useState(value);
  const dirty = input !== value;
  return (
    <Stack direction="row" spacing={1}>
      <TextField
        label={label}
        required
        error={errorFn && errorFn(input)}
        helperText={helperTextFn ? helperTextFn(input) : undefined}
        value={input}
        sx={{ width: "100%" }}
        onChange={(e) => setInput(e.target.value)}
      />
      {dirty ? (
        <Button
          variant="outlined"
          onClick={() => {
            onSave(input);
          }}
        >
          {saveBtnTextFn ? saveBtnTextFn(input) : "保存"}
        </Button>
      ) : null}
    </Stack>
  );
};
export default memo(LazyInput);
