import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";

const Navbar: React.FC = (props) => {
  const items: { title: string; path: string }[] = [
    {
      title: "主页",
      path: "/#/",
    },
    { title: "翻译器", path: "/#/trans" },
    { title: "设置", path: "/#/setting" },
    { title: "关于", path: "/#/about" },
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
