import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = (props) => {
  const {t, i18n} = useTranslation();

  const items: { title: string; path: string }[] = [
    {
      title: t("navbar.home"),
      path: "/#/",
    },
    { title: t("navbar.translator"), path: "/#/trans" },
    { title: t("navbar.virtualScreen"), path: "/#/vscreen" },
    { title: t("navbar.setting"), path: "/#/setting" },
    { title: t("navbar.about"), path: "/#/about" },
  ];
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            {items.map((item) => (
              <Typography key={item.title} color="inherit" component="div">
                <Button
                  href={item.path}
                  color="inherit"
                  sx={{ fontSize: 18, padding: "0 1em" }}
                >
                  {item.title}
                </Button>
              </Typography>
            ))}
          </Toolbar>
        </AppBar>
      </Box>
      {props.children}
    </div>
  );
};

export default Navbar;
