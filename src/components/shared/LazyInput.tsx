import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";

// 带有确认按钮的输入框
const LazyInput: React.FC<{
  label: string;
  initValue: string;
  onSave: (text: string) => any;
  errorFn?: (input: string) => boolean;
  helperTextFn?: (input: string) => string;
  saveBtnTextFn?: (input: string) => string;
}> = ({ label, initValue, onSave, errorFn, helperTextFn, saveBtnTextFn }) => {
  const [input, setInput] = useState(initValue);
  const dirty = input !== initValue;
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
            setLastSave(input);
            onSave(input);
          }}
        >
          {saveBtnTextFn ? saveBtnTextFn(input) : "保存"}
        </Button>
      ) : null}
    </Stack>
  );
};
export default LazyInput;
