import { useContext, useState } from "react";
import { Grid, TextField, Button } from "@mui/material";

import { configContext } from "@/context/config";

const TranslateServerConfig = () => {
  const { translatorConfig, setTranslatorConfig } = useContext(configContext);
  const [localConfig, setLocalConfig] = useState(translatorConfig);
  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item sm={12} md={6} xl={3}>
          <TextField
            label="翻译服务器"
            required
            error={localConfig.url == ""}
            helperText={localConfig.url == "" ? "请输入翻译服务器" : ""}
            value={localConfig.url}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig((prev) => ({ ...prev, url: e.target.value }))
            }
          />
        </Grid>
        <Grid item sm={12} md={6} xl={2}>
          <TextField
            label="密钥"
            value={localConfig.key}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig((prev) => ({ ...prev, key: e.target.value }))
            }
          />
        </Grid>
      </Grid>
      <Button
        variant="outlined"
        onClick={() => {
          setTranslatorConfig(localConfig);
        }}
      >
        保存自定义服务器
      </Button>
    </div>
  );
};

export default TranslateServerConfig