import { useContext, useState } from "react";
import {
  Grid,
  Typography,
  Slider,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { configContext } from "@/context/config";
import stream from "stream";

export const FilterSetting = () => {
  const { filterConfig, setFilterConfig } = useContext(configContext);
  const [localConfig, setLocalConfig] = useState(filterConfig);
  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={3} md={1} xl={1}>
          <FormControlLabel
            label="反色"
            control={
              <Checkbox
                checked={localConfig.inverse}
                onClick={() =>
                  setLocalConfig({
                    ...localConfig,
                    inverse: !localConfig.inverse,
                  })
                }
              />
            }
          ></FormControlLabel>
        </Grid>
        <Grid item xs={6} md={6} xl={2}>
          <Typography id="binaryThreshold-slider" gutterBottom>
            二值化阈值
          </Typography>
          <Slider
            value={localConfig.binaryThreshold}
            aria-labelledby="binaryThreshold-slider"
            valueLabelDisplay="auto"
            min={1}
            max={255}
            onChange={(e) =>
              setLocalConfig({
                ...localConfig,
                binaryThreshold: Number((e.target as unknown as any).value),
              })
            }
          />
        </Grid>
        <Grid item xs={3} md={2} xl={1}>
          <TextField
            label="Erode卷积核大小"
            required
            value={localConfig.erodeKernelSize}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig({
                ...localConfig,
                erodeKernelSize: Number(e.target.value),
              })
            }
          ></TextField>
        </Grid>
        <Grid item xs={3} md={2} xl={1}>
          <TextField
            label="Erode迭代次数"
            required
            value={localConfig.erodeIterations}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig({
                ...localConfig,
                erodeIterations: Number(e.target.value),
              })
            }
          ></TextField>
        </Grid>
        <Grid item xs={3} md={2} xl={1}>
          <TextField
            label="Dilate卷积核大小"
            required
            value={localConfig.dilateKernelSize}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig({
                ...localConfig,
                dilateKernelSize: Number(e.target.value),
              })
            }
          ></TextField>
        </Grid>
        <Grid item xs={3} md={2} xl={1}>
          <TextField
            label="Dilate迭代次数"
            required
            value={localConfig.dilateIterations}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig({
                ...localConfig,
                dilateIterations: Number(e.target.value),
              })
            }
          ></TextField>
        </Grid>
        <Grid item xs={6} md={6} xl={2}>
          <Typography id="zoomNormalization-slider" gutterBottom>
            文字大小标准化
          </Typography>
          <Slider
            value={localConfig.zoom}
            aria-labelledby="zoomNormalization-slider"
            valueLabelDisplay="auto"
            min={1}
            max={5}
            onChange={(e) =>
              setLocalConfig({
                ...localConfig,
                zoom: Number((e.target as unknown as any).value),
              })
            }
          />
        </Grid>
      </Grid>
      <Button variant="outlined" onClick={() => setFilterConfig(localConfig)}>
        保存
      </Button>
    </div>
  );
};

export default FilterSetting;
