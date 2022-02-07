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
import { useTranslation } from "react-i18next";

export const FilterSetting = () => {
  const { filterConfig, setFilterConfig } = useContext(configContext);
  const [localConfig, setLocalConfig] = useState(filterConfig);
  const { t } = useTranslation()

  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={3} md={1} xl={1}>
          <FormControlLabel
            label={t("setting.filter.revert") as string}
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
            {t("setting.filter.binaryThreshold")}
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
            label={t("setting.filter.erodeKernalSize")}
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
            label={t("setting.filter.erodeIterations")}
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
            label={t("setting.filter.dilateKernalSize")}
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
            label={t("setting.filter.dilateIterations")}
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
            {t("setting.filter.dpiNormalization")}
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
        {t("setting.filter.apply")}
      </Button>
    </div>
  );
};

export default FilterSetting;
