import { storeContext } from "@/context/store";
import { useTranslation } from "react-i18next";
import {
  ConnectedComponentType,
  createConnector,
} from "@/context/connector";
import { FilterConfig } from "@/types/globalConfig";
import { useState } from "react";
import { Grid, FormControlLabel, Checkbox, Typography, Slider, TextField } from "@mui/material";

const connector = createConnector(
  storeContext,
  ({ filterConfig }) => ({
    filterConfig,
  }),
  ({ filterConfig, setFilterConfig }) => {
    const partialSet = (val: Partial<FilterConfig>) => {
      setFilterConfig({
        ...filterConfig,
        ...val,
      });
    };

    return {
      filterConfig,
      toggleInverse: () => partialSet({ inverse: !filterConfig.inverse }),
      setBinaryThreshold: (val: number) => partialSet({ binaryThreshold: val }),
      setErodeKernelSize: (val: number) => partialSet({ erodeKernelSize: val }),
      setErodeIterations: (val: number) => partialSet({ erodeIterations: val }),
      setDilateKernelSize: (val: number) =>
        partialSet({ dilateKernelSize: val }),
      setDilateIterations: (val: number) =>
        partialSet({ dilateIterations: val }),
      setZoom: (val: number) => partialSet({ zoom: val }),
    };
  }
);

const FilterSetting: ConnectedComponentType<typeof connector> = ({
  filterConfig,
  toggleInverse,
  setBinaryThreshold,
  setErodeKernelSize,
  setErodeIterations,
  setDilateKernelSize,
  setDilateIterations,
  setZoom,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={3} md={1} xl={1}>
          <FormControlLabel
            label={t("setting.filter.revert") as string}
            control={
              <Checkbox
                checked={filterConfig.inverse}
                onClick={() => toggleInverse()}
              />
            }
          ></FormControlLabel>
        </Grid>
        <Grid item xs={6} md={6} xl={2}>
          <Typography id="binaryThreshold-slider" gutterBottom>
            {t("setting.filter.binaryThreshold")}
          </Typography>
          <Slider
            value={filterConfig.binaryThreshold}
            aria-labelledby="binaryThreshold-slider"
            valueLabelDisplay="auto"
            min={1}
            max={255}
            onChange={(e) =>
              setBinaryThreshold(Number((e.target as unknown as any).value))
            }
          />
        </Grid>
        <Grid item xs={3} md={2} xl={1}>
          <TextField
            label={t("setting.filter.erodeKernalSize")}
            required
            value={filterConfig.erodeKernelSize}
            sx={{ width: "100%" }}
            onChange={(e) => setErodeKernelSize(Number(e.target.value))}
          ></TextField>
        </Grid>
        <Grid item xs={3} md={2} xl={1}>
          <TextField
            label={t("setting.filter.erodeIterations")}
            required
            value={filterConfig.erodeIterations}
            sx={{ width: "100%" }}
            onChange={(e) => setErodeIterations(Number(e.target.value))}
          ></TextField>
        </Grid>
        <Grid item xs={3} md={2} xl={1}>
          <TextField
            label={t("setting.filter.dilateKernalSize")}
            required
            value={filterConfig.dilateKernelSize}
            sx={{ width: "100%" }}
            onChange={(e) => setDilateKernelSize(Number(e.target.value))}
          ></TextField>
        </Grid>
        <Grid item xs={3} md={2} xl={1}>
          <TextField
            label={t("setting.filter.dilateIterations")}
            required
            value={filterConfig.dilateIterations}
            sx={{ width: "100%" }}
            onChange={(e) => setDilateIterations(Number(e.target.value))}
          ></TextField>
        </Grid>
        <Grid item xs={6} md={6} xl={2}>
          <Typography id="zoomNormalization-slider" gutterBottom>
            {t("setting.filter.dpiNormalization")}
          </Typography>
          <Slider
            value={filterConfig.zoom}
            aria-labelledby="zoomNormalization-slider"
            valueLabelDisplay="auto"
            min={1}
            max={5}
            onChange={(e) =>
              setZoom(Number((e.target as unknown as any).value))
            }
          />
        </Grid>
        <Test/>
      </Grid>
    </div>
  );
};

const Test = () => {
  const [data, setData] = useState(1);
  return (
    <Grid item xs={6} md={6} xl={2}>
      <Typography id="binaryThreshold-slider" gutterBottom>
        {"test"}
      </Typography>
      <Slider
        value={data}
        aria-labelledby="binaryThreshold-slider"
        valueLabelDisplay="auto"
        min={1}
        max={255}
        onChange={(e) => setData(Number((e.target as unknown as any).value))}
      />
    </Grid>
  );
};

export default connector(FilterSetting);
