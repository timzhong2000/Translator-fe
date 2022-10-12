import { FC } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import {
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  Slider,
  TextField,
} from "@mui/material";
import { useConfig } from "@/context";

const FilterSetting: FC = () => {
  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={3} md={1} xl={1}>
          <InverseCheckBox />
        </Grid>
        <Grid item xs={6} md={6} xl={2}>
          <BinaryThresholdSlider />
        </Grid>
        <Grid item xs={3} md={2} xl={1}>
          <ErodeKernalSizeInput />
        </Grid>
        <Grid item xs={3} md={2} xl={1}>
          <ErodeIterationsInput />
        </Grid>
        <Grid item xs={3} md={2} xl={1}>
          <DilateKernelSizeInput />
        </Grid>
        <Grid item xs={3} md={2} xl={1}>
          <DilateIterationsInput />
        </Grid>
        <Grid item xs={6} md={6} xl={2}>
          <ZoomSlider />
        </Grid>
      </Grid>
    </div>
  );
};

const DilateIterationsInput = observer(() => {
  const { t } = useTranslation();

  const {
    filterConfig: { dilateIterations },
    setDilateIterations,
  } = useConfig();

  return (
    <TextField
      label={t("setting.filter.dilateIterations")}
      required
      value={dilateIterations}
      sx={{ width: "100%" }}
      onChange={(e) => setDilateIterations(Number(e.target.value))}
    />
  );
});

const ErodeIterationsInput = observer(() => {
  const { t } = useTranslation();

  const {
    filterConfig: { erodeIterations },
    setErodeIterations,
  } = useConfig();

  return (
    <TextField
      label={t("setting.filter.erodeIterations")}
      required
      value={erodeIterations}
      sx={{ width: "100%" }}
      onChange={(e) => setErodeIterations(Number(e.target.value))}
    />
  );
});

const DilateKernelSizeInput = observer(() => {
  const { t } = useTranslation();
  const {
    filterConfig: { dilateKernelSize },
    setDilateKernelSize,
  } = useConfig();

  return (
    <TextField
      label={t("setting.filter.dilateKernalSize")}
      required
      value={dilateKernelSize}
      sx={{ width: "100%" }}
      onChange={(e) => setDilateKernelSize(Number(e.target.value))}
    />
  );
});

const ErodeKernalSizeInput = observer(() => {
  const { t } = useTranslation();

  const {
    filterConfig: { erodeKernelSize },
    setErodeKernelSize,
  } = useConfig();

  return (
    <TextField
      label={t("setting.filter.erodeKernalSize")}
      required
      value={erodeKernelSize}
      sx={{ width: "100%" }}
      onChange={(e) => setErodeKernelSize(Number(e.target.value))}
    />
  );
});

const InverseCheckBox = observer(() => {
  const { t } = useTranslation();
  const {
    filterConfig: { inverse },
    toggleInverse,
  } = useConfig();

  return (
    <FormControlLabel
      label={t("setting.filter.revert") as string}
      control={<Checkbox checked={inverse} onClick={() => toggleInverse()} />}
    />
  );
});

const BinaryThresholdSlider = observer(() => {
  const { t } = useTranslation();

  const {
    filterConfig: { binaryThreshold },
    setBinaryThreshold,
  } = useConfig();

  return (
    <>
      <Typography id="binaryThreshold-slider" gutterBottom>
        {t("setting.filter.binaryThreshold")}
      </Typography>
      <Slider
        value={binaryThreshold}
        aria-labelledby="binaryThreshold-slider"
        valueLabelDisplay="auto"
        min={1}
        max={255}
        onChange={(_, val) =>
          setBinaryThreshold(typeof val === "number" ? val : 10)
        }
      />
    </>
  );
});

const ZoomSlider = observer(() => {
  const { t } = useTranslation();

  const {
    setZoom,
    filterConfig: { zoom },
  } = useConfig();

  return (
    <>
      <Typography id="zoomNormalization-slider" gutterBottom>
        {t("setting.filter.dpiNormalization")}
      </Typography>
      <Slider
        value={zoom}
        aria-labelledby="zoomNormalization-slider"
        valueLabelDisplay="auto"
        min={1}
        max={5}
        onChange={(_, val) => setZoom(typeof val === "number" ? val : 1)}
      />
    </>
  );
});

export default FilterSetting;
